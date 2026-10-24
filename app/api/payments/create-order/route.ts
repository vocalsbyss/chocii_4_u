import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";
import { createRazorpayOrder, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.customerId !== session.userId) {
      return NextResponse.json({ error: "Order not found or access denied" }, { status: 404 });
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ error: "This order has already been paid" }, { status: 400 });
    }

    const razorpayData = await createRazorpayOrder(order.total, order.orderNumber);

    // Save payment record
    await prisma.paymentRecord.create({
      data: {
        orderId: order.id,
        provider: "RAZORPAY",
        providerOrderId: razorpayData.orderId,
        amount: order.total,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      isConfigured: razorpayData.isConfigured,
      razorpayOrderId: razorpayData.orderId,
      amount: razorpayData.amount,
      currency: razorpayData.currency,
      keyId: razorpayData.keyId,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment gateway order" },
      { status: 500 }
    );
  }
}
