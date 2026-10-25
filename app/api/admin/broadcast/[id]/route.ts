import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = params;
    await prisma.broadcast.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting broadcast:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete broadcast" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { isActiveBanner } = body;

    // If activating this banner, deactivate all others
    if (isActiveBanner) {
      await prisma.broadcast.updateMany({
        where: { isActiveBanner: true },
        data: { isActiveBanner: false },
      });
    }

    const updated = await prisma.broadcast.update({
      where: { id },
      data: {
        isActiveBanner: Boolean(isActiveBanner),
      },
    });

    return NextResponse.json({ success: true, broadcast: updated });
  } catch (error: any) {
    console.error("Error updating broadcast banner status:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to toggle broadcast banner" },
      { status: 500 }
    );
  }
}
