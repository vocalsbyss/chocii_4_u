"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  ChefHat,
  PackageCheck,
  Ban,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Plus,
  Activity,
  Trash2,
  AlertCircle,
  X,
} from "lucide-react";
import AdminFestivalReminder from "@/components/admin/AdminFestivalReminder";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/orders?status=ALL"),
      ]);

      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();

      if (statsData.success) {
        setStats(statsData.stats);
      }
      if (ordersData.success) {
        setRecentOrders(ordersData.orders.slice(0, 5));
      }
    } catch (e) {
      console.error("Failed to load dashboard data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Are you sure you want to delete Order #${orderNumber}?`)) return;
    try {
      const res = await fetch(`/api/admin/orders?id=${orderId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete order");
      setRecentOrders((prev) => prev.filter((o) => o.id !== orderId));
      fetchDashboardData();
    } catch (e: any) {
      alert(e.message || "Failed to delete order");
    }
  };

  const handleResetTarget = async (target: string, label: string) => {
    if (!confirm(`Are you sure you want to clean/reset ${label}? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Reset failed");
      alert(data.message || "Reset completed successfully!");
      setIsResetModalOpen(false);
      fetchDashboardData();
    } catch (e: any) {
      alert(e.message || "Failed to reset data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 8000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-caramel-400 animate-spin mx-auto" />
        <p className="text-sm font-medium">Loading kitchen analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Smart Festival & Special Day Reminder Banner */}
      <AdminFestivalReminder />

      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-caramel-400 font-bold">
            Live Kitchen Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-cream-100 mt-1">
            Kitchen Overview & Metrics
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-strawberry-500/15 hover:bg-strawberry-500/25 border border-strawberry-500/30 text-strawberry-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Clean duplicate test orders, test customers, and test traffic"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clean Test Data</span>
          </button>
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl bg-cocoa-900 border border-caramel-500/30 text-cream-200 hover:text-white transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/admin/traffic"
            className="px-4 py-2.5 rounded-xl bg-cocoa-900 hover:bg-cocoa-800 border border-caramel-500/30 text-caramel-300 font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            Traffic & Conversion
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-xl bg-caramel-500 hover:bg-caramel-400 text-cocoa-950 font-bold uppercase tracking-wider text-xs transition-all shadow-md flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            Live Orders Queue
          </Link>
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-cocoa-900 hover:bg-cocoa-800 border border-white/10 text-cream-100 font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            New Dessert
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Revenue */}
        <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-cream-300/70">
            <span>Total Realized Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-black text-cream-100">
            ₹{stats?.totalRevenue?.toLocaleString() || 0}
          </p>
          <p className="text-[11px] text-cream-300/50">Delivered & paid customer orders</p>
        </div>

        {/* Orders Today */}
        <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-cream-300/70">
            <span>Orders Placed Today</span>
            <Clock className="w-4 h-4 text-caramel-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-black text-caramel-400">
            {stats?.ordersToday || 0}
          </p>
          <p className="text-[11px] text-cream-300/50">Since 12:00 AM midnight</p>
        </div>

        {/* New Orders Pending */}
        <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-cream-300/70">
            <span>New Awaiting Review</span>
            <span className="w-2.5 h-2.5 rounded-full bg-strawberry-500 animate-ping" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-black text-strawberry-400">
            {stats?.pendingOrders || 0}
          </p>
          <p className="text-[11px] text-cream-300/50">Requires kitchen confirmation</p>
        </div>

        {/* In Kitchen Preparing */}
        <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-cream-300/70">
            <span>In Kitchen Preparing</span>
            <ChefHat className="w-4 h-4 text-caramel-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-black text-cream-100">
            {stats?.preparingOrders || 0}
          </p>
          <p className="text-[11px] text-cream-300/50">Baking & topping assembling</p>
        </div>
      </div>

      {/* Secondary Status Counts Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-cocoa-900/30 border border-white/5 rounded-2xl p-3.5 flex items-center justify-between text-xs">
          <span className="text-cream-300/70">Ready / Out</span>
          <span className="font-bold text-cream-100">
            {(stats?.readyOrders || 0) + (stats?.outForDeliveryOrders || 0)}
          </span>
        </div>
        <div className="bg-cocoa-900/30 border border-white/5 rounded-2xl p-3.5 flex items-center justify-between text-xs">
          <span className="text-cream-300/70">Total Delivered</span>
          <span className="font-bold text-emerald-400">{stats?.deliveredOrders || 0}</span>
        </div>
        <div className="bg-cocoa-900/30 border border-white/5 rounded-2xl p-3.5 flex items-center justify-between text-xs">
          <span className="text-cream-300/70">Total Cancelled</span>
          <span className="font-bold text-strawberry-400">{stats?.cancelledOrders || 0}</span>
        </div>
        <div className="bg-cocoa-900/30 border border-white/5 rounded-2xl p-3.5 flex items-center justify-between text-xs">
          <span className="text-cream-300/70">Lifetime Orders</span>
          <span className="font-bold text-cream-100">{stats?.totalOrders || 0}</span>
        </div>
      </div>

      {/* Grid: Best-Selling Desserts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Top Selling Desserts */}
        <div className="lg:col-span-5 bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-base font-serif font-bold text-cream-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-caramel-400" />
              Best-Selling Desserts
            </h3>
            <span className="text-[10px] text-cream-300/50 uppercase tracking-widest font-bold">
              By Volume
            </span>
          </div>

          {stats?.topSellingDesserts?.length === 0 ? (
            <p className="text-xs text-cream-300/50 py-4 text-center">
              No orders placed yet. Orders will populate here as customers purchase.
            </p>
          ) : (
            <div className="space-y-3">
              {stats?.topSellingDesserts?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-cocoa-950/60 border border-white/5 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-caramel-500/20 text-caramel-400 flex items-center justify-center font-bold text-xs">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-cream-100">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-caramel-400">{item.quantitySold} sold</span>
                    <p className="text-[10px] text-cream-300/50">₹{item.totalRevenue}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Orders Queue */}
        <div className="lg:col-span-7 bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-base font-serif font-bold text-cream-100 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-caramel-400" />
              Recent Incoming Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs text-caramel-400 hover:text-caramel-300 font-semibold flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-cream-300/50 py-4 text-center">
              No recent orders in database. Place a test order from the customer site!
            </p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-3.5 rounded-2xl bg-cocoa-950/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-cream-100">{order.orderNumber}</strong>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-caramel-500/20 text-caramel-300 font-bold uppercase">
                        {order.fulfillmentStatus}
                      </span>
                    </div>
                    <p className="text-cream-300/70 mt-1">
                      {order.customerName} • {order.items?.length || 0} item(s)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 justify-between sm:justify-end">
                    <span className="text-sm font-bold text-cream-100">₹{order.total}</span>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="px-3 py-1.5 rounded-xl bg-cocoa-900 hover:bg-cocoa-800 border border-caramel-500/30 text-caramel-300 text-xs font-semibold transition-colors"
                    >
                      Manage
                    </Link>
                    <button
                      onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                      className="p-1.5 rounded-xl bg-cocoa-950 border border-strawberry-500/30 text-strawberry-400 hover:bg-strawberry-500/20 hover:text-strawberry-300 transition-colors"
                      title={`Delete order #${order.orderNumber}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Clean Test Data & Reset Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-cocoa-950 border border-caramel-500/30 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-caramel-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-strawberry-500/20 text-strawberry-400 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-black text-cream-100">
                    Clean Duplicate & Test Data
                  </h2>
                  <p className="text-xs text-cream-300/60">
                    Safely reset test orders, duplicate customer accounts, or website traffic.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="text-cream-300/40 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Option 1: Clean Test Orders & Recalculate Revenue */}
              <div className="p-4 rounded-2xl bg-cocoa-900/80 border border-white/5 space-y-2 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-cream-100">Test Orders & Revenue Reset</p>
                  <p className="text-cream-300/60 text-[11px]">
                    Removes automated test orders (Rohan Sharma, Quick Tester) and recalculates revenue.
                  </p>
                </div>
                <button
                  onClick={() => handleResetTarget("test_orders", "Test Orders & Live Board")}
                  className="px-3.5 py-2 rounded-xl bg-strawberry-500/20 border border-strawberry-500/40 hover:bg-strawberry-500/30 text-strawberry-300 font-bold whitespace-nowrap transition-all"
                >
                  Clean Orders
                </button>
              </div>

              {/* Option 2: Clean Test Customers */}
              <div className="p-4 rounded-2xl bg-cocoa-900/80 border border-white/5 space-y-2 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-cream-100">Duplicate Test Customers</p>
                  <p className="text-cream-300/60 text-[11px]">
                    Deletes test customer logins while preserving real customer records.
                  </p>
                </div>
                <button
                  onClick={() => handleResetTarget("test_customers", "Test Customers")}
                  className="px-3.5 py-2 rounded-xl bg-strawberry-500/20 border border-strawberry-500/40 hover:bg-strawberry-500/30 text-strawberry-300 font-bold whitespace-nowrap transition-all"
                >
                  Clean Customers
                </button>
              </div>

              {/* Option 3: Reset Traffic Page Visits */}
              <div className="p-4 rounded-2xl bg-cocoa-900/80 border border-white/5 space-y-2 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-cream-100">Reset Default Traffic Logs</p>
                  <p className="text-cream-300/60 text-[11px]">
                    Clears accumulated test page visits so traffic analytics start from fresh genuine visitors.
                  </p>
                </div>
                <button
                  onClick={() => handleResetTarget("traffic", "Traffic Page Views")}
                  className="px-3.5 py-2 rounded-xl bg-strawberry-500/20 border border-strawberry-500/40 hover:bg-strawberry-500/30 text-strawberry-300 font-bold whitespace-nowrap transition-all"
                >
                  Reset Traffic
                </button>
              </div>

              {/* Option 4: Full Clean All Test Data */}
              <div className="p-4 rounded-2xl bg-strawberry-950/30 border border-strawberry-500/30 space-y-2 flex items-center justify-between gap-4 mt-2">
                <div>
                  <p className="font-bold text-strawberry-300">Complete Test Data Wipeout</p>
                  <p className="text-cream-300/70 text-[11px]">
                    Cleans all test orders, test customers, and test traffic logs in 1 click.
                  </p>
                </div>
                <button
                  onClick={() => handleResetTarget("all_test_data", "All Test Data (Orders, Customers, Traffic)")}
                  className="px-4 py-2 rounded-xl bg-strawberry-600 hover:bg-strawberry-500 text-white font-bold whitespace-nowrap shadow-md transition-all"
                >
                  Wipe All Test Data
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-caramel-500/20 flex justify-end">
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-cocoa-900 border border-white/10 text-cream-200 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
