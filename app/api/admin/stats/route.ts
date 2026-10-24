import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      ordersToday,
      pendingOrders,
      preparingOrders,
      readyOrders,
      outForDeliveryOrders,
      deliveredOrders,
      cancelledOrders,
      totalOrders,
      revenueResult,
      topOrderItems,
    ] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      prisma.order.count({ where: { fulfillmentStatus: "PENDING" } }),
      prisma.order.count({ where: { fulfillmentStatus: "PREPARING" } }),
      prisma.order.count({ where: { fulfillmentStatus: "READY" } }),
      prisma.order.count({ where: { fulfillmentStatus: "OUT_FOR_DELIVERY" } }),
      prisma.order.count({ where: { fulfillmentStatus: "DELIVERED" } }),
      prisma.order.count({ where: { fulfillmentStatus: "CANCELLED" } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          OR: [
            { paymentStatus: "PAID" },
            { fulfillmentStatus: "DELIVERED" },
          ],
        },
      }),
      prisma.orderItem.groupBy({
        by: ["productName"],
        _sum: { quantity: true, lineTotal: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ]);

    const formattedTopSelling = topOrderItems.map((item) => ({
      name: item.productName,
      quantitySold: item._sum.quantity || 0,
      totalRevenue: item._sum.lineTotal || 0,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        ordersToday,
        pendingOrders,
        preparingOrders,
        readyOrders,
        outForDeliveryOrders,
        deliveredOrders,
        cancelledOrders,
        totalOrders,
        totalRevenue: revenueResult._sum.total || 0,
        topSellingDesserts: formattedTopSelling,
      },
    });
  } catch (error) {
    console.error("Error computing admin stats:", error);
    return NextResponse.json(
      { error: "Failed to compute dashboard stats" },
      { status: 500 }
    );
  }
}
