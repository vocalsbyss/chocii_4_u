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
        { error: "Admin mobile/username and password are required." },
        { status: 400 }
      );
    }

    const cleanedIdentifier = phone.trim();

    // 1. Valid Admin Passwords
    const validPasswords = [
      "Sure@7264",
      "CravingsAdmin@2026",
      process.env.ADMIN_DEFAULT_PASSWORD,
    ].filter(Boolean);

    // If password matches Sure@7264 (or env default), grant instant root admin access
    if (validPasswords.includes(password)) {
      const token = signToken({
        userId: "admin-root",
        name: "Head Chef & Admin",
        phone: cleanedIdentifier,
        role: "ADMIN",
      });

      const response = NextResponse.json({
        success: true,
        message: "Admin authentication successful",
        user: {
          id: "admin-root",
          name: "Head Chef & Admin",
          phone: cleanedIdentifier,
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

    // 2. Custom Admin database lookup for hashed password accounts
    try {
      const adminUser = await prisma.user.findFirst({
        where: {
          phone: cleanedIdentifier,
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
      { error: "Invalid admin credentials. Please check your password." },
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
