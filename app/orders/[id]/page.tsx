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
    console.warn("OrderDetailPage database query failed:", error);
  }

  if (!rawOrder) {
    notFound();
  }

  // Enforce customer ownership if not admin
  if (!admin && customer && rawOrder.customerId !== customer.userId) {
    redirect("/orders");
  }

  const order = {
    ...rawOrder,
    createdAt: rawOrder.createdAt instanceof Date ? rawOrder.createdAt.toISOString() : rawOrder.createdAt,
    updatedAt: rawOrder.updatedAt instanceof Date ? rawOrder.updatedAt.toISOString() : rawOrder.updatedAt,
    items: (rawOrder.items || []).map((it: any) => ({
      ...it,
    })),
    statusHistory: (rawOrder.statusHistory || []).map((sh: any) => ({
      ...sh,
      createdAt: sh.createdAt instanceof Date ? sh.createdAt.toISOString() : sh.createdAt,
    })),
  };

  return <ClientOrderDetailPage order={order as any} />;
}
