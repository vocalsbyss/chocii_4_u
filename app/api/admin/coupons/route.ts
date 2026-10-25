import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ coupons });
  } catch (error: any) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load coupons" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const {
      code,
      description,
      discountType = "PERCENTAGE", // "PERCENTAGE" | "FLAT"
      discountValue,
      minOrderValue = 0,
      maxDiscount = null,
      validTill = null,
      usageLimit = null,
      isActive = true,
    } = body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { error: "Coupon code is required." },
        { status: 400 }
      );
    }

    if (discountValue === undefined || discountValue === null || Number(discountValue) <= 0) {
      return NextResponse.json(
        { error: "A positive discount value is required." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase().replace(/\s+/g, "");

    // Check code uniqueness
    const existing = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Coupon code "${cleanCode}" already exists. Please choose a different code or edit the existing one.` },
        { status: 400 }
      );
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        description: description ? description.trim() : null,
        discountType: discountType === "FLAT" ? "FLAT" : "PERCENTAGE",
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue) || 0,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        validTill: validTill ? new Date(validTill) : null,
        usageLimit: usageLimit ? parseInt(String(usageLimit), 10) : null,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({
      success: true,
      coupon: newCoupon,
    });
  } catch (error: any) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create coupon" },
      { status: 500 }
    );
  }
}
