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

    // 1. Fetch all broadcast campaigns
    const broadcasts = await prisma.broadcast.findMany({
      orderBy: { createdAt: "desc" },
    });

    // 2. Fetch audience pool: distinct registered users & order contacts with valid emails
    const usersWithEmail = await prisma.user.findMany({
      where: {
        role: "CUSTOMER",
        email: { not: null },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    const ordersWithEmail = await prisma.order.findMany({
      where: {
        customerEmail: { not: null },
      },
      select: {
        customerName: true,
        customerEmail: true,
        customerPhone: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Consolidate unique email recipients
    const emailRecipientMap = new Map<string, { name: string; email: string; phone?: string }>();

    for (const u of usersWithEmail) {
      if (u.email && u.email.includes("@")) {
        emailRecipientMap.set(u.email.toLowerCase().trim(), {
          name: u.name || "Valued Foodie",
          email: u.email.toLowerCase().trim(),
          phone: u.phone,
        });
      }
    }

    for (const o of ordersWithEmail) {
      if (o.customerEmail && o.customerEmail.includes("@")) {
        const clean = o.customerEmail.toLowerCase().trim();
        if (!emailRecipientMap.has(clean)) {
          emailRecipientMap.set(clean, {
            name: o.customerName || "Valued Foodie",
            email: clean,
            phone: o.customerPhone,
          });
        }
      }
    }

    // Fallback: Default admin test recipient if database is fresh
    if (!emailRecipientMap.has("sidsuresh7264@gmail.com")) {
      emailRecipientMap.set("sidsuresh7264@gmail.com", {
        name: "Chef Suresh (Admin)",
        email: "sidsuresh7264@gmail.com",
        phone: "+918688367177",
      });
    }

    const recipients = Array.from(emailRecipientMap.values());

    return NextResponse.json({
      broadcasts,
      recipients,
      totalAudience: recipients.length,
    });
  } catch (error: any) {
    console.error("Error fetching broadcasts:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch broadcasts" },
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
      id,
      title,
      subject,
      message,
      occasion = "GENERAL",
      mediaUrl = null,
      mediaType = "image",
      offerCode = null,
      discountText = null,
      validTill = null,
      ctaText = "Claim Sweet Treat",
      ctaLink = "/#full-menu-section",
      isActiveBanner = true,
    } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message content are required for a broadcast campaign." },
        { status: 400 }
      );
    }

    // If making this active on storefront, deactivate all other active storefront banners
    if (isActiveBanner) {
      await prisma.broadcast.updateMany({
        where: { isActiveBanner: true },
        data: { isActiveBanner: false },
      });
    }

    let broadcast;
    if (id) {
      broadcast = await prisma.broadcast.update({
        where: { id },
        data: {
          title,
          subject: subject || title,
          message,
          occasion,
          mediaUrl,
          mediaType,
          offerCode: offerCode ? offerCode.trim().toUpperCase() : null,
          discountText,
          validTill,
          ctaText,
          ctaLink,
          isActiveBanner,
        },
      });
    } else {
      broadcast = await prisma.broadcast.create({
        data: {
          title,
          subject: subject || title,
          message,
          occasion,
          mediaUrl,
          mediaType,
          offerCode: offerCode ? offerCode.trim().toUpperCase() : null,
          discountText,
          validTill,
          ctaText,
          ctaLink,
          isActiveBanner,
          status: "DRAFT",
        },
      });
    }

    return NextResponse.json({
      success: true,
      broadcast,
    });
  } catch (error: any) {
    console.error("Error saving broadcast:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save broadcast" },
      { status: 500 }
    );
  }
}
