import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const target = body.target || "all_test_data";

    const results: Record<string, any> = {};

    // 1. Test Orders
    if (target === "test_orders" || target === "all_test_data") {
      const ordersRes = await prisma.order.deleteMany({
        where: {
          OR: [
            { customerPhone: { contains: "9876543210" } },
            { customerPhone: { contains: "8888888888" } },
            { customerName: { contains: "Rohan Sharma" } },
            { customerName: { contains: "Quick Tester" } },
          ],
        },
      });
      results.ordersDeleted = ordersRes.count;
    }

    // 2. All Orders
    if (target === "all_orders") {
      const ordersRes = await prisma.order.deleteMany({});
      results.ordersDeleted = ordersRes.count;
    }

    // 3. Test Customers
    if (target === "test_customers" || target === "all_test_data") {
      const testPhones = ["9876543210", "8888888888"];
      const usersRes = await prisma.user.deleteMany({
        where: {
          role: "CUSTOMER",
          OR: testPhones.map((p) => ({ phone: { contains: p } })),
        },
      });
      results.customersDeleted = usersRes.count;
    }

    // 4. All Customers
    if (target === "all_customers") {
      const usersRes = await prisma.user.deleteMany({
        where: { role: "CUSTOMER" },
      });
      results.customersDeleted = usersRes.count;
    }

    // 5. Traffic Logs
    if (target === "traffic" || target === "all_test_data") {
      const visitsRes = await prisma.pageVisit.deleteMany({});
      results.trafficVisitsDeleted = visitsRes.count;
    }

    return NextResponse.json({
      success: true,
      target,
      results,
      message: `Reset completed successfully.`,
    });
  } catch (error: any) {
    console.error("Error running admin reset:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to execute reset" },
      { status: 500 }
    );
  }
}
