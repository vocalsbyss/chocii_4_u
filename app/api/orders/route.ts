import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomSuffix = crypto.randomInt(100, 999);
  return `CB-${dateStr}-${randomSuffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json(
        {
          error:
            "Authentication required. Please sign in with your mobile number to complete your order.",
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      landmark,
      specialInstructions,
      paymentMethod = "CASH_ON_DELIVERY",
      items,
    } = body;

    // Validate contact and delivery details
    if (!deliveryAddress || typeof deliveryAddress !== "string" || deliveryAddress.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a complete delivery address." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty. Please add delicious desserts before checkout." },
        { status: 400 }
      );
    }

    // Fetch store settings for delivery fee & minimum order
    const storeSettingsList = await prisma.storeSetting.findMany();
    const settingsMap = Object.fromEntries(
      storeSettingsList.map((s) => [s.key, s.value])
    );

    const storeIsOpen = settingsMap.storeIsOpen !== "false";
    if (!storeIsOpen) {
      return NextResponse.json(
        {
          error:
            "chocii 4 u is currently closed for the day. Please check back during opening hours.",
        },
        { status: 400 }
      );
    }

    const deliveryFeeSetting = parseFloat(settingsMap.deliveryFee || "49");
    const freeDeliveryThreshold = parseFloat(
      settingsMap.freeDeliveryThreshold || "599"
    );
    const minOrderValue = parseFloat(settingsMap.minOrderValue || "199");

    // SERVER-SIDE PRICING AND AVAILABILITY VALIDATION
    // Fetch all requested product records from the database
    const productIds = items.map((i: any) => i.productId).filter(Boolean);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { addons: true },
    });

    const dbProductMap = new Map(dbProducts.map((p) => [p.id, p]));

    let calculatedSubtotal = 0;
    const validatedOrderItems: Array<{
      productId: string;
      productName: string;
      unitPrice: number;
      quantity: number;
      customization: string;
      selectedAddons: string;
      specialInstructions: string | null;
      lineTotal: number;
    }> = [];

    for (const item of items) {
      const dbProduct = dbProductMap.get(item.productId);
      if (!dbProduct) {
        return NextResponse.json(
          { error: `One of your desserts is no longer available on our menu.` },
          { status: 400 }
        );
      }

      if (!dbProduct.isAvailable) {
        return NextResponse.json(
          {
            error: `"${dbProduct.name}" is currently sold out. Please remove it from your cart to proceed.`,
          },
          { status: 400 }
        );
      }

      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty <= 0 || qty > 50) {
        return NextResponse.json(
          { error: `Invalid quantity for "${dbProduct.name}".` },
          { status: 400 }
        );
      }

      // Base price (use sale price if applicable)
      const effectiveBasePrice =
        dbProduct.salePrice && dbProduct.salePrice > 0
          ? dbProduct.salePrice
          : dbProduct.basePrice;

      // Validate addons against DB
      let addonTotal = 0;
      const validatedAddonsList: Array<{ id: string; name: string; price: number }> =
        [];

      if (Array.isArray(item.selectedAddons)) {
        for (const addonReq of item.selectedAddons) {
          const dbAddon = dbProduct.addons.find((a) => a.id === addonReq.id);
          if (dbAddon && dbAddon.isAvailable) {
            addonTotal += dbAddon.price;
            validatedAddonsList.push({
              id: dbAddon.id,
              name: dbAddon.name,
              price: dbAddon.price,
            });
          }
        }
      }

      const effectiveUnitPrice = effectiveBasePrice + addonTotal;
      const lineTotal = effectiveUnitPrice * qty;
      calculatedSubtotal += lineTotal;

      const customizationChoice =
        item.customization === "BALANCED" ? "BALANCED" : "CLASSIC";

      validatedOrderItems.push({
        productId: dbProduct.id,
        productName: dbProduct.name,
        unitPrice: effectiveUnitPrice,
        quantity: qty,
        customization: customizationChoice,
        selectedAddons: JSON.stringify(validatedAddonsList),
        specialInstructions: item.specialInstructions
          ? String(item.specialInstructions).slice(0, 300)
          : null,
        lineTotal,
      });
    }

    if (calculatedSubtotal < minOrderValue) {
      return NextResponse.json(
        {
          error: `Minimum order value for delivery is ₹${minOrderValue}. Your current subtotal is ₹${calculatedSubtotal}.`,
        },
        { status: 400 }
      );
    }

    const calculatedDeliveryFee =
      calculatedSubtotal >= freeDeliveryThreshold ? 0 : deliveryFeeSetting;
    const calculatedGrandTotal = calculatedSubtotal + calculatedDeliveryFee;

    // Generate unique order number & secure tracking token
    const orderNumber = generateOrderNumber();
    const trackingToken = crypto.randomBytes(16).toString("hex");

    // Execute order creation in a database transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          trackingToken,
          customerId: session.userId,
          customerName: customerName ? customerName.trim() : session.name,
          customerPhone: customerPhone ? customerPhone.trim() : session.phone,
          customerEmail: customerEmail ? customerEmail.trim() : null,
          deliveryAddress: deliveryAddress.trim(),
          landmark: landmark ? landmark.trim() : null,
          specialInstructions: specialInstructions
            ? specialInstructions.trim()
            : null,
          subtotal: calculatedSubtotal,
          deliveryFee: calculatedDeliveryFee,
          discount: 0,
          total: calculatedGrandTotal,
          paymentMethod:
            paymentMethod === "RAZORPAY" ? "RAZORPAY" : "CASH_ON_DELIVERY",
          paymentStatus: "PENDING",
          fulfillmentStatus: "PENDING",
          items: {
            create: validatedOrderItems,
          },
          statusHistory: {
            create: {
              previousStatus: "NONE",
              newStatus: "PENDING",
              changedBy: "CUSTOMER",
              note: "Order placed by customer through website checkout.",
            },
          },
        },
        include: {
          items: true,
          statusHistory: true,
        },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        trackingToken: order.trackingToken,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "An error occurred while placing your order. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { customerId: session.userId },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
