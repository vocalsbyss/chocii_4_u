import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ authenticated: false, admin: null }, { status: 401 });
    }

    // Root admin session
    if (session.userId === "admin-root") {
      return NextResponse.json({
        authenticated: true,
        admin: {
          id: "admin-root",
          name: session.name || "Head Chef & Admin",
          phone: session.phone || "+919999999999",
          role: "ADMIN",
        },
      });
    }

    try {
      const admin = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          id: true,
          name: true,
          phone: true,
          role: true,
        },
      });

      if (admin && admin.role === "ADMIN") {
        return NextResponse.json({
          authenticated: true,
          admin,
        });
      }
    } catch (e) {
      console.warn("DB check in admin/auth/me failed, falling back to session claims:", e);
    }

    // If session token is verified as ADMIN, allow session
    return NextResponse.json({
      authenticated: true,
      admin: {
        id: session.userId,
        name: session.name || "Head Chef & Admin",
        phone: session.phone || "+919999999999",
        role: "ADMIN",
      },
    });
  } catch (error) {
    console.error("Admin session check error:", error);
    return NextResponse.json({ authenticated: false, admin: null }, { status: 500 });
  }
}
