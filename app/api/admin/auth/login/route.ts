import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: "Phone number and password are required." },
        { status: 400 }
      );
    }

    const cleanedPhone = phone.trim().replace(/\s+/g, "");

    // 1. Direct Root Admin validation (guaranteed zero-latency, zero-failure)
    const defaultPhone = "+919999999999";
    const defaultPass = process.env.ADMIN_DEFAULT_PASSWORD || "CravingsAdmin@2026";

    const isRootPhone =
      cleanedPhone === defaultPhone ||
      cleanedPhone === "9999999999" ||
      cleanedPhone === "+91-9999999999";

    if (isRootPhone && password === defaultPass) {
      const token = signToken({
        userId: "admin-root",
        name: "Head Chef & Admin",
        phone: defaultPhone,
        role: "ADMIN",
      });

      const response = NextResponse.json({
        success: true,
        message: "Admin authentication successful",
        user: {
          id: "admin-root",
          name: "Head Chef & Admin",
          phone: defaultPhone,
          role: "ADMIN",
        },
      });

      response.cookies.set(ADMIN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3 * 24 * 60 * 60, // 3 days
        path: "/",
      });

      return response;
    }

    // 2. Custom Admin database lookup
    try {
      const adminUser = await prisma.user.findFirst({
        where: {
          phone: cleanedPhone,
          role: "ADMIN",
        },
      });

      if (adminUser && adminUser.password) {
        const isMatch = await bcrypt.compare(password, adminUser.password);
        if (isMatch) {
          const token = signToken({
            userId: adminUser.id,
            name: adminUser.name,
            phone: adminUser.phone,
            role: "ADMIN",
          });

          const response = NextResponse.json({
            success: true,
            message: "Admin authentication successful",
            user: {
              id: adminUser.id,
              name: adminUser.name,
              phone: adminUser.phone,
              role: adminUser.role,
            },
          });

          response.cookies.set(ADMIN_COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 3 * 24 * 60 * 60, // 3 days
            path: "/",
          });

          return response;
        }
      }
    } catch (dbErr) {
      console.warn("Database lookup failed during admin authentication:", dbErr);
    }

    return NextResponse.json(
      { error: "Invalid admin phone number or password." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Invalid login request format." },
      { status: 400 }
    );
  }
}
