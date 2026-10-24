"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Bell,
  BellOff,
  Clock,
  CheckCircle2,
  ChefHat,
  Package,
  Bike,
  Sparkles,
  Ban,
  ArrowRight,
  RefreshCw,
  Eye,
  MessageSquare,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Order, OrderFulfillmentStatus } from "@/types";

// Zero-dependency pleasant chime synthesizer using Web Audio API
function playOrderChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Pleasant two-tone chime
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880.0, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {
    console.error("Audio chime error:", e);
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [currentFilter, setCurrentFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Status Note Dialog State
  const [noteModalOrder, setNoteModalOrder] = useState<Order | null>(null);
  const [targetStatus, setTargetStatus] = useState<OrderFulfillmentStatus | null>(null);
  const [statusNote, setStatusNote] = useState("");

  const prevPendingCountRef = useRef(0);

  const fetchOrders = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const url = `/api/admin/orders?status=${currentFilter}&q=${encodeURIComponent(
        searchQuery
      )}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
        setCounts(data.counts || {});

        // If new pending orders arrived, play audio notification
        const newPending = data.counts?.PENDING || 0;
        if (newPending > prevPendingCountRef.current && prevPendingCountRef.current !== 0) {
          if (soundEnabled) {
            playOrderChime();
          }
        }
        prevPendingCountRef.current = newPending;
      }
    } catch (e) {
      console.error("Error polling admin orders:", e);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  // Initial and on filter change
  useEffect(() => {
    fetchOrders(false);
  }, [currentFilter]);

  // Real-time polling every 4 seconds for instant updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentFilter, searchQuery, soundEnabled]);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderFulfillmentStatus,
    note?: string
  ) => {
    setActionLoadingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          note: note || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      // Optimistically update order in state
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, fulfillmentStatus: newStatus } : o
        )
      );

      // Re-fetch counts
      fetchOrders(true);
    } catch (e: any) {
      alert(e.message || "Failed to update status");
    } finally {
      setActionLoadingId(null);
      setNoteModalOrder(null);
      setTargetStatus(null);
      setStatusNote("");
    }
  };

  const openNoteDialog = (order: Order, status: OrderFulfillmentStatus) => {
    setNoteModalOrder(order);
    setTargetStatus(status);
    setStatusNote("");
  };

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Are you sure you want to permanently delete Order #${orderNumber}?`)) {
      return;
    }
    setActionLoadingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete order");
      }
      // Remove from state immediately
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      fetchOrders(true);
    } catch (e: any) {
      alert(e.message || "Failed to delete order");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleClearTestOrders = async () => {
    if (
      !confirm(
        "Clean all test and duplicate orders? (Orders from Rohan Sharma, Quick Tester, and test numbers will be permanently deleted)."
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear_test" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to clear test orders");
      }
      alert(data.message || "Test orders successfully cleared!");
      fetchOrders(false);
    } catch (e: any) {
      alert(e.message || "Failed to clean test orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: OrderFulfillmentStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-strawberry-500/20 text-strawberry-300 border-strawberry-500/40 animate-pulse";
      case "CONFIRMED":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "PREPARING":
        return "bg-caramel-500/20 text-caramel-300 border-caramel-500/40";
      case "READY":
        return "bg-sky-500/20 text-sky-300 border-sky-500/40";
      case "OUT_FOR_DELIVERY":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "DELIVERED":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "CANCELLED":
        return "bg-zinc-700/40 text-zinc-400 border-zinc-600";
      default:
        return "bg-white/10 text-white border-white/20";
    }
  };

  const filterTabs = [
    { key: "ALL", label: "All Orders" },
    { key: "PENDING", label: "New (Pending)" },
    { key: "PREPARING", label: "In Kitchen" },
    { key: "READY", label: "Ready to Dispatch" },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
    { key: "DELIVERED", label: "Delivered" },
    { key: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Sound Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-caramel-400 font-bold">
            Live Database Sync
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-cream-100 mt-1">
            Real-Time Order Queue
          </h1>
          <p className="text-xs text-cream-300/60 mt-0.5">
            Auto-refreshes every 4s • Customer orders show immediately without WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Clean Test Orders */}
          <button
            onClick={handleClearTestOrders}
            className="px-3.5 py-2 rounded-xl bg-strawberry-500/15 hover:bg-strawberry-500/25 border border-strawberry-500/30 text-strawberry-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Clean test orders from automated testing"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clean Test Orders</span>
          </button>

          {/* Audio Chime Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playOrderChime();
            }}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
              soundEnabled
                ? "bg-caramel-500/15 border-caramel-500/40 text-caramel-300"
                : "bg-cocoa-900 border-white/10 text-cream-300/50"
            }`}
          >
            {soundEnabled ? (
              <>
                <Bell className="w-3.5 h-3.5 text-caramel-400" />
                Alert Chime On
              </>
            ) : (
              <>
                <BellOff className="w-3.5 h-3.5" />
                Alert Chime Muted
              </>
            )}
          </button>

          <button
            onClick={() => fetchOrders(false)}
            className="p-2.5 rounded-xl bg-cocoa-900 border border-caramel-500/30 text-cream-200 hover:text-white transition-colors"
            title="Manual refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search & Filter Tabs */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-300/40" />
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cocoa-900/60 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-cream-100 placeholder:text-cream-300/40 focus:outline-none focus:border-caramel-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => {
            const count = counts[tab.key] || 0;
            const isSelected = currentFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setCurrentFilter(tab.key)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-caramel-500 text-cocoa-950 font-bold shadow-md shadow-caramel-500/20"
                    : "bg-cocoa-900/70 text-cream-200/80 hover:bg-cocoa-800 border border-white/5"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-cocoa-950 text-caramel-300" : "bg-white/10 text-cream-100"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List / Cards */}
      {loading && orders.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-caramel-400 animate-spin mx-auto" />
          <p className="text-sm font-medium">Syncing live orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-cocoa-900/40 border border-white/10 rounded-3xl p-12 text-center space-y-3">
          <ShoppingBag className="w-10 h-10 text-caramel-400/50 mx-auto" />
          <h3 className="text-base font-semibold text-cream-100">No orders in this view</h3>
          <p className="text-xs text-cream-300/60 max-w-sm mx-auto">
            Place an order on the customer website to watch it appear here immediately!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isActionLoading = actionLoadingId === order.id;

            return (
              <div
                key={order.id}
                className={`bg-cocoa-900/70 border rounded-3xl p-5 sm:p-6 transition-all shadow-xl space-y-4 ${
                  order.fulfillmentStatus === "PENDING"
                    ? "border-strawberry-500/50 bg-strawberry-950/20"
                    : "border-caramel-500/20 hover:border-caramel-500/40"
                }`}
              >
                {/* Order Top Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-cream-100">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getStatusBadgeColor(
                        order.fulfillmentStatus
                      )}`}
                    >
                      {order.fulfillmentStatus.replace(/_/g, " ")}
                    </span>
                    <span className="text-[11px] text-cream-300/60 hidden sm:inline">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-lg font-bold text-caramel-400">
                        ₹{order.total}
                      </span>
                      <span className="text-[10px] text-cream-300/60 block">
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="p-2 rounded-xl bg-cocoa-950 border border-white/10 text-cream-200 hover:text-white"
                        title="View full order details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                        disabled={isActionLoading}
                        className="p-2 rounded-xl bg-cocoa-950 border border-strawberry-500/30 text-strawberry-400 hover:bg-strawberry-500/20 hover:text-strawberry-300 transition-colors"
                        title="Delete order permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Customer Details & Items Snapshot */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-xs">
                  {/* Recipient info */}
                  <div className="md:col-span-4 space-y-1">
                    <p className="font-semibold text-cream-100 text-sm">
                      {order.customerName}
                    </p>
                    <p className="text-caramel-400 font-mono">{order.customerPhone}</p>
                    <p className="text-cream-300/70 leading-relaxed mt-1">
                      {order.deliveryAddress}
                    </p>
                    {order.landmark && (
                      <p className="text-cream-300/50">Landmark: {order.landmark}</p>
                    )}
                    {order.specialInstructions && (
                      <p className="text-amber-400/90 italic mt-1">
                        Note: {order.specialInstructions}
                      </p>
                    )}
                  </div>

                  {/* Items snapshot */}
                  <div className="md:col-span-8 space-y-2 bg-cocoa-950/60 border border-white/5 rounded-2xl p-4">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-caramel-400">
                      Items Ordered ({order.items?.length || 0})
                    </p>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {order.items?.map((it) => (
                        <div
                          key={it.id}
                          className="flex items-center justify-between text-xs py-1 border-b border-white/5"
                        >
                          <div>
                            <span className="font-semibold text-cream-100">
                              {it.productName}
                            </span>
                            <span className="text-caramel-300/80 ml-2">
                              [{it.customization}]
                            </span>
                            <span className="text-cream-300/60 ml-2">× {it.quantity}</span>
                          </div>
                          <span className="font-bold text-cream-100">₹{it.lineTotal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status State Transition Workflow Buttons */}
                <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-cream-300/60 mr-1 font-medium">
                      Workflow Action:
                    </span>

                    {order.fulfillmentStatus === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(order.id, "CONFIRMED")}
                          disabled={isActionLoading}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Confirm Order
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order.id, "PREPARING")}
                          disabled={isActionLoading}
                          className="px-3.5 py-1.5 rounded-xl bg-caramel-500 hover:bg-caramel-400 text-cocoa-950 font-bold text-xs flex items-center gap-1.5 transition-all"
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                          Start Baking
                        </button>
                      </>
                    )}

                    {order.fulfillmentStatus === "CONFIRMED" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "PREPARING")}
                        disabled={isActionLoading}
                        className="px-3.5 py-1.5 rounded-xl bg-caramel-500 hover:bg-caramel-400 text-cocoa-950 font-bold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <ChefHat className="w-3.5 h-3.5" />
                        Start Baking
                      </button>
                    )}

                    {order.fulfillmentStatus === "PREPARING" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "READY")}
                        disabled={isActionLoading}
                        className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-cocoa-950 font-bold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <Package className="w-3.5 h-3.5" />
                        Mark as Packed / Ready
                      </button>
                    )}

                    {order.fulfillmentStatus === "READY" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "OUT_FOR_DELIVERY")}
                        disabled={isActionLoading}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <Bike className="w-3.5 h-3.5" />
                        Dispatch for Delivery
                      </button>
                    )}

                    {order.fulfillmentStatus === "OUT_FOR_DELIVERY" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "DELIVERED")}
                        disabled={isActionLoading}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-cocoa-950 font-bold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Mark as Delivered
                      </button>
                    )}

                    {order.fulfillmentStatus !== "DELIVERED" &&
                      order.fulfillmentStatus !== "CANCELLED" && (
                        <button
                          onClick={() => openNoteDialog(order, "CANCELLED")}
                          disabled={isActionLoading}
                          className="px-3 py-1.5 rounded-xl bg-strawberry-500/10 hover:bg-strawberry-500/20 border border-strawberry-500/30 text-strawberry-400 text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          <Ban className="w-3 h-3" />
                          Cancel
                        </button>
                      )}
                  </div>

                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-xs text-caramel-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    View Status History ({order.statusHistory?.length || 0})
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Status Note Dialog Modal */}
      {noteModalOrder && targetStatus && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            onClick={() => setNoteModalOrder(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-cocoa-900 border border-caramel-500/30 rounded-3xl p-6 text-cream-100 space-y-4 shadow-2xl">
              <h3 className="text-base font-serif font-bold text-cream-100">
                Confirm Status Change: {targetStatus}
              </h3>
              <p className="text-xs text-cream-300/70">
                Order #{noteModalOrder.orderNumber} for {noteModalOrder.customerName}.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-caramel-400">
                  Audit History Note (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Reason for cancellation, rider name, kitchen delay..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full bg-cocoa-950 border border-white/10 rounded-xl p-3 text-xs text-cream-100 placeholder:text-cream-300/30 focus:outline-none focus:border-caramel-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setNoteModalOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs text-cream-200 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(noteModalOrder.id, targetStatus, statusNote)
                  }
                  className="px-5 py-2.5 rounded-xl bg-caramel-500 hover:bg-caramel-400 text-cocoa-950 font-bold uppercase tracking-wider text-xs shadow-md"
                >
                  Save Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
