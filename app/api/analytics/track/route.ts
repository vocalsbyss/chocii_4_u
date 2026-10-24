import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const path = typeof body.path === "string" ? body.path : "/";
    const referrer = typeof body.referrer === "string" ? body.referrer : undefined;
    const device =
      body.device === "desktop" || body.device === "tablet" ? body.device : "mobile";
    const browser = typeof body.browser === "string" ? body.browser : "Mobile Safari";
    const city = "Visakhapatnam";

    // Ignore admin internal routes and api calls
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ success: true, ignored: true });
    }

    let visitorId = body.visitorId || req.cookies.get("chocii_vid")?.value;
    if (!visitorId) {
      visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    // Check customer session
    const session = await getCustomerSession();
    const isCustomer = Boolean(session);
    const customerId = session?.userId;

    // Detect if landing on order success
    let hasOrdered = false;
    let orderNumber: string | undefined = undefined;
    if (path.includes("/order-success/")) {
      hasOrdered = true;
      const parts = path.split("/order-success/");
      if (parts[1]) {
        orderNumber = parts[1].split("?")[0];
      }
    }

    await prisma.pageVisit.create({
      data: {
        visitorId,
        path,
        referrer: referrer || (req.headers.get("referer") ?? null),
        device,
        browser,
        city,
        isCustomer,
        customerId: customerId ?? null,
        hasOrdered,
        orderNumber: orderNumber ?? null,
      },
    });

    const response = NextResponse.json({ success: true, visitorId });
    if (!req.cookies.get("chocii_vid")) {
      response.cookies.set("chocii_vid", visitorId, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
        sameSite: "lax",
      });
    }
    return response;
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
