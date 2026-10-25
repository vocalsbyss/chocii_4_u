import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";

    const now = new Date();
    let startDate: Date;

    if (range === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    } else if (range === "30d") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (range === "all") {
      startDate = new Date(0);
    } else {
      // Default 7 days
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Query Page Visits and Orders in this range safely
    let visits: any[] = [];
    let orders: any[] = [];

    try {
      visits = await prisma.pageVisit.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { createdAt: "desc" },
      });
    } catch (visitErr) {
      console.warn("Could not query PageVisit records:", visitErr);
    }

    try {
      orders = await prisma.order.findMany({
        where: { createdAt: { gte: startDate } },
        select: {
          id: true,
          orderNumber: true,
          total: true,
          createdAt: true,
          customerName: true,
          customerPhone: true,
          paymentMethod: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (orderErr) {
      console.warn("Could not query Order records:", orderErr);
    }
    // 1. High-Level Metrics
    const uniqueVisitorIds = new Set(visits.map((v) => v.visitorId));
    const uniqueVisitorsCount = uniqueVisitorIds.size;
    const totalPageViews = visits.length;
    const totalOrdersCount = orders.length;
    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
    const conversionRate =
      uniqueVisitorsCount > 0
        ? parseFloat(((totalOrdersCount / uniqueVisitorsCount) * 100).toFixed(1))
        : 0;
    const avgOrderValue =
      totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
    const avgPagesPerVisitor =
      uniqueVisitorsCount > 0
        ? parseFloat((totalPageViews / uniqueVisitorsCount).toFixed(1))
        : 0;

    // 2. Conversion Funnel Analysis
    const visitorsWithMenu = new Set(
      visits
        .filter((v) => v.path === "/menu" || v.path.startsWith("/menu/"))
        .map((v) => v.visitorId)
    );
    const visitorsWithCart = new Set(
      visits.filter((v) => v.path === "/cart").map((v) => v.visitorId)
    );
    const visitorsWithCheckout = new Set(
      visits.filter((v) => v.path === "/checkout").map((v) => v.visitorId)
    );

    const funnel = {
      totalVisitors: uniqueVisitorsCount,
      viewedMenu: visitorsWithMenu.size,
      viewedCart: visitorsWithCart.size,
      reachedCheckout: visitorsWithCheckout.size,
      completedOrders: totalOrdersCount,
      menuConversionRate:
        uniqueVisitorsCount > 0
          ? Math.round((visitorsWithMenu.size / uniqueVisitorsCount) * 100)
          : 0,
      cartConversionRate:
        visitorsWithMenu.size > 0
          ? Math.round((visitorsWithCart.size / visitorsWithMenu.size) * 100)
          : 0,
      checkoutConversionRate:
        visitorsWithCart.size > 0
          ? Math.round((visitorsWithCheckout.size / visitorsWithCart.size) * 100)
          : 0,
      orderConversionRate:
        visitorsWithCheckout.size > 0
          ? Math.round((totalOrdersCount / visitorsWithCheckout.size) * 100)
          : 0,
    };

    // 3. Device Breakdown
    const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 };
    visits.forEach((v) => {
      const dev = v.device === "desktop" ? "desktop" : v.device === "tablet" ? "tablet" : "mobile";
      deviceCounts[dev]++;
    });
    const deviceTotal = totalPageViews || 1;
    const devices = {
      mobile: {
        count: deviceCounts.mobile,
        percentage: Math.round((deviceCounts.mobile / deviceTotal) * 100),
      },
      desktop: {
        count: deviceCounts.desktop,
        percentage: Math.round((deviceCounts.desktop / deviceTotal) * 100),
      },
      tablet: {
        count: deviceCounts.tablet,
        percentage: Math.round((deviceCounts.tablet / deviceTotal) * 100),
      },
    };

    // 4. Top Visited Pages
    const pageMap = new Map<string, number>();
    visits.forEach((v) => {
      const cleanPath = v.path.split("?")[0];
      pageMap.set(cleanPath, (pageMap.get(cleanPath) || 0) + 1);
    });

    const topPages = Array.from(pageMap.entries())
      .map(([path, count]) => {
        let title = path;
        if (path === "/") title = "Homepage (Artistic Parallax Experience)";
        else if (path === "/menu") title = "Menu Catalog";
        else if (path === "/menu/dream-cake") title = "Signature Dream Cake (3D Atelier)";
        else if (path === "/menu/molten-brownie-bowl") title = "Molten Brownie Bowl";
        else if (path === "/menu/choco-churros-dips") title = "Choco Churros & Dips";
        else if (path === "/menu/fruizy-can-cake") title = "Fruizy & Can Cakes";
        else if (path === "/feedback") title = "Customer Sensory Reviews";
        else if (path === "/about") title = "About Chocii 4 U (Visakhapatnam)";
        else if (path === "/contact") title = "Contact & Madhavadhara Cloud Kitchen";
        else if (path === "/cart") title = "Shopping Cart";
        else if (path === "/checkout") title = "Checkout & Razorpay/COD";
        else if (path.startsWith("/order-success/")) title = "Order Success Confirmation";

        return {
          path,
          title,
          views: count,
          percentage: Math.round((count / deviceTotal) * 100),
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);

    // 5. Traffic Channels & Referrers
    const sourcesMap = {
      whatsapp: 0,
      google: 0,
      instagram: 0,
      direct: 0,
      other: 0,
    };

    visits.forEach((v) => {
      const ref = (v.referrer || "").toLowerCase();
      if (ref.includes("whatsapp")) sourcesMap.whatsapp++;
      else if (ref.includes("google")) sourcesMap.google++;
      else if (ref.includes("instagram") || ref.includes("facebook")) sourcesMap.instagram++;
      else if (!ref || ref.includes("direct") || ref.startsWith("/")) sourcesMap.direct++;
      else sourcesMap.other++;
    });

    const sources = [
      {
        channel: "Direct & Saved Bookmarks",
        count: sourcesMap.direct,
        percentage: Math.round((sourcesMap.direct / deviceTotal) * 100),
      },
      {
        channel: "WhatsApp Broadcasts & Referrals",
        count: sourcesMap.whatsapp,
        percentage: Math.round((sourcesMap.whatsapp / deviceTotal) * 100),
      },
      {
        channel: "Google Search (Organic)",
        count: sourcesMap.google,
        percentage: Math.round((sourcesMap.google / deviceTotal) * 100),
      },
      {
        channel: "Instagram & Social Media",
        count: sourcesMap.instagram,
        percentage: Math.round((sourcesMap.instagram / deviceTotal) * 100),
      },
      {
        channel: "Other Referrers",
        count: sourcesMap.other,
        percentage: Math.round((sourcesMap.other / deviceTotal) * 100),
      },
    ].sort((a, b) => b.count - a.count);

    // 6. Trend Timeline Series (Daily grouping)
    const trendMap = new Map<string, { visitors: Set<string>; views: number; orders: number }>();
    
    // Initialize day buckets for the range
    const daysCount = range === "today" ? 1 : range === "30d" ? 14 : range === "all" ? 10 : 7;
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      trendMap.set(key, { visitors: new Set(), views: 0, orders: 0 });
    }

    visits.forEach((v) => {
      const key = new Date(v.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
      if (trendMap.has(key)) {
        const bucket = trendMap.get(key)!;
        bucket.visitors.add(v.visitorId);
        bucket.views++;
      }
    });

    orders.forEach((o) => {
      const key = new Date(o.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
      if (trendMap.has(key)) {
        trendMap.get(key)!.orders++;
      }
    });

    const trends = Array.from(trendMap.entries()).map(([label, data]) => ({
      date: label,
      visitors: data.visitors.size,
      views: data.views,
      orders: data.orders,
      conversionRate:
        data.visitors.size > 0
          ? parseFloat(((data.orders / data.visitors.size) * 100).toFixed(1))
          : 0,
    }));

    // 7. Recent Visitor Feed (Latest 35 deduplicated visits)
    const recentVisits: any[] = [];
    const seenRecent = new Set<string>();

    for (const v of visits) {
      // Deduplicate visits from the same visitor on the same path within a 5-minute bucket
      const bucket = Math.floor(new Date(v.createdAt).getTime() / (5 * 60 * 1000));
      const key = `${v.visitorId}_${v.path}_${bucket}`;
      if (!seenRecent.has(key)) {
        seenRecent.add(key);
        recentVisits.push({
          id: v.id,
          visitorId: v.visitorId,
          path: v.path,
          device: v.device,
          browser: v.browser || "Browser",
          city: v.city || "Visakhapatnam",
          referrer: v.referrer || "Direct",
          isCustomer: v.isCustomer,
          hasOrdered: v.hasOrdered,
          orderNumber: v.orderNumber,
          createdAt: v.createdAt,
        });
      }
      if (recentVisits.length >= 35) break;
    }

    return NextResponse.json({
      success: true,
      range,
      metrics: {
        uniqueVisitors: uniqueVisitorsCount,
        totalPageViews,
        totalOrders: totalOrdersCount,
        totalRevenue,
        conversionRate,
        avgOrderValue,
        avgPagesPerVisitor,
      },
      funnel,
      devices,
      topPages,
      sources,
      trends,
      recentVisits,
    });
  } catch (error: any) {
    console.warn("Admin traffic analytics error, returning default empty metrics:", error);
    return NextResponse.json({
      success: true,
      range: "7d",
      metrics: {
        uniqueVisitors: 0,
        totalPageViews: 0,
        totalOrders: 0,
        totalRevenue: 0,
        conversionRate: 0,
        avgOrderValue: 0,
        avgPagesPerVisitor: 0,
      },
      funnel: {
        totalVisitors: 0,
        viewedMenu: 0,
        viewedCart: 0,
        reachedCheckout: 0,
        completedOrders: 0,
        menuConversionRate: 0,
        cartConversionRate: 0,
        checkoutConversionRate: 0,
        orderConversionRate: 0,
      },
      devices: {
        mobile: { count: 0, percentage: 0 },
        desktop: { count: 0, percentage: 0 },
        tablet: { count: 0, percentage: 0 },
      },
      topPages: [],
      sources: [],
      trends: [],
      recentVisits: [],
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const visitId = searchParams.get("id");
    let body: any = {};
    try {
      body = await req.json();
    } catch (_) {}

    const id = visitId || body.id || body.visitId;
    const action = body.action || searchParams.get("action");
    const range = body.range || searchParams.get("range");

    if (id) {
      await prisma.pageVisit.delete({ where: { id } });
      return NextResponse.json({
        success: true,
        message: "Page visit record deleted successfully.",
      });
    }

    if (action === "deduplicate") {
      // Find all duplicate visits: same visitorId, same path, within 5 minutes
      const allVisits = await prisma.pageVisit.findMany({
        orderBy: { createdAt: "desc" },
      });

      const idsToDelete: string[] = [];
      const seen = new Map<string, number>();

      for (const v of allVisits) {
        const key = `${v.visitorId}|${v.path}`;
        const time = new Date(v.createdAt).getTime();

        if (seen.has(key)) {
          const prevTime = seen.get(key)!;
          if (Math.abs(prevTime - time) < 5 * 60 * 1000) {
            idsToDelete.push(v.id);
            continue;
          }
        }
        seen.set(key, time);
      }

      let deletedCount = 0;
      if (idsToDelete.length > 0) {
        const delRes = await prisma.pageVisit.deleteMany({
          where: { id: { in: idsToDelete } },
        });
        deletedCount = delRes.count;
      }

      return NextResponse.json({
        success: true,
        count: deletedCount,
        message: `Removed ${deletedCount} duplicate page visits.`,
      });
    }

    // Clear by range or all
    let whereClause: any = {};
    if (range === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      whereClause.createdAt = { gte: today };
    } else if (range === "7d") {
      const sevenDays = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      whereClause.createdAt = { gte: sevenDays };
    } else if (range === "30d") {
      const thirtyDays = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      whereClause.createdAt = { gte: thirtyDays };
    }

    const res = await prisma.pageVisit.deleteMany({ where: whereClause });
    return NextResponse.json({
      success: true,
      count: res.count,
      message: `Cleared ${res.count} traffic page visit records.`,
    });
  } catch (error: any) {
    console.error("Error deleting traffic records:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete traffic records" },
      { status: 500 }
    );
  }
}
