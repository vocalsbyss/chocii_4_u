import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, utrNumber, isTest } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.customerId !== session.userId) {
      return NextResponse.json(
        { error: "Order not found or access denied" },
        { status: 404 }
      );
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json({
        success: true,
        message: "Order has already been verified as paid.",
        order,
      });
    }

    const refNumber = isTest
      ? `TEST_PAY_${Date.now()}`
      : utrNumber?.trim() || `UPI_${Date.now()}`;

    const updated = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          paymentMethod: isTest ? "ONLINE_TEST" : "UPI",
          fulfillmentStatus:
            order.fulfillmentStatus === "PENDING"
              ? "CONFIRMED"
              : order.fulfillmentStatus,
        },
      });

      await tx.paymentRecord.create({
        data: {
          orderId,
          provider: isTest ? "TEST_GATEWAY" : "UPI_DIRECT",
          providerOrderId: order.orderNumber,
          providerPaymentId: refNumber,
          amount: order.total,
          status: "PAID",
          rawDetails: JSON.stringify({
            verifiedAt: new Date().toISOString(),
            utrNumber: refNumber,
            isTest: Boolean(isTest),
          }),
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          previousStatus: order.fulfillmentStatus,
          newStatus:
            order.fulfillmentStatus === "PENDING"
              ? "CONFIRMED"
              : order.fulfillmentStatus,
          changedBy: "PAYMENT_SYSTEM",
          note: isTest
            ? "Payment verified via sandbox test gateway"
            : `Payment received via UPI (Ref/UTR: ${refNumber})`,
        },
      });

      return updatedOrder;
    });

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified!",
      order: updated,
    });
  } catch (error) {
    console.error("UPI Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed. Please try again." },
      { status: 500 }
    );
  }
}
