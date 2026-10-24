import prisma from "@/lib/prisma";
import ClientHomePage from "./ClientHomePage";
import { Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch active products with categories and addons directly from Prisma database
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

  const products: Product[] = rawProducts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return <ClientHomePage initialProducts={products} />;
}
