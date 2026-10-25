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
    ];

    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        await prisma.storeSetting.upsert({
          where: { key },
          update: { value: String(body[key]) },
          create: {
            key,
            value: String(body[key]),
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
