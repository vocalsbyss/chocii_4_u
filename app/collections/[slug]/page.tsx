import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ClientCollectionPage from "./ClientCollectionPage";
import { Product, Category } from "@/types";

export const dynamic = "force-dynamic";

interface CollectionPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

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

  const category = await prisma.category.findUnique({
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

  if (!category) {
    notFound();
  }

  const allCategories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const products: Product[] = category.products.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  const categories: Category[] = allCategories.map((c) => ({
    ...c,
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
        allCategories={categories}
      />
    </>
  );
}
