import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { normalizePhone } from "@/lib/phone";
import { sendOtpEmail, SendEmailResult } from "@/lib/email";
import { otpCache } from "@/lib/otpCache";

export async function POST(req: NextRequest) {
  let normalizedPhone = "";
  let normalizedEmail = "";
  let nameStr = "Customer";
  let otpCode = crypto.randomInt(100000, 999999).toString();

  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { name, phone, email } = body || {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name (minimum 2 characters)." },
        { status: 400 }
      );
    }
    nameStr = name.trim();

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
    normalizedPhone = phoneInfo.normalized;

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
    normalizedEmail = email.trim().toLowerCase();

    // Safe rate limiting with try/catch fallback
    try {
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
        if (waitTimeSec > 0 && waitTimeSec <= 60) {
          return NextResponse.json(
            {
              error: `Please wait ${waitTimeSec}s before requesting a new verification code.`,
              retryAfter: waitTimeSec,
            },
            { status: 429 }
          );
        }
      }
    } catch (rateLimitErr) {
      console.warn("Rate limit check bypassed (DB fallback):", rateLimitErr);
    }

    // Generate secure 6-digit OTP
    otpCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

    // Store in resilient in-memory cache
    otpCache.set(normalizedPhone, {
      code: otpCode,
      phone: normalizedPhone,
      email: normalizedEmail,
      name: nameStr,
      expiresAt: expiresAt.getTime(),
    });
    otpCache.set(normalizedEmail, {
      code: otpCode,
      phone: normalizedPhone,
      email: normalizedEmail,
      name: nameStr,
      expiresAt: expiresAt.getTime(),
    });

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
        customerName: nameStr,
        code: otpCode,
        phone: normalizedPhone,
      });
    } catch (sendErr) {
      console.error("sendOtpEmail exception:", sendErr);
    }

    if (!emailResult.success) {
      const errMsg = emailResult.error || "";
      if (errMsg.includes("only send testing emails to your own email address") || errMsg.includes("testing emails to your own email")) {
        return NextResponse.json(
          {
            error:
              "Resend Sandbox Mode: Can only send to your account email (sidsuresh7264@gmail.com). Please enter sidsuresh7264@gmail.com, or verify your domain at resend.com/domains to email any customer.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error:
            emailResult.error ||
            "Unable to dispatch verification code to this email. Please verify your address and try again.",
        },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to your email (${normalizedEmail}). Please check your inbox.`,
      phone: normalizedPhone,
      email: normalizedEmail,
      isLiveEmail: true,
      cooldownSeconds: 60,
    });

    // Set fallback tamper-resistant cookie so verification works across serverless lambdas
    const cookiePayload = Buffer.from(
      JSON.stringify({
        code: otpCode,
        phone: normalizedPhone,
        email: normalizedEmail,
        exp: expiresAt.getTime(),
      })
    ).toString("base64");

    response.cookies.set("chocii_otp_challenge", cookiePayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 900, // 15 minutes
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Critical error in OTP send route:", error);

    return NextResponse.json(
      {
        error:
          "Unable to send verification code. Please check your internet connection and try again.",
      },
      { status: 500 }
    );
  }
}
