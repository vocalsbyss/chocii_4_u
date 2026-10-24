import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { normalizePhone } from "@/lib/phone";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase().trim() || "";
    const segmentFilter = searchParams.get("segment") || "ALL";

    // 1. Fetch all registered customer users with their orders
    const users = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            fulfillmentStatus: true,
            paymentStatus: true,
            deliveryAddress: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Fetch all orders to capture any orders placed with numbers not formally linked to a user id
    const allOrders = await prisma.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerPhone: true,
        deliveryAddress: true,
        total: true,
        fulfillmentStatus: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 3. Fetch latest OTP verifications for login timestamps
    const otpRecords = await prisma.otpVerification.findMany({
      where: { verified: true },
      select: {
        phone: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const otpMap = new Map<string, Date>();
    for (const otp of otpRecords) {
      const clean = otp.phone.replace(/\D/g, "");
      if (!otpMap.has(clean)) {
        otpMap.set(clean, otp.createdAt);
      }
    }

    // Build consolidated customer map by normalized phone digits
    const customerMap = new Map<string, {
      id: string;
      name: string;
      phone: string;
      rawDigits: string;
      totalOrders: number;
      totalSpent: number;
      registeredAt: string;
      lastLoginAt: string;
      latestOrderDate: string | null;
      latestOrderNumber: string | null;
      latestOrderStatus: string | null;
      latestAddress: string | null;
      segment: "VIP" | "ACTIVE" | "NEW";
    }>();

    // Add registered users first
    for (const u of users) {
      const norm = normalizePhone(u.phone);
      const digits = norm ? norm.rawDigits : u.phone.replace(/\D/g, "");
      const displayPhone = norm ? norm.normalized : u.phone;

      const totalOrders = u.orders.length;
      const totalSpent = u.orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
      const latestOrder = u.orders[0] || null;

      const lastOtp = otpMap.get(digits);
      const lastLoginAt = lastOtp
        ? (new Date(lastOtp) > new Date(u.updatedAt) ? lastOtp.toISOString() : u.updatedAt.toISOString())
        : u.updatedAt.toISOString();

      let segment: "VIP" | "ACTIVE" | "NEW" = "NEW";
      if (totalSpent >= 800 || totalOrders >= 3) {
        segment = "VIP";
      } else if (totalOrders >= 1) {
        segment = "ACTIVE";
      }

      customerMap.set(digits, {
        id: u.id,
        name: u.name && u.name.trim() !== "Valued Guest" ? u.name.trim() : (latestOrder ? latestOrder.deliveryAddress ? "Guest Patron" : "Valued Guest" : "Valued Guest"),
        phone: displayPhone,
        rawDigits: digits,
        totalOrders,
        totalSpent,
        registeredAt: u.createdAt.toISOString(),
        lastLoginAt,
        latestOrderDate: latestOrder ? latestOrder.createdAt.toISOString() : null,
        latestOrderNumber: latestOrder ? latestOrder.orderNumber : null,
        latestOrderStatus: latestOrder ? latestOrder.fulfillmentStatus : null,
        latestAddress: latestOrder ? latestOrder.deliveryAddress : null,
        segment,
      });
    }

    // Merge any orders with phone numbers not yet in user table
    for (const ord of allOrders) {
      const norm = normalizePhone(ord.customerPhone);
      const digits = norm ? norm.rawDigits : ord.customerPhone.replace(/\D/g, "");
      const displayPhone = norm ? norm.normalized : ord.customerPhone;

      if (!customerMap.has(digits)) {
        const lastOtp = otpMap.get(digits);
        const lastLoginAt = lastOtp ? lastOtp.toISOString() : ord.createdAt.toISOString();

        customerMap.set(digits, {
          id: `guest_${digits}`,
          name: ord.customerName && ord.customerName.trim() ? ord.customerName.trim() : "Guest Patron",
          phone: displayPhone,
          rawDigits: digits,
          totalOrders: 1,
          totalSpent: ord.total || 0,
          registeredAt: ord.createdAt.toISOString(),
          lastLoginAt,
          latestOrderDate: ord.createdAt.toISOString(),
          latestOrderNumber: ord.orderNumber,
          latestOrderStatus: ord.fulfillmentStatus,
          latestAddress: ord.deliveryAddress,
          segment: (ord.total || 0) >= 800 ? "VIP" : "ACTIVE",
        });
      } else {
        const existing = customerMap.get(digits)!;
        if (existing.name === "Valued Guest" && ord.customerName && ord.customerName.trim()) {
          existing.name = ord.customerName.trim();
        }
        if (!existing.latestAddress && ord.deliveryAddress) {
          existing.latestAddress = ord.deliveryAddress;
        }
      }
    }

    let customers = Array.from(customerMap.values());

    // Compute metrics before filters
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c) => c.totalOrders > 0).length;
    const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);
    const avgLtv = totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers) : 0;

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newThisWeek = customers.filter(
      (c) => new Date(c.registeredAt) >= sevenDaysAgo
    ).length;

    // Apply Search Filter
    if (query) {
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.phone.toLowerCase().includes(query) ||
          c.rawDigits.includes(query) ||
          (c.latestAddress && c.latestAddress.toLowerCase().includes(query))
      );
    }

    // Apply Segment Filter
    if (segmentFilter && segmentFilter !== "ALL") {
      customers = customers.filter((c) => c.segment === segmentFilter);
    }

    // Sort by latest activity date descending
    customers.sort((a, b) => new Date(b.lastLoginAt).getTime() - new Date(a.lastLoginAt).getTime());

    return NextResponse.json({
      success: true,
      customers,
      stats: {
        totalCustomers,
        activeCustomers,
        totalRevenue,
        avgLtv,
        newThisWeek,
      },
    });
  } catch (error) {
    console.error("Error in admin customers API:", error);
    return NextResponse.json(
      { error: "Failed to load customer database" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const phoneParam = searchParams.get("phone");
    let body: any = {};
    try {
      body = await req.json();
    } catch (_) {}

    const customerId = idParam || body.customerId || body.id;
    const phone = phoneParam || body.phone;
    const customerIds: string[] = body.customerIds;
    const action = body.action || searchParams.get("action");
    const deleteOrders = body.deleteOrders === true || searchParams.get("deleteOrders") === "true";

    // 1. Clean test customer records
    if (action === "clear_test") {
      const testPhones = ["9876543210", "8888888888"];
      if (deleteOrders) {
        await prisma.order.deleteMany({
          where: {
            OR: [
              { customerPhone: { contains: "9876543210" } },
              { customerPhone: { contains: "8888888888" } },
              { customerName: { contains: "Rohan Sharma" } },
              { customerName: { contains: "Quick Tester" } },
            ],
          },
        });
      }

      const res = await prisma.user.deleteMany({
        where: {
          role: "CUSTOMER",
          OR: testPhones.map((p) => ({ phone: { contains: p } })),
        },
      });

      return NextResponse.json({
        success: true,
        count: res.count,
        message: `Cleared ${res.count} test customer profiles.`,
      });
    }

    // 2. Clear all customers (preserves ADMIN account!)
    if (action === "clear_all") {
      if (deleteOrders) {
        await prisma.order.deleteMany({});
      }
      const res = await prisma.user.deleteMany({
        where: { role: "CUSTOMER" },
      });
      return NextResponse.json({
        success: true,
        count: res.count,
        message: `Cleared all ${res.count} customer accounts (Admin account preserved).`,
      });
    }

    // 3. Bulk delete by customer IDs
    if (customerIds && Array.isArray(customerIds) && customerIds.length > 0) {
      // Separate actual users vs guest identifiers
      const actualUserIds = customerIds.filter((id) => !id.startsWith("guest_"));
      const guestIds = customerIds.filter((id) => id.startsWith("guest_"));

      let deletedCount = 0;
      if (actualUserIds.length > 0) {
        const users = await prisma.user.findMany({
          where: { id: { in: actualUserIds }, role: "CUSTOMER" },
        });
        if (deleteOrders) {
          const phones = users.map((u) => u.phone.replace(/\D/g, "").slice(-10)).filter(Boolean);
          if (phones.length > 0) {
            await prisma.order.deleteMany({
              where: {
                OR: [
                  { customerId: { in: users.map((u) => u.id) } },
                  ...phones.map((p) => ({ customerPhone: { contains: p } })),
                ],
              },
            });
          }
        }
        const res = await prisma.user.deleteMany({
          where: { id: { in: users.map((u) => u.id) } },
        });
        deletedCount += res.count;
      }

      if (guestIds.length > 0 && deleteOrders) {
        const guestPhones = guestIds.map((g) => g.replace("guest_", "")).filter(Boolean);
        const res = await prisma.order.deleteMany({
          where: {
            OR: guestPhones.map((p) => ({ customerPhone: { contains: p } })),
          },
        });
        deletedCount += res.count;
      }

      return NextResponse.json({
        success: true,
        count: deletedCount,
        message: `Successfully deleted ${deletedCount} customer records.`,
      });
    }

    // 4. Delete single customer
    if (customerId) {
      if (customerId.startsWith("guest_")) {
        const digits = customerId.replace("guest_", "");
        const res = await prisma.order.deleteMany({
          where: { customerPhone: { contains: digits } },
        });
        return NextResponse.json({
          success: true,
          message: `Guest customer record and ${res.count} associated orders deleted.`,
        });
      }

      const user = await prisma.user.findUnique({ where: { id: customerId } });
      if (!user) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
      }
      if (user.role === "ADMIN") {
        return NextResponse.json(
          { error: "Cannot delete administrator account" },
          { status: 403 }
        );
      }

      if (deleteOrders) {
        await prisma.order.deleteMany({ where: { customerId: user.id } });
        const clean = user.phone.replace(/\D/g, "");
        if (clean.length >= 10) {
          await prisma.order.deleteMany({
            where: { customerPhone: { contains: clean.slice(-10) } },
          });
        }
      }

      await prisma.user.delete({ where: { id: user.id } });
      return NextResponse.json({
        success: true,
        message: `Customer ${user.name} removed successfully.`,
      });
    }

    // 5. Delete by phone
    if (phone) {
      const clean = phone.replace(/\D/g, "");
      const res = await prisma.user.deleteMany({
        where: {
          role: "CUSTOMER",
          phone: { contains: clean.slice(-10) },
        },
      });
      if (deleteOrders) {
        await prisma.order.deleteMany({
          where: { customerPhone: { contains: clean.slice(-10) } },
        });
      }
      return NextResponse.json({
        success: true,
        count: res.count,
        message: `Customer matching ${phone} removed.`,
      });
    }

    return NextResponse.json(
      { error: "Please specify customer ID or phone to delete" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete customer" },
      { status: 500 }
    );
  }
}
