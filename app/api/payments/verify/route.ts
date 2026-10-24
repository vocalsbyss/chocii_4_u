import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      await req.json();

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Missing required payment verification parameters" },
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

    const isValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Payment verification failed. Invalid cryptographic signature." },
        { status: 400 }
      );
    }

    // Update order and payment record in transaction
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          fulfillmentStatus:
            order.fulfillmentStatus === "PENDING"
              ? "CONFIRMED"
              : order.fulfillmentStatus,
        },
      });

      await tx.paymentRecord.create({
        data: {
          orderId,
          provider: "RAZORPAY",
          providerOrderId: razorpayOrderId,
          providerPaymentId: razorpayPaymentId,
          amount: order.total,
          status: "PAID",
          rawDetails: JSON.stringify({
            verifiedAt: new Date().toISOString(),
            signature: razorpaySignature,
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
          changedBy: "PAYMENT_GATEWAY",
          note: `Payment verified successfully via Razorpay (Ref: ${razorpayPaymentId})`,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully!",
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification error" },
      { status: 500 }
    );
  }
}
