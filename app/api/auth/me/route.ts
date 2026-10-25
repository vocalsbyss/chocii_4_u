import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    let user: any = null;
    try {
      user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
    } catch (dbErr) {
      console.warn("Could not query DB in /api/auth/me:", dbErr);
    }

    // If DB user exists, use it; otherwise fallback to cryptographically verified JWT session payload
    const effectiveUser = user || {
      id: session.userId,
      name: session.name || "Customer",
      phone: session.phone,
      email: session.email || "",
      role: session.role || "CUSTOMER",
    };

    return NextResponse.json({
      authenticated: true,
      user: effectiveUser,
    });
  } catch (error) {
    console.error("Error fetching current customer session:", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
}
