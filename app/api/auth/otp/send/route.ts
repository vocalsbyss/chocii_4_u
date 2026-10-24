import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { normalizePhone } from "@/lib/phone";
import { sendOtpEmail, SendEmailResult } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    const phoneInfo = normalizePhone(phone);
    if (!phoneInfo) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid 10-digit mobile number (e.g., 8688367177).",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid email address (e.g. name@gmail.com) to receive your verification code.",
        },
        { status: 400 }
      );
    }

    const normalizedPhone = phoneInfo.normalized;
    const normalizedEmail = email.trim().toLowerCase();

    // Rate limiting: check recent OTP requests for this phone or email
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000);
    const recentOtp = await prisma.otpVerification.findFirst({
      where: {
        OR: [
          { phone: normalizedPhone },
          { email: normalizedEmail },
        ],
        createdAt: { gte: sixtySecondsAgo },
        verified: false,
      },
      orderBy: { createdAt: "desc" },
    });

    if (recentOtp) {
      const waitTimeSec = Math.ceil(
        (recentOtp.createdAt.getTime() + 60 * 1000 - Date.now()) / 1000
      );
      if (waitTimeSec > 0) {
        return NextResponse.json(
          {
            error: `Please wait ${waitTimeSec}s before requesting a new verification code.`,
            retryAfter: waitTimeSec,
          },
          { status: 429 }
        );
      }
    }

    // Generate secure 6-digit OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

    // Save OTP to database with try/catch fallback
    try {
      await prisma.otpVerification.create({
        data: {
          phone: normalizedPhone,
          email: normalizedEmail,
          code: otpCode,
          expiresAt,
          attempts: 0,
          verified: false,
        },
      });
    } catch (dbErr) {
      console.warn("Could not save OTP to DB (serverless read-only fallback):", dbErr);
    }

    // Dispatch verification code to customer's Email
    let emailResult: SendEmailResult = { success: false, provider: "development" };
    try {
      emailResult = await sendOtpEmail({
        toEmail: normalizedEmail,
        customerName: name.trim(),
        code: otpCode,
        phone: normalizedPhone,
      });
    } catch (sendErr) {
      console.error("sendOtpEmail exception:", sendErr);
    }

    const isLiveProvider =
      emailResult.success &&
      (emailResult.provider === "resend" ||
        emailResult.provider === "brevo" ||
        emailResult.provider === "smtp");

    return NextResponse.json({
      success: true,
      message: isLiveProvider
        ? `A 6-digit verification code has been sent to your email (${normalizedEmail})`
        : `Email service in setup mode. Your verification code is ${otpCode}`,
      phone: normalizedPhone,
      email: normalizedEmail,
      demoCode: !isLiveProvider ? otpCode : undefined,
      isLiveEmail: isLiveProvider,
      cooldownSeconds: 60,
    });
  } catch (error) {
    console.error("Error in OTP send route:", error);
    return NextResponse.json(
      { error: "Failed to send verification code. Please try again." },
      { status: 500 }
    );
  }
}
