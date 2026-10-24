import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ClientOrderSuccessPage from "./ClientOrderSuccessPage";
import { Order } from "@/types";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const { orderNumber } = params;

  const rawOrder = await prisma.order.findUnique({
    where: { orderNumber },
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

  return <ClientOrderSuccessPage order={order} />;
}
