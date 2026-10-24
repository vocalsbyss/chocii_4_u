import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, admin: null }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
      },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ authenticated: false, admin: null }, { status: 403 });
    }

    return NextResponse.json({
      authenticated: true,
      admin,
    });
  } catch (error) {
    console.error("Admin session check error:", error);
    return NextResponse.json({ authenticated: false, admin: null }, { status: 500 });
  }
}
