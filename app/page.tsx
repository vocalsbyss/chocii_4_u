import prisma from "@/lib/prisma";
import ClientHomePage from "./ClientHomePage";
import { Product } from "@/types";
import { getFallbackProducts } from "@/lib/data/fallbackData";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  try {
    const rawProducts = await prisma.product.findMany({
      where: { isAvailable: true },
      include: {
        category: true,
        addons: {
          where: { isAvailable: true },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
    });

    if (rawProducts && rawProducts.length > 0) {
      const products: Product[] = rawProducts.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }));
      return <ClientHomePage initialProducts={products} />;
    }
  } catch (error) {
    console.warn("HomePage: Database query failed, serving fallback products:", error);
  }

  // Graceful fallback to guaranteed catalog data
  return <ClientHomePage initialProducts={getFallbackProducts()} />;
}
