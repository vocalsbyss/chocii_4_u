import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { Product } from "@/types";
import { getFallbackProductBySlug, getFallbackProducts } from "@/lib/data/fallbackData";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  let rawProduct: any = null;
  try {
    rawProduct = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        addons: true,
      },
    });
  } catch (error) {
    console.warn("EditProductPage database query failed:", error);
  }

  if (!rawProduct) {
    // Check fallback catalog
    const fallback =
      getFallbackProductBySlug(id) ||
      getFallbackProducts().find((p) => p.id === id || p.slug === id);

    if (!fallback) {
      notFound();
    }
    return <ProductForm initialProduct={fallback} isEditing={true} />;
  }

  const product: Product = {
    ...rawProduct,
    createdAt:
      rawProduct.createdAt instanceof Date
        ? rawProduct.createdAt.toISOString()
        : rawProduct.createdAt,
    updatedAt:
      rawProduct.updatedAt instanceof Date
        ? rawProduct.updatedAt.toISOString()
        : rawProduct.updatedAt,
  };

  return <ProductForm initialProduct={product} isEditing={true} />;
}
