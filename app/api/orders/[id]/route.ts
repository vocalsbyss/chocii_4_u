import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCustomerSession, getAdminSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const admin = await getAdminSession();
    const customer = await getCustomerSession();

    if (!admin && !customer) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If caller is customer, verify they own this order
    if (!admin && customer && order.customerId !== customer.userId) {
      return NextResponse.json(
        { error: "Access denied. You do not have permission to view this order." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return NextResponse.json(
      { error: "Failed to load order details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await getCustomerSession();
    if (!customer) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { paymentMethod } = body;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
    });

    if (!order || order.customerId !== customer.userId) {
      return NextResponse.json({ error: "Order not found or access denied" }, { status: 404 });
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ error: "This order has already been paid" }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentMethod: paymentMethod === "CASH_ON_DELIVERY" ? "CASH_ON_DELIVERY" : order.paymentMethod,
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Error updating order payment method:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

