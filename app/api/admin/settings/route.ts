import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settingsList = await prisma.storeSetting.findMany();
    const settings: Record<string, string> = {};
    for (const item of settingsList) {
      settings[item.key] = item.value;
    }

    const envKeyId = process.env.RAZORPAY_KEY_ID || "";
    const envKeySecret = process.env.RAZORPAY_KEY_SECRET || "";

    const activeKeyId = settings.razorpayKeyId || envKeyId;
    const activeKeySecret = settings.razorpayKeySecret || envKeySecret;

    return NextResponse.json({
      success: true,
      settings: {
        brandName: settings.brandName || "chocii 4 u",
        brandTagline:
          settings.brandTagline || "A Little Treat, Just for You.",
        deliveryFee: parseFloat(settings.deliveryFee || "49"),
        freeDeliveryThreshold: parseFloat(
          settings.freeDeliveryThreshold || "599"
        ),
        minOrderValue: parseFloat(settings.minOrderValue || "199"),
        storeIsOpen: settings.storeIsOpen !== "false",
        openingHours: settings.openingHours || "12:00 PM - 01:00 AM",
        contactPhone: settings.contactPhone || "+91 86883 67177",
        instagramUrl:
          settings.instagramUrl || "https://instagram.com/chocii4u.official",
        razorpayKeyId: activeKeyId,
        razorpayKeySecret: activeKeySecret ? "••••••••••••" : "",
        storeUpiId: settings.storeUpiId || process.env.STORE_UPI_ID || "8688367177@okbizaxis",
        storeUpiName: settings.storeUpiName || settings.brandName || "chocii 4 u",
      },
    });
  } catch (error) {
    console.warn("Error fetching store settings, returning default settings:", error);
    return NextResponse.json({
      success: true,
      settings: {
        brandName: "chocii 4 u",
        brandTagline: "A Little Treat, Just for You.",
        deliveryFee: 49,
        freeDeliveryThreshold: 599,
        minOrderValue: 199,
        storeIsOpen: true,
        openingHours: "12:00 PM - 01:00 AM",
        contactPhone: "+91 86883 67177",
        instagramUrl: "https://instagram.com/chocii4u.official",
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
        razorpayKeySecret: "",
        storeUpiId: process.env.STORE_UPI_ID || "8688367177@okbizaxis",
        storeUpiName: "chocii 4 u",
      },
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();

    const allowedKeys = [
      "brandName",
      "brandTagline",
      "deliveryFee",
      "freeDeliveryThreshold",
      "minOrderValue",
      "storeIsOpen",
      "openingHours",
      "contactPhone",
      "instagramUrl",
      "razorpayKeyId",
      "razorpayKeySecret",
      "storeUpiId",
      "storeUpiName",
    ];

    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        // If razorpayKeySecret was masked with dots and not changed, do not overwrite
        if (key === "razorpayKeySecret" && String(body[key]).includes("•••")) {
          continue;
        }

        await prisma.storeSetting.upsert({
          where: { key },
          update: { value: String(body[key]).trim() },
          create: {
            key,
            value: String(body[key]).trim(),
            description: `Store setting for ${key}`,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Store settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating store settings:", error);
    return NextResponse.json(
      { error: "Failed to update store settings" },
      { status: 500 }
    );
  }
}
