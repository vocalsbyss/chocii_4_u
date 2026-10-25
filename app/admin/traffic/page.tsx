"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  Users,
  Eye,
  ShoppingBag,
  TrendingUp,
  IndianRupee,
  RefreshCw,
  ArrowLeft,
  Smartphone,
  Laptop,
  Tablet,
  Globe,
  Share2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  Flame,
  Search,
  Trash2,
} from "lucide-react";

interface TrafficMetrics {
  uniqueVisitors: number;
  totalPageViews: number;
  totalOrders: number;
  totalRevenue: number;
  conversionRate: number;
  avgOrderValue: number;
  avgPagesPerVisitor: number;
}

interface FunnelData {
  totalVisitors: number;
  viewedMenu: number;
  viewedCart: number;
  reachedCheckout: number;
  completedOrders: number;
  menuConversionRate: number;
  cartConversionRate: number;
  checkoutConversionRate: number;
  orderConversionRate: number;
}

interface DeviceMetrics {
  mobile: { count: number; percentage: number };
  desktop: { count: number; percentage: number };
  tablet: { count: number; percentage: number };
}

interface TopPage {
  path: string;
  title: string;
  views: number;
  percentage: number;
}

interface TrafficSource {
  channel: string;
  count: number;
  percentage: number;
}

interface TrendPoint {
  date: string;
  visitors: number;
  views: number;
  orders: number;
  conversionRate: number;
}

interface RecentVisit {
  id: string;
  visitorId: string;
  path: string;
  device: string;
  browser: string;
  city: string;
  referrer: string;
  isCustomer: boolean;
  hasOrdered: boolean;
  orderNumber?: string | null;
  createdAt: string;
}

export default function AdminTrafficPage() {
  const [range, setRange] = useState<"today" | "7d" | "30d" | "all">("7d");
  const [metrics, setMetrics] = useState<TrafficMetrics | null>(null);
  const [funnel, setFunnel] = useState<FunnelData | null>(null);
  const [devices, setDevices] = useState<DeviceMetrics | null>(null);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [sources, setSources] = useState<TrafficSource[]>([]);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [recentVisits, setRecentVisits] = useState<RecentVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");

  const fetchTrafficData = async (selectedRange = range) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/traffic?range=${selectedRange}`);
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
        setFunnel(data.funnel);
        setDevices(data.devices);
        setTopPages(data.topPages || []);
        setSources(data.sources || []);
        setTrends(data.trends || []);
        setRecentVisits(data.recentVisits || []);
      }
    } catch (e) {
      console.error("Failed to load traffic data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleClearTraffic = async (targetRange: "today" | "7d" | "30d" | "all") => {
    const label = targetRange === "all" ? "all time" : targetRange;
    if (!confirm(`Are you sure you want to permanently clear ${label} traffic & page visit logs?`)) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/traffic", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "clear_all",
          range: targetRange === "all" ? undefined : targetRange,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to clear traffic");
      }
      alert(data.message || "Traffic records successfully cleared!");
      fetchTrafficData(range);
    } catch (e: any) {
      alert(e.message || "Failed to clear traffic records");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDuplicates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/traffic", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deduplicate" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to remove duplicates");
      }
      alert(data.message || `Removed ${data.count || 0} duplicate records.`);
      fetchTrafficData(range);
    } catch (e: any) {
      alert(e.message || "Failed to remove duplicate records");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVisit = async (visitId: string) => {
    try {
      const res = await fetch(`/api/admin/traffic?id=${visitId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete visit");
      }
      setRecentVisits((prev) => prev.filter((v) => v.id !== visitId));
    } catch (e: any) {
      alert(e.message || "Failed to delete visit");
    }
  };

  useEffect(() => {
    fetchTrafficData(range);
  }, [range]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchTrafficData(range);
    }, 12000);
    return () => clearInterval(interval);
  }, [range, autoRefresh]);

  const filteredVisits = (recentVisits || []).filter((v) => {
    if (!v) return false;
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    const p = (v.path || "").toLowerCase();
    const d = (v.device || "").toLowerCase();
    const o = (v.orderNumber || "").toLowerCase();
    const id = (v.visitorId || "").toLowerCase();
    return p.includes(term) || d.includes(term) || o.includes(term) || id.includes(term);
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-caramel-400 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-cream-100">
              Website Traffic & Conversion
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-caramel-500/15 border border-caramel-500/30 text-caramel-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Visakhapatnam Feed
            </span>
          </div>
          <p className="text-xs text-cream-300/60 mt-1">
            Track real-time visitor sessions, browsing behavior, drop-off funnels, and ordering conversion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe Selector Pills */}
          <div className="flex items-center bg-cocoa-900/80 p-1 rounded-2xl border border-white/10 text-xs">
            {(
              [
                { id: "today", label: "Today (24h)" },
                { id: "7d", label: "Last 7 Days" },
                { id: "30d", label: "Last 30 Days" },
                { id: "all", label: "All Time" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setRange(t.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  range === t.id
                    ? "bg-caramel-500 text-cocoa-950 font-bold shadow-sm"
                    : "text-cream-300/70 hover:text-cream-100 hover:bg-white/5"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Remove Duplicates Action */}
          <button
            onClick={handleRemoveDuplicates}
            disabled={loading}
            className="px-3.5 py-2.5 rounded-2xl bg-caramel-500/15 hover:bg-caramel-500/25 border border-caramel-500/30 text-caramel-300 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Clean duplicate page visits and repeated reloads"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Remove Duplicates</span>
          </button>

          {/* Clear Traffic Data */}
          <button
            onClick={() => handleClearTraffic(range)}
            disabled={loading}
            className="px-3.5 py-2.5 rounded-2xl bg-strawberry-500/15 hover:bg-strawberry-500/25 border border-strawberry-500/30 text-strawberry-300 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Clear and reset traffic page visit records"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Traffic ({range.toUpperCase()})</span>
          </button>

          {/* Refresh Action */}
          <button
            onClick={() => fetchTrafficData(range)}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-cocoa-900 border border-caramel-500/30 text-cream-200 hover:text-white transition-all disabled:opacity-50"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-caramel-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Hero KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Unique Visitors */}
        <div className="bg-cocoa-900/70 border border-caramel-500/20 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-cream-300/70">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Unique Visitors
            </span>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-caramel-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-black text-cream-100">
            {metrics?.uniqueVisitors?.toLocaleString() ?? "—"}
          </div>
          <p className="text-[11px] text-cream-300/50">
            Distinct people on site
          </p>
        </div>

        {/* Metric 2: Total Page Views */}
        <div className="bg-cocoa-900/70 border border-caramel-500/20 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-cream-300/70">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Total Page Views
            </span>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-caramel-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-black text-cream-100">
            {metrics?.totalPageViews?.toLocaleString() ?? "—"}
          </div>
          <p className="text-[11px] text-cream-300/50">
            Avg {metrics?.avgPagesPerVisitor ?? 0} pages / visitor
          </p>
        </div>

        {/* Metric 3: Orders Placed */}
        <div className="bg-cocoa-900/70 border border-caramel-500/20 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-cream-300/70">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Orders Placed
            </span>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-caramel-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-black text-cream-100">
            {metrics?.totalOrders?.toLocaleString() ?? "—"}
          </div>
          <p className="text-[11px] text-cream-300/50">
            Completed checkout
          </p>
        </div>

        {/* Metric 4: Conversion Rate */}
        <div className="bg-cocoa-900/70 border border-caramel-500/40 rounded-3xl p-5 space-y-2 relative overflow-hidden shadow-lg shadow-caramel-500/5">
          <div className="flex items-center justify-between text-caramel-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Conversion Rate
            </span>
            <div className="p-2 rounded-xl bg-caramel-500/20 border border-caramel-500/40 text-caramel-300">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-black text-caramel-400">
            {metrics?.conversionRate ?? 0}%
          </div>
          <p className="text-[11px] text-caramel-300/70 font-semibold">
            {metrics?.conversionRate && metrics.conversionRate > 3
              ? "★ Healthy F&B benchmark"
              : "Visitors who ordered"}
          </p>
        </div>

        {/* Metric 5: Revenue Generated */}
        <div className="col-span-2 lg:col-span-1 bg-cocoa-900/70 border border-caramel-500/20 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-cream-300/70">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Traffic Sales
            </span>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-caramel-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-black text-cream-100">
            ₹{metrics?.totalRevenue?.toLocaleString() ?? "—"}
          </div>
          <p className="text-[11px] text-cream-300/50">
            AOV: ₹{metrics?.avgOrderValue ?? 0}
          </p>
        </div>
      </div>

      {/* Section 2: Conversion Funnel (The Core Requirement: How many people coming vs how many ordering) */}
      <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-serif font-bold text-cream-100 flex items-center gap-2">
              <Flame className="w-5 h-5 text-caramel-400" />
              Customer Journey & Conversion Funnel
            </h2>
            <p className="text-xs text-cream-300/60 mt-0.5">
              Visualizes step-by-step visitor progression from store landing to final dessert order placement.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-caramel-500/10 border border-caramel-500/30 text-caramel-300 self-start sm:self-auto">
            Overall Funnel Conversion: {metrics?.conversionRate ?? 0}%
          </span>
        </div>

        {funnel && (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4 relative">
            {/* Step 1: Store Landing */}
            <div className="bg-cocoa-950/80 border border-white/10 rounded-2xl p-4 space-y-3 relative group hover:border-caramel-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-caramel-400">
                  Step 1
                </span>
                <span className="text-[11px] font-bold text-cream-100">100%</span>
              </div>
              <div>
                <p className="text-xs text-cream-300/70 font-medium">Store Visitors</p>
                <p className="text-xl sm:text-2xl font-serif font-black text-cream-100 mt-1">
                  {funnel?.totalVisitors ?? 0}
                </p>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div className="bg-caramel-500 h-full rounded-full" style={{ width: "100%" }} />
              </div>
              <p className="text-[10px] text-cream-300/50">Landed on homepage or catalog</p>
            </div>

            {/* Step 2: Explored Menu */}
            <div className="bg-cocoa-950/80 border border-white/10 rounded-2xl p-4 space-y-3 relative group hover:border-caramel-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-caramel-400">
                  Step 2
                </span>
                <span className="text-[11px] font-bold text-cream-100">
                  {funnel?.menuConversionRate ?? 0}%
                </span>
              </div>
              <div>
                <p className="text-xs text-cream-300/70 font-medium">Explored Menu</p>
                <p className="text-xl sm:text-2xl font-serif font-black text-cream-100 mt-1">
                  {funnel?.viewedMenu ?? 0}
                </p>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-caramel-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, funnel?.menuConversionRate ?? 0)}%` }}
                />
              </div>
              <p className="text-[10px] text-cream-300/50">Browsed desserts & 3D cakes</p>
            </div>

            {/* Step 3: Active Cart */}
            <div className="bg-cocoa-950/80 border border-white/10 rounded-2xl p-4 space-y-3 relative group hover:border-caramel-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-caramel-400">
                  Step 3
                </span>
                <span className="text-[11px] font-bold text-cream-100">
                  {funnel?.cartConversionRate ?? 0}%
                </span>
              </div>
              <div>
                <p className="text-xs text-cream-300/70 font-medium">Added to Cart</p>
                <p className="text-xl sm:text-2xl font-serif font-black text-cream-100 mt-1">
                  {funnel?.viewedCart ?? 0}
                </p>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-caramel-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, funnel?.cartConversionRate ?? 0)}%` }}
                />
              </div>
              <p className="text-[10px] text-cream-300/50">Selected items & add-ons</p>
            </div>

            {/* Step 4: Reached Checkout */}
            <div className="bg-cocoa-950/80 border border-white/10 rounded-2xl p-4 space-y-3 relative group hover:border-caramel-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-caramel-400">
                  Step 4
                </span>
                <span className="text-[11px] font-bold text-cream-100">
                  {funnel?.checkoutConversionRate ?? 0}%
                </span>
              </div>
              <div>
                <p className="text-xs text-cream-300/70 font-medium">Entered Checkout</p>
                <p className="text-xl sm:text-2xl font-serif font-black text-cream-100 mt-1">
                  {funnel?.reachedCheckout ?? 0}
                </p>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-caramel-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, funnel?.checkoutConversionRate ?? 0)}%` }}
                />
              </div>
              <p className="text-[10px] text-cream-300/50">Filled address & payment method</p>
            </div>

            {/* Step 5: Completed Order */}
            <div className="bg-gradient-to-br from-caramel-950/60 to-cocoa-950/80 border border-caramel-500/40 rounded-2xl p-4 space-y-3 relative group shadow-md shadow-caramel-500/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Step 5
                </span>
                <span className="text-[11px] font-bold text-caramel-300">
                  {metrics?.conversionRate ?? 0}%
                </span>
              </div>
              <div>
                <p className="text-xs text-caramel-200 font-semibold">Orders Completed</p>
                <p className="text-xl sm:text-2xl font-serif font-black text-cream-100 mt-1">
                  {funnel?.completedOrders ?? 0}
                </p>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${Math.min(100, metrics?.conversionRate || 0)}%` }}
                />
              </div>
              <p className="text-[10px] text-emerald-300/70 font-medium">Paid / Confirmed orders</p>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Traffic Volume vs Ordering Trends Chart */}
      {trends.length > 0 && (
        <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-serif font-bold text-cream-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-caramel-400" />
                Daily Traffic & Ordering Timeline
              </h2>
              <p className="text-xs text-cream-300/60 mt-0.5">
                Comparison of daily incoming visitors vs orders placed over the selected timeframe.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-caramel-500" />
                <span className="text-cream-300">Visitors</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-emerald-400" />
                <span className="text-cream-300">Orders Placed</span>
              </div>
            </div>
          </div>

          {/* CSS/SVG Bar Chart Grid */}
          <div className="pt-4">
            <div className="grid grid-cols-7 sm:grid-cols-7 gap-2 sm:gap-4 items-end h-56 border-b border-white/10 pb-2">
              {trends.slice(-7).map((point, idx) => {
                const maxVisitors = Math.max(...trends.map((t) => t.visitors), 1);
                const visitorHeight = Math.max(12, Math.round((point.visitors / maxVisitors) * 160));
                const orderHeight = Math.max(6, Math.round((point.orders / (Math.max(...trends.map((t) => t.orders), 1))) * 120));

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-bold text-caramel-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      {point.orders} orders
                    </div>
                    <div className="flex items-end gap-1.5 w-full justify-center">
                      {/* Visitors Bar */}
                      <div
                        style={{ height: `${visitorHeight}px` }}
                        className="w-1/2 sm:w-8 bg-caramel-500/80 hover:bg-caramel-400 rounded-t-lg transition-all relative"
                        title={`${point.visitors} visitors`}
                      />
                      {/* Orders Bar */}
                      <div
                        style={{ height: `${orderHeight}px` }}
                        className="w-1/2 sm:w-6 bg-emerald-400 hover:bg-emerald-300 rounded-t-lg transition-all relative"
                        title={`${point.orders} orders`}
                      />
                    </div>
                    <span className="text-[11px] text-cream-300/60 font-medium whitespace-nowrap">
                      {point.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Device Breakdown & Traffic Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Device Breakdown */}
        <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-cream-100 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-caramel-400" />
              Device Distribution
            </h2>
            <span className="text-[11px] text-caramel-400 uppercase font-bold tracking-wider">
              Visakhapatnam Shoppers
            </span>
          </div>

          {devices && !Array.isArray(devices) && (
            <div className="space-y-4">
              {/* Mobile */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-cream-100 font-semibold">
                    <Smartphone className="w-4 h-4 text-caramel-400" />
                    Mobile Devices (Smartphones)
                  </span>
                  <span className="text-caramel-300 font-bold">
                    {devices.mobile?.percentage ?? 0}% ({(devices.mobile?.count ?? 0).toLocaleString()} views)
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-caramel-500 h-full rounded-full"
                    style={{ width: `${devices.mobile?.percentage ?? 0}%` }}
                  />
                </div>
              </div>

              {/* Desktop */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-cream-100 font-semibold">
                    <Laptop className="w-4 h-4 text-caramel-400" />
                    Desktop & Laptops
                  </span>
                  <span className="text-caramel-300 font-bold">
                    {devices.desktop?.percentage ?? 0}% ({(devices.desktop?.count ?? 0).toLocaleString()} views)
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-caramel-400/60 h-full rounded-full"
                    style={{ width: `${devices.desktop?.percentage ?? 0}%` }}
                  />
                </div>
              </div>

              {/* Tablet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-cream-100 font-semibold">
                    <Tablet className="w-4 h-4 text-caramel-400" />
                    Tablets & iPads
                  </span>
                  <span className="text-caramel-300 font-bold">
                    {devices.tablet?.percentage ?? 0}% ({(devices.tablet?.count ?? 0).toLocaleString()} views)
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-caramel-300/40 h-full rounded-full"
                    style={{ width: `${devices.tablet?.percentage ?? 0}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 p-3.5 rounded-2xl bg-cocoa-950/70 border border-white/5 text-[11px] text-cream-300/70">
                💡 <strong className="text-cream-100">Insight:</strong> The vast majority of our Visakhapatnam dessert cravings originate from mobile phones. Ensure quick 1-tap checkout and WhatsApp ordering support.
              </div>
            </div>
          )}
        </div>

        {/* Traffic Channels & Referrers */}
        <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-cream-100 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-caramel-400" />
              Traffic Sources & Referrals
            </h2>
            <span className="text-[11px] text-cream-300/50">Top Channels</span>
          </div>

          <div className="space-y-3">
            {sources.length === 0 ? (
              <div className="py-8 text-center text-cream-300/40 text-xs">
                No referral traffic recorded in this timeframe.
              </div>
            ) : (
              sources.map((src, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-2xl bg-cocoa-950/80 border border-white/10 hover:border-caramel-500/30 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-caramel-500/15 text-caramel-400 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-xs font-semibold text-cream-100">
                      {src.channel}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-caramel-300">
                      {src.percentage}%
                    </span>
                    <span className="text-[10px] text-cream-300/50 block">
                      {src.count} views
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Section 5: Top Performing Pages & Desserts */}
      <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-cream-100 flex items-center gap-2">
              <Eye className="w-5 h-5 text-caramel-400" />
              Most Visited Pages & Desserts
            </h2>
            <p className="text-xs text-cream-300/60 mt-0.5">
              Which desserts and customer touchpoints are getting the highest engagement.
            </p>
          </div>
          <span className="text-xs text-caramel-400 font-semibold">
            {topPages.length} active destinations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-cream-300/50 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Page / Destination</th>
                <th className="pb-3 font-semibold">URL Path</th>
                <th className="pb-3 font-semibold text-right">Page Views</th>
                <th className="pb-3 font-semibold text-right">Share of Traffic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topPages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-cream-300/40 text-xs">
                    No page visit traffic recorded in this timeframe.
                  </td>
                </tr>
              ) : (
                topPages.map((page, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 pr-4 font-semibold text-cream-100">
                      {page.title}
                    </td>
                    <td className="py-3.5 pr-4 text-cream-300/60 font-mono text-[11px]">
                      {page.path}
                    </td>
                    <td className="py-3.5 pr-4 text-right font-bold text-cream-100">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-right font-bold text-caramel-300">
                      {page.percentage}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 6: Live Visitor Stream (Real-Time Activity) */}
      <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-lg font-serif font-bold text-cream-100">
                Live Visitor Activity Stream
              </h2>
            </div>
            <p className="text-xs text-cream-300/60 mt-0.5">
              Real-time feed of recent customer visits, paths viewed, and order completions in Visakhapatnam.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-cream-300/40" />
              <input
                type="text"
                placeholder="Filter by path or order..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-cocoa-950/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-cream-100 placeholder:text-cream-300/40 focus:outline-none focus:border-caramel-500"
              />
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                autoRefresh
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                  : "bg-white/5 border-white/10 text-cream-300/60"
              }`}
            >
              {autoRefresh ? "Live: Auto ON" : "Paused"}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-cocoa-900 z-10">
              <tr className="border-b border-white/10 text-cream-300/50 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Time</th>
                <th className="pb-3 font-semibold">Visitor & Device</th>
                <th className="pb-3 font-semibold">Location</th>
                <th className="pb-3 font-semibold">Page Visited</th>
                <th className="pb-3 font-semibold text-right">Outcome / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-cream-300/40">
                    No matching visitor records found.
                  </td>
                </tr>
              ) : (
                filteredVisits.map((v) => (
                  <tr key={v.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-3 text-cream-300/60 whitespace-nowrap text-[11px]">
                      {new Date(v.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-3 pr-3 font-medium text-cream-100">
                      <div className="flex items-center gap-1.5">
                        {v.device === "mobile" ? (
                          <Smartphone className="w-3.5 h-3.5 text-caramel-400" />
                        ) : (
                          <Laptop className="w-3.5 h-3.5 text-caramel-400" />
                        )}
                        <span className="font-mono text-[11px] text-cream-200">
                          {v.visitorId ? (v.visitorId.length > 10 ? v.visitorId.substring(0, 10) + "..." : v.visitorId) : "Visitor"}
                        </span>
                        {v.isCustomer && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-caramel-500/20 text-caramel-300">
                            Member
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-cream-300/70 text-[11px]">
                      {v.city || "Visakhapatnam"}
                    </td>
                    <td className="py-3 pr-3 font-mono text-[11px] text-cream-100 max-w-[220px] truncate">
                      {v.path}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {v.hasOrdered || v.orderNumber ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                            <CheckCircle2 className="w-3 h-3" />
                            Ordered {v.orderNumber || ""}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 border border-white/10 text-cream-300/60">
                            Browsing
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteVisit(v.id)}
                          className="p-1 rounded-lg hover:bg-strawberry-500/20 text-cream-300/40 hover:text-strawberry-400 transition-colors"
                          title="Delete visit entry"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
