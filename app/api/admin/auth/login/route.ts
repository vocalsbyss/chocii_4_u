import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

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

    const cleanedPhone = phone.trim();

    // Look for admin user
    const adminUser = await prisma.user.findFirst({
      where: {
        phone: cleanedPhone,
        role: "ADMIN",
      },
    });

    if (!adminUser || !adminUser.password) {
      return NextResponse.json(
        { error: "Invalid admin credentials or account not found." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid admin credentials." },
        { status: 401 }
      );
    }

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
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error during admin authentication." },
      { status: 500 }
    );
  }
}
