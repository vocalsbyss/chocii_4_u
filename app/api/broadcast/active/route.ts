import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const activeBroadcast = await prisma.broadcast.findFirst({
      where: {
        isActiveBanner: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      hasActive: Boolean(activeBroadcast),
      broadcast: activeBroadcast || null,
    });
  } catch (error: any) {
    console.error("Error fetching active broadcast:", error);
    return NextResponse.json({ hasActive: false, broadcast: null });
  }
}
