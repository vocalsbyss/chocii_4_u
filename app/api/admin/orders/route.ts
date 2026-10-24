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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const query = searchParams.get("q");

    const whereClause: any = {};

    if (status && status !== "ALL") {
      whereClause.fulfillmentStatus = status;
    }

    if (query && query.trim().length > 0) {
      const q = query.trim();
      whereClause.OR = [
        { orderNumber: { contains: q } },
        { customerName: { contains: q } },
        { customerPhone: { contains: q } },
      ];
    }

    const [orders, pendingCount, preparingCount, readyCount, outCount, deliveredCount, cancelledCount, totalCount] =
      await Promise.all([
        prisma.order.findMany({
          where: whereClause,
          include: {
            items: true,
            statusHistory: {
              orderBy: { createdAt: "desc" },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 100,
        }),
        prisma.order.count({ where: { fulfillmentStatus: "PENDING" } }),
        prisma.order.count({ where: { fulfillmentStatus: "PREPARING" } }),
        prisma.order.count({ where: { fulfillmentStatus: "READY" } }),
        prisma.order.count({ where: { fulfillmentStatus: "OUT_FOR_DELIVERY" } }),
        prisma.order.count({ where: { fulfillmentStatus: "DELIVERED" } }),
        prisma.order.count({ where: { fulfillmentStatus: "CANCELLED" } }),
        prisma.order.count(),
      ]);

    return NextResponse.json({
      success: true,
      orders,
      counts: {
        ALL: totalCount,
        PENDING: pendingCount,
        PREPARING: preparingCount,
        READY: readyCount,
        OUT_FOR_DELIVERY: outCount,
        DELIVERED: deliveredCount,
        CANCELLED: cancelledCount,
      },
    });
  } catch (error) {
    console.warn("Error fetching admin orders, returning empty list:", error);
    return NextResponse.json({
      success: true,
      orders: [],
      counts: {
        ALL: 0,
        PENDING: 0,
        PREPARING: 0,
        READY: 0,
        OUT_FOR_DELIVERY: 0,
        DELIVERED: 0,
        CANCELLED: 0,
      },
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
    const idParam = searchParams.get("id");
    let body: any = {};
    try {
      body = await req.json();
    } catch (_) {}

    const orderId = idParam || body.orderId || body.id;
    const orderIds: string[] = body.orderIds;
    const action = body.action || searchParams.get("action");

    if (action === "clear_all") {
      const res = await prisma.order.deleteMany({});
      return NextResponse.json({
        success: true,
        count: res.count,
        message: `Cleared all ${res.count} orders from the live board.`,
      });
    }

    if (action === "clear_test") {
      const res = await prisma.order.deleteMany({
        where: {
          OR: [
            { customerPhone: { contains: "9876543210" } },
            { customerPhone: { contains: "8888888888" } },
            { customerName: { contains: "Rohan Sharma" } },
            { customerName: { contains: "Quick Tester" } },
          ],
        },
      });
      return NextResponse.json({
        success: true,
        count: res.count,
        message: `Cleared ${res.count} test orders from the live board.`,
      });
    }

    if (orderIds && Array.isArray(orderIds) && orderIds.length > 0) {
      const res = await prisma.order.deleteMany({
        where: { id: { in: orderIds } },
      });
      return NextResponse.json({
        success: true,
        count: res.count,
        message: `Successfully deleted ${res.count} orders.`,
      });
    }

    if (orderId) {
      const order = await prisma.order.findFirst({
        where: {
          OR: [{ id: orderId }, { orderNumber: orderId }],
        },
      });
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      await prisma.order.delete({ where: { id: order.id } });
      return NextResponse.json({
        success: true,
        message: `Order #${order.orderNumber} deleted successfully.`,
      });
    }

    return NextResponse.json(
      { error: "Please specify an order ID or action to delete" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete order" },
      { status: 500 }
    );
  }
}
