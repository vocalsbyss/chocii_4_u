import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const VALID_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { status, note, paymentStatus } = body;

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status: ${status}. Must be one of ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const currentOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const previousStatus = currentOrder.fulfillmentStatus;

    // Update in transaction
    const updated = await prisma.$transaction(async (tx) => {
      const orderUpdateData: any = {
        fulfillmentStatus: status,
      };

      if (paymentStatus) {
        orderUpdateData.paymentStatus = paymentStatus;
      } else if (
        status === "DELIVERED" &&
        currentOrder.paymentMethod === "CASH_ON_DELIVERY"
      ) {
        orderUpdateData.paymentStatus = "PAID";
      }

      const updatedOrder = await tx.order.update({
        where: { id },
        data: orderUpdateData,
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          previousStatus,
          newStatus: status,
          changedBy: admin.name || "ADMIN",
          note: note ? note.trim() : `Status changed to ${status}`,
        },
      });

      return updatedOrder;
    });

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updated,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
