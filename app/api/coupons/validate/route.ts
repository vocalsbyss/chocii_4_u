import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, subtotal } = body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { valid: false, error: "Please enter a coupon code." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase().replace(/\s+/g, "");
    const numericSubtotal = Number(subtotal) || 0;

    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon) {
      return NextResponse.json(
        { valid: false, error: `Coupon code "${cleanCode}" is invalid.` },
        { status: 404 }
      );
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { valid: false, error: `Coupon code "${cleanCode}" is currently inactive.` },
        { status: 400 }
      );
    }

    // Expiry check
    if (coupon.validTill && new Date() > new Date(coupon.validTill)) {
      return NextResponse.json(
        { valid: false, error: `Coupon code "${cleanCode}" has expired.` },
        { status: 400 }
      );
    }

    // Usage limit check
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { valid: false, error: `Coupon code "${cleanCode}" has reached its maximum usage limit.` },
        { status: 400 }
      );
    }

    // Minimum order value check
    if (coupon.minOrderValue > 0 && numericSubtotal < coupon.minOrderValue) {
      return NextResponse.json(
        {
          valid: false,
          error: `Minimum order value of ₹${coupon.minOrderValue} required to use "${cleanCode}". Add ₹${
            coupon.minOrderValue - numericSubtotal
          } more to apply.`,
        },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (numericSubtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, numericSubtotal);
    }

    discountAmount = Math.round(discountAmount);

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountAmount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      description: coupon.description || (coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT OFF`),
      minOrderValue: coupon.minOrderValue,
      maxDiscount: coupon.maxDiscount,
    });
  } catch (error: any) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to validate coupon code" },
      { status: 500 }
    );
  }
}
