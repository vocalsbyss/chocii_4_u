import prisma from "@/lib/prisma";
import ClientMenuPage from "./ClientMenuPage";
import { Product, Category } from "@/types";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Complete Dessert Menu | chocii 4 u",
  description:
    "Explore our tempting collection of chocolate treats, layered cakes, churros, and dessert creations. Find your favourite and place your order.",
  openGraph: {
    title: "Signature Dessert Menu | chocii 4 u",
    description: "A Little Treat, Just for You. Discover our tempting desserts and chocolate treats.",
    url: "https://chocii4u.com/menu",
  },
  alternates: {
    canonical: "https://chocii4u.com/menu",
  },
};

export default async function MenuPage() {
  const [rawProducts, rawCategories] = await Promise.all([
    prisma.product.findMany({
      where: { isAvailable: true },
      include: {
        category: true,
        addons: { where: { isAvailable: true } },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const products: Product[] = rawProducts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  const categories: Category[] = rawCategories.map((c) => ({
    ...c,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "chocii 4 u Signature Dessert Menu",
    description: "Delicious chocolate desserts, churros, brownie bowls, and cakes.",
    url: "https://chocii4u.com/menu",
    hasMenuSection: categories.map((cat) => ({
      "@type": "MenuSection",
      name: cat.name,
      hasMenuItem: products
        .filter((p) => p.categoryId === cat.id)
        .map((p) => ({
          "@type": "MenuItem",
          name: p.name,
          description: p.description,
          offers: {
            "@type": "Offer",
            price: p.salePrice || p.basePrice,
            priceCurrency: "INR",
          },
        })),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientMenuPage initialProducts={products} categories={categories} />
    </>
  );
}
