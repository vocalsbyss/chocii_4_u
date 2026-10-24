"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import {
  Search,
  Clock,
  CheckCircle2,
  ChefHat,
  Package,
  Bike,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { OrderFulfillmentStatus } from "@/types";

const STATUS_STEPS: Array<{
  key: OrderFulfillmentStatus;
  title: string;
  desc: string;
  icon: any;
}> = [
  {
    key: "PENDING",
    title: "Order Placed",
    desc: "Received by kitchen queue",
    icon: Clock,
  },
  {
    key: "CONFIRMED",
    title: "Order Confirmed",
    desc: "Ingredients allocated",
    icon: CheckCircle2,
  },
  {
    key: "PREPARING",
    title: "Baking & Assembling",
    desc: "Pastry chef crafting desserts",
    icon: ChefHat,
  },
  {
    key: "READY",
    title: "Freshly Packed",
    desc: "Sealed in protective container",
    icon: Package,
  },
  {
    key: "OUT_FOR_DELIVERY",
    title: "Out for Delivery",
    desc: "Rider on the way to you",
    icon: Bike,
  },
  {
    key: "DELIVERED",
    title: "Delivered",
    desc: "Time to indulge!",
    icon: Sparkles,
  },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [inputQuery, setInputQuery] = useState(tokenFromUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any | null>(null);

  const fetchOrderStatus = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      // First try tracking token endpoint
      let res = await fetch(`/api/orders/track/${encodeURIComponent(query.trim())}`);
      if (!res.ok) {
        // If not token, try orderNumber via orders/[id]
        res = await fetch(`/api/orders/${encodeURIComponent(query.trim())}`);
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order not found. Please check order number or link.");
      }

      setOrderData(data.order);
    } catch (err: any) {
      setError(err.message || "Failed to locate order.");
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenFromUrl) {
      setInputQuery(tokenFromUrl);
      fetchOrderStatus(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  // Real-time polling for updates every 8 seconds if order is active
  useEffect(() => {
    if (!orderData || orderData.fulfillmentStatus === "DELIVERED" || orderData.fulfillmentStatus === "CANCELLED") {
      return;
    }

    const interval = setInterval(() => {
      if (inputQuery) {
        fetchOrderStatus(inputQuery);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [orderData, inputQuery]);

  // Determine current active step index
  const getCurrentStepIndex = (status: OrderFulfillmentStatus) => {
    return STATUS_STEPS.findIndex((s) => s.key === status);
  };

  const activeIndex = orderData ? getCurrentStepIndex(orderData.fulfillmentStatus) : -1;
  const isCancelled = orderData?.fulfillmentStatus === "CANCELLED";

  return (
    <div className="min-h-screen bg-cocoa-950 text-cream-100 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-caramel-400 font-bold">
              Real-Time Kitchen Monitor
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-cream-100">
              Track Your Craving
            </h1>
            <p className="text-xs sm:text-sm text-cream-200/70 font-light">
              Follow your freshly prepared desserts from our kitchen oven to your door.
            </p>
          </div>

          {/* Search Lookup Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchOrderStatus(inputQuery);
            }}
            className="max-w-md mx-auto flex gap-2"
          >
            <input
              type="text"
              placeholder="Enter Order # (e.g. CB-261020-123)"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-cocoa-900/70 border border-white/10 rounded-2xl px-4 py-3 text-xs text-cream-100 placeholder:text-cream-300/40 focus:outline-none focus:border-caramel-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-caramel-500 hover:bg-caramel-400 text-cocoa-950 font-bold uppercase tracking-wider text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              Track
            </button>
          </form>

          {error && (
            <div className="p-4 rounded-2xl bg-strawberry-500/15 border border-strawberry-500/40 text-strawberry-300 text-xs font-semibold flex items-center gap-2 max-w-md mx-auto">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Status Display */}
          {orderData && (
            <div className="bg-cocoa-900/80 border border-caramel-500/30 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl backdrop-blur-md animate-in fade-in">
              {/* Order Info Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-caramel-400">
                    Live Order
                  </span>
                  <h3 className="text-xl font-serif font-black text-cream-100 mt-0.5">
                    {orderData.orderNumber}
                  </h3>
                  <p className="text-xs text-cream-300/60 mt-0.5">
                    Recipient: {orderData.customerName} ({orderData.customerPhone})
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-caramel-400">
                    Total Value
                  </span>
                  <p className="text-2xl font-bold text-cream-100">₹{orderData.total}</p>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-cocoa-950 border border-white/10 text-cream-200">
                    {orderData.paymentMethod} • {orderData.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              {isCancelled ? (
                <div className="p-6 rounded-2xl bg-strawberry-500/15 border border-strawberry-500/40 text-center space-y-2">
                  <p className="text-base font-bold text-strawberry-400">Order Cancelled</p>
                  <p className="text-xs text-cream-200/80">
                    This order was cancelled by the kitchen management. Please contact our WhatsApp hotline (+91 86883 67177) for immediate priority assistance or replacement.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-caramel-400">
                    Preparation & Delivery Stepper
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {STATUS_STEPS.map((step, idx) => {
                      const Icon = step.icon;
                      const isComplete = idx <= activeIndex;
                      const isCurrent = idx === activeIndex;

                      return (
                        <div
                          key={step.key}
                          className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-between min-h-[130px] ${
                            isCurrent
                              ? "border-caramel-500 bg-caramel-500/20 ring-2 ring-caramel-500/40 shadow-lg shadow-caramel-500/15"
                              : isComplete
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                              : "border-white/5 bg-cocoa-950/40 opacity-50"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 ${
                              isCurrent
                                ? "bg-caramel-500 text-cocoa-950 font-bold"
                                : isComplete
                                ? "bg-emerald-500 text-cocoa-950"
                                : "bg-cocoa-900 text-cream-300/40"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div>
                            <p
                              className={`text-xs font-bold ${
                                isCurrent
                                  ? "text-cream-100"
                                  : isComplete
                                  ? "text-emerald-300"
                                  : "text-cream-300/50"
                              }`}
                            >
                              {step.title}
                            </p>
                            <p className="text-[10px] text-cream-300/60 mt-0.5 leading-tight">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Items & Address Summary */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-cream-200">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-caramel-400">
                    Desserts Snapshot
                  </p>
                  {orderData.items?.map((it: any) => (
                    <div key={it.id} className="flex justify-between py-1 border-b border-white/5">
                      <span>{it.productName} ({it.customization}) × {it.quantity}</span>
                      <span className="font-semibold text-cream-100">₹{it.lineTotal}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-caramel-400">
                    Delivering To
                  </p>
                  <p className="text-cream-100 font-medium">{orderData.deliveryAddress}</p>
                  {orderData.landmark && (
                    <p className="text-cream-300/60">Landmark: {orderData.landmark}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cocoa-950 flex items-center justify-center text-cream-100">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-caramel-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-cream-300/70">Connecting to Kitchen Monitor...</p>
          </div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
