import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const includeUnavailable = searchParams.get("includeUnavailable") === "true";

    const admin = await getAdminSession();
    const canSeeUnavailable = includeUnavailable && Boolean(admin);

    const whereClause: any = {};
    if (!canSeeUnavailable) {
      whereClause.isAvailable = true;
    }
    if (categorySlug) {
      whereClause.category = { slug: categorySlug };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        addons: {
          where: canSeeUnavailable ? {} : { isAvailable: true },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
    });

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      products,
      categories,
    });
  } catch (error) {
    console.error("Error fetching products, returning fallback catalog:", error);
    const { getFallbackProducts, getFallbackCategories } = await import("@/lib/data/fallbackData");
    return NextResponse.json({
      success: true,
      products: getFallbackProducts(),
      categories: getFallbackCategories(),
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      description,
      basePrice,
      salePrice,
      imageUrl,
      categoryId,
      isAvailable = true,
      isFeatured = false,
      preparationInfo,
      addons = [],
    } = body;

    if (!name || !slug || !description || basePrice === undefined || !categoryId) {
      return NextResponse.json(
        { error: "Missing required product fields" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existingSlug = await prisma.product.findUnique({
      where: { slug: slug.trim().toLowerCase() },
    });
    if (existingSlug) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim(),
        basePrice: parseFloat(basePrice),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        imageUrl: imageUrl.trim(),
        categoryId,
        isAvailable: Boolean(isAvailable),
        isFeatured: Boolean(isFeatured),
        preparationInfo: preparationInfo ? preparationInfo.trim() : null,
        addons: {
          create: addons.map((addon: any) => ({
            name: addon.name.trim(),
            price: parseFloat(addon.price),
            isAvailable: addon.isAvailable !== false,
          })),
        },
      },
      include: {
        category: true,
        addons: true,
      },
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
