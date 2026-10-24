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

  const rawOrder = await prisma.order.findFirst({
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

  if (!rawOrder) {
    notFound();
  }

  const order: Order = {
    ...rawOrder,
    createdAt: rawOrder.createdAt.toISOString(),
    updatedAt: rawOrder.updatedAt.toISOString(),
    paymentStatus: rawOrder.paymentStatus as any,
    fulfillmentStatus: rawOrder.fulfillmentStatus as any,
    paymentMethod: rawOrder.paymentMethod as any,
    statusHistory: rawOrder.statusHistory.map((h) => ({
      ...h,
      createdAt: h.createdAt.toISOString(),
    })),
  };

  return <ClientAdminOrderDetailPage initialOrder={order} />;
}
