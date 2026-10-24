import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ClientCollectionPage from "./ClientCollectionPage";
import { Product, Category } from "@/types";
import { getFallbackCategories, getFallbackCategoryBySlug } from "@/lib/data/fallbackData";

export const dynamic = "force-dynamic";

interface CollectionPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = params;
  let category: any = null;

  try {
    category = await prisma.category.findUnique({
      where: { slug },
    });
  } catch (e) {
    console.warn("Collection metadata DB error, using fallback:", e);
  }

  if (!category) {
    category = getFallbackCategoryBySlug(slug);
  }

  if (!category) {
    return {
      title: "Collection Not Found | chocii 4 u",
    };
  }

  return {
    title: `${category.name} Collection | chocii 4 u`,
    description: `Indulge in our ${category.name}. Prepared with care in our Visakhapatnam dessert kitchen.`,
    openGraph: {
      title: `${category.name} | chocii 4 u`,
      description: `Explore our ${category.name} collection.`,
      url: `https://chocii4u.com/collections/${slug}`,
    },
    alternates: {
      canonical: `https://chocii4u.com/collections/${slug}`,
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = params;
  let category: any = null;
  let allCategories: Category[] = [];

  try {
    category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isAvailable: true },
          include: {
            category: true,
            addons: { where: { isAvailable: true } },
          },
          orderBy: { isFeatured: "desc" },
        },
      },
    });

    const rawAll = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rawAll && rawAll.length > 0) {
      allCategories = rawAll.map((c) => ({ ...c }));
    }
  } catch (error) {
    console.warn("CollectionPage: DB query failed, using fallback:", error);
  }

  if (!category) {
    category = getFallbackCategoryBySlug(slug);
  }

  if (!category) {
    notFound();
  }

  if (allCategories.length === 0) {
    allCategories = getFallbackCategories();
  }

  const products: Product[] = (category.products || []).map((p: any) => ({
    ...p,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
  }));

  // JSON-LD structured data for Collection
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} — chocii 4 u`,
    description: `${category.name} collection by chocii 4 u.`,
    url: `https://chocii4u.com/collections/${category.slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((prod, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://chocii4u.com/menu/${prod.slug}`,
        name: prod.name,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientCollectionPage
        category={category}
        products={products}
        allCategories={allCategories}
      />
    </>
  );
}
