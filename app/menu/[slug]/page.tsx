import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ClientProductDetailPage from "./ClientProductDetailPage";
import { Product } from "@/types";

export const dynamic = "force-dynamic";

interface ProductDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    return {
      title: "Dessert Not Found | chocii 4 u",
    };
  }

  const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.basePrice;

  return {
    title: `${product.name} — ₹${price} | chocii 4 u`,
    description: product.description,
    openGraph: {
      title: `${product.name} | chocii 4 u`,
      description: product.description,
      images: [{ url: product.imageUrl }],
      url: `https://chocii4u.com/menu/${slug}`,
    },
    alternates: {
      canonical: `https://chocii4u.com/menu/${slug}`,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = params;

  const rawProduct = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      addons: { where: { isAvailable: true } },
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

  const currentPrice =
    product.salePrice && product.salePrice > 0 ? product.salePrice : product.basePrice;

  // Schema.org Product structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.imageUrl],
    description: product.description,
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: "chocii 4 u",
    },
    offers: {
      "@type": "Offer",
      url: `https://chocii4u.com/menu/${product.slug}`,
      priceCurrency: "INR",
      price: currentPrice,
      availability: product.isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "chocii 4 u",
      },
    },
  };

  // Schema.org Breadcrumbs
  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://chocii4u.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Menu",
        item: "https://chocii4u.com/menu",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://chocii4u.com/menu/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <ClientProductDetailPage product={product} />
    </>
  );
}
