import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { getFallbackProducts, getFallbackCategories } from "@/lib/data/fallbackData";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://chocii4u.com";

  // 1. Static Core Public Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shipping-and-delivery`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refund-and-cancellation`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // 2. Dynamic Product Pages
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      where: { isAvailable: true },
      select: { slug: true, updatedAt: true },
    });

    if (products && products.length > 0) {
      productRoutes = products.map((product) => ({
        url: `${baseUrl}/menu/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.warn("Product sitemap DB error, using fallback catalog:", error);
  }

  if (productRoutes.length === 0) {
    productRoutes = getFallbackProducts().map((product) => ({
      url: `${baseUrl}/menu/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  }

  // 3. Dynamic Category Collection Pages
  let collectionRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true },
    });

    if (categories && categories.length > 0) {
      collectionRoutes = categories.map((cat) => ({
        url: `${baseUrl}/collections/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.warn("Category sitemap DB error, using fallback catalog:", error);
  }

  if (collectionRoutes.length === 0) {
    collectionRoutes = getFallbackCategories().map((cat) => ({
      url: `${baseUrl}/collections/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  }

  return [...staticRoutes, ...productRoutes, ...collectionRoutes];
}
