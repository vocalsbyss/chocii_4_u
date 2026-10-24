import React from "react";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getCustomerSession, getAdminSession } from "@/lib/auth";
import ClientOrderDetailPage from "./ClientOrderDetailPage";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Details & Status | chocii 4 u",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const customer = await getCustomerSession();
  const admin = await getAdminSession();

  if (!customer && !admin) {
    redirect(`/signin?redirect=/orders/${id}`);
  }

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

  // Enforce customer ownership if not admin
  if (!admin && customer && rawOrder.customerId !== customer.userId) {
    redirect("/orders");
  }

  const order = {
    ...rawOrder,
    createdAt: rawOrder.createdAt.toISOString(),
    updatedAt: rawOrder.updatedAt.toISOString(),
    items: rawOrder.items.map((it) => ({
      ...it,
    })),
    statusHistory: rawOrder.statusHistory.map((sh) => ({
      ...sh,
      createdAt: sh.createdAt.toISOString(),
    })),
  };

  return <ClientOrderDetailPage order={order as any} />;
}
