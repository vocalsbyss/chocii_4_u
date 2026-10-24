import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { trackingToken: string } }
) {
  try {
    const { trackingToken } = params;

    if (!trackingToken || trackingToken.length < 10) {
      return NextResponse.json(
        { error: "Invalid tracking token" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { trackingToken },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "No active order found with this tracking link." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone.slice(0, 5) + "*****" + order.customerPhone.slice(-2),
        deliveryAddress: order.deliveryAddress,
        landmark: order.landmark,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        createdAt: order.createdAt,
        items: order.items,
        statusHistory: order.statusHistory,
      },
    });
  } catch (error) {
    console.error("Error tracking order:", error);
    return NextResponse.json(
      { error: "Failed to load order tracking details" },
      { status: 500 }
    );
  }
}
