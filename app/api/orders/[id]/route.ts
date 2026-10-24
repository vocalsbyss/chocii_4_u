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
