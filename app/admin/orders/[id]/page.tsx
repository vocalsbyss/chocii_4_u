import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ClientAdminOrderDetailPage from "./ClientAdminOrderDetailPage";
import { Order } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  let rawOrder: any = null;
  try {
    rawOrder = await prisma.order.findFirst({
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
  } catch (error) {
    console.warn("AdminOrderDetailPage database query failed:", error);
  }

  if (!rawOrder) {
    notFound();
  }

  const order: Order = {
    ...rawOrder,
    createdAt: rawOrder.createdAt instanceof Date ? rawOrder.createdAt.toISOString() : rawOrder.createdAt,
    updatedAt: rawOrder.updatedAt instanceof Date ? rawOrder.updatedAt.toISOString() : rawOrder.updatedAt,
    paymentStatus: rawOrder.paymentStatus as any,
    fulfillmentStatus: rawOrder.fulfillmentStatus as any,
    paymentMethod: rawOrder.paymentMethod as any,
    statusHistory: (rawOrder.statusHistory || []).map((h: any) => ({
      ...h,
      createdAt: h.createdAt instanceof Date ? h.createdAt.toISOString() : h.createdAt,
    })),
  };

  return <ClientAdminOrderDetailPage initialOrder={order} />;
}
