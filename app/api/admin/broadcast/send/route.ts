import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { sendBroadcastEmailToRecipient, BroadcastEmailOptions } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const {
      broadcastId,
      campaign,
      sendToAll = true,
      customRecipients = [],
      testEmailOnly = false,
      testEmail = "sidsuresh7264@gmail.com",
    } = body;

    const activeCampaign: BroadcastEmailOptions & { id?: string } = campaign || (broadcastId
      ? await prisma.broadcast.findUnique({ where: { id: broadcastId } })
      : null);

    if (!activeCampaign) {
      return NextResponse.json(
        { error: "Campaign data or a valid broadcastId is required." },
        { status: 400 }
      );
    }

    // Determine target recipient list
    let targets: Array<{ name: string; email: string }> = [];

    if (testEmailOnly) {
      const email = (testEmail || "sidsuresh7264@gmail.com").trim();
      targets = [{ name: "Chef Suresh (Admin Preview)", email }];
    } else if (customRecipients && customRecipients.length > 0) {
      targets = customRecipients.map((c: any) => ({
        name: typeof c === "string" ? "Valued Foodie" : (c.name || "Valued Foodie"),
        email: typeof c === "string" ? c.trim() : (c.email || "").trim(),
      })).filter((t: any) => t.email && t.email.includes("@"));
    } else if (sendToAll) {
      // Gather all registered users with email
      const usersWithEmail = await prisma.user.findMany({
        where: {
          role: "CUSTOMER",
          email: { not: null },
        },
        select: {
          name: true,
          email: true,
        },
      });

      // Gather all orders with customerEmail
      const ordersWithEmail = await prisma.order.findMany({
        where: {
          customerEmail: { not: null },
        },
        select: {
          customerName: true,
          customerEmail: true,
        },
      });

      const uniqueMap = new Map<string, string>();
      for (const u of usersWithEmail) {
        if (u.email && u.email.includes("@")) {
          uniqueMap.set(u.email.toLowerCase().trim(), u.name || "Valued Foodie");
        }
      }
      for (const o of ordersWithEmail) {
        if (o.customerEmail && o.customerEmail.includes("@")) {
          const clean = o.customerEmail.toLowerCase().trim();
          if (!uniqueMap.has(clean)) {
            uniqueMap.set(clean, o.customerName || "Valued Foodie");
          }
        }
      }

      // Also ensure admin email is included
      if (!uniqueMap.has("sidsuresh7264@gmail.com")) {
        uniqueMap.set("sidsuresh7264@gmail.com", "Chef Suresh");
      }

      targets = Array.from(uniqueMap.entries()).map(([email, name]) => ({
        name,
        email,
      }));
    }

    if (targets.length === 0) {
      return NextResponse.json(
        { error: "No valid recipient email addresses found to send broadcast to." },
        { status: 400 }
      );
    }

    console.log(`[Broadcast] Starting broadcast dispatch to ${targets.length} recipients...`);

    let sentCount = 0;
    let failedCount = 0;
    const errors: Array<{ email: string; error: string }> = [];

    // Send emails sequentially or in small controlled micro-batches to respect rate limits
    for (let i = 0; i < targets.length; i++) {
      const recipient = targets[i];
      try {
        const result = await sendBroadcastEmailToRecipient({
          recipientEmail: recipient.email,
          recipientName: recipient.name,
          options: activeCampaign,
        });

        if (result.success) {
          sentCount++;
        } else {
          failedCount++;
          errors.push({ email: recipient.email, error: result.error || "Failed delivery" });
        }
      } catch (err: any) {
        failedCount++;
        errors.push({ email: recipient.email, error: err?.message || "Delivery exception" });
      }

      // Brief pause between emails to avoid hitting SMTP burst rate limits
      if (i < targets.length - 1 && targets.length > 3) {
        await new Promise((res) => setTimeout(res, 600));
      }
    }

    // Update broadcast record in database if it exists
    if (activeCampaign.id) {
      try {
        await prisma.broadcast.update({
          where: { id: activeCampaign.id },
          data: {
            status: "SENT",
            sentEmailCount: { increment: sentCount },
            totalRecipients: targets.length,
            lastSentAt: new Date(),
          },
        });
      } catch (dbErr) {
        console.warn("Could not update broadcast stats in DB:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      totalTargets: targets.length,
      sentCount,
      failedCount,
      errors: errors.slice(0, 5), // Return first few errors if any
      testPreviewOnly: testEmailOnly,
    });
  } catch (error: any) {
    console.error("Error executing broadcast send:", error);
    return NextResponse.json(
      { error: error?.message || "Internal error sending broadcast" },
      { status: 500 }
    );
  }
}
