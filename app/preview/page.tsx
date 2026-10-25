import prisma from "@/lib/prisma";
import { getFallbackProducts } from "@/lib/data/fallbackData";
import { Product } from "@/types";
import PreviewClientPage from "./PreviewClientPage";

export const dynamic = "force-dynamic";

export default async function PreviewPage() {
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
      return <PreviewClientPage initialProducts={products} />;
    }
  } catch (error) {
    console.warn("PreviewPage: Serving fallback products:", error);
  }

  return <PreviewClientPage initialProducts={getFallbackProducts()} />;
}
