import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        addons: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching single product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { addons: true },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const {
      name,
      slug,
      description,
      basePrice,
      salePrice,
      imageUrl,
      categoryId,
      isAvailable,
      isFeatured,
      preparationInfo,
      addons,
    } = body;

    // Check slug collision if slug changed
    if (slug && slug !== existingProduct.slug) {
      const collision = await prisma.product.findUnique({
        where: { slug: slug.trim().toLowerCase() },
      });
      if (collision) {
        return NextResponse.json(
          { error: "Another product with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update product fields in transaction
    const updated = await prisma.$transaction(async (tx) => {
      // If addons are provided, update/replace addons
      if (Array.isArray(addons)) {
        await tx.productAddon.deleteMany({
          where: { productId: id },
        });

        for (const addon of addons) {
          await tx.productAddon.create({
            data: {
              productId: id,
              name: addon.name.trim(),
              price: parseFloat(addon.price),
              isAvailable: addon.isAvailable !== false,
            },
          });
        }
      }

      return tx.product.update({
        where: { id },
        data: {
          name: name !== undefined ? name.trim() : undefined,
          slug: slug !== undefined ? slug.trim().toLowerCase() : undefined,
          description: description !== undefined ? description.trim() : undefined,
          basePrice: basePrice !== undefined ? parseFloat(basePrice) : undefined,
          salePrice:
            salePrice !== undefined
              ? salePrice
                ? parseFloat(salePrice)
                : null
              : undefined,
          imageUrl: imageUrl !== undefined ? imageUrl.trim() : undefined,
          categoryId: categoryId !== undefined ? categoryId : undefined,
          isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : undefined,
          isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
          preparationInfo:
            preparationInfo !== undefined
              ? preparationInfo
                ? preparationInfo.trim()
                : null
              : undefined,
        },
        include: {
          category: true,
          addons: true,
        },
      });
    });

    return NextResponse.json({
      success: true,
      product: updated,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
