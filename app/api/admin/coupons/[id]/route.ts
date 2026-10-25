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
    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete coupon" },
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
    const { isActive, discountValue, minOrderValue, maxDiscount, validTill, usageLimit, description } = body;

    const dataToUpdate: any = {};
    if (isActive !== undefined) dataToUpdate.isActive = Boolean(isActive);
    if (discountValue !== undefined) dataToUpdate.discountValue = Number(discountValue);
    if (minOrderValue !== undefined) dataToUpdate.minOrderValue = Number(minOrderValue);
    if (maxDiscount !== undefined) dataToUpdate.maxDiscount = maxDiscount ? Number(maxDiscount) : null;
    if (validTill !== undefined) dataToUpdate.validTill = validTill ? new Date(validTill) : null;
    if (usageLimit !== undefined) dataToUpdate.usageLimit = usageLimit ? parseInt(String(usageLimit), 10) : null;
    if (description !== undefined) dataToUpdate.description = description;

    const updated = await prisma.coupon.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, coupon: updated });
  } catch (error: any) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update coupon" },
      { status: 500 }
    );
  }
}
