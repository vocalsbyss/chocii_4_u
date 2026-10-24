import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const rawProduct = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      addons: true,
    },
  });

  if (!rawProduct) {
    notFound();
  }

  const product: Product = {
    ...rawProduct,
    createdAt: rawProduct.createdAt.toISOString(),
    updatedAt: rawProduct.updatedAt.toISOString(),
  };

  return <ProductForm initialProduct={product} isEditing={true} />;
}
