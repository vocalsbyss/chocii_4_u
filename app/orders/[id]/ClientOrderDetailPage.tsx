"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Truck,
  ChefHat,
  Package,
  MapPin,
  RefreshCw,
  ShoppingBag,
  Phone,
} from "lucide-react";
import { Order } from "@/types";

interface ClientOrderDetailPageProps {
  order: Order;
}

const STEPS = [
  { key: "PENDING", label: "Order Received", icon: Clock },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
  { key: "PREPARING", label: "In Kitchen", icon: ChefHat },
  { key: "READY", label: "Packed & Sealed", icon: Package },
  { key: "OUT_FOR_DELIVERY", label: "On The Way", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle },
];

export default function ClientOrderDetailPage({ order: initialOrder }: ClientOrderDetailPageProps) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [refreshing, setRefreshing] = useState(false);

  const currentStepIndex = STEPS.findIndex((s) => s.key === order.fulfillmentStatus);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      }
    } catch {}
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <div className="min-h-screen bg-cocoa-950 text-cream-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Back link */}
          <div className="flex items-center justify-between">
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-xs font-semibold text-cream-300/70 hover:text-caramel-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Orders
            </Link>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 text-xs text-caramel-400 hover:text-caramel-300 font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh Status
            </button>
          </div>

          {/* Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-cocoa-900/60 border border-caramel-500/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-caramel-400">
                  Direct Kitchen Order
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-black text-cream-100 mt-1">
                  Order #{order.orderNumber}
                </h1>
                <p className="text-xs text-cream-300/60 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                  {new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-2xl font-black text-caramel-400">
                  ₹{order.total}
                </span>
                <p className="text-[11px] text-cream-300/60 mt-0.5">
                  Payment: {order.paymentMethod.replace(/_/g, " ")} ({order.paymentStatus})
                </p>
              </div>
            </div>

            {/* Live Status Stepper */}
            <div className="py-4">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = currentStepIndex >= idx;
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isCurrent
                            ? "bg-caramel-500 text-cocoa-950 ring-4 ring-caramel-500/30 scale-110"
                            : isDone
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-cocoa-950 text-cream-300/30 border border-white/10"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[10px] uppercase tracking-wider font-bold ${
                          isCurrent
                            ? "text-caramel-400"
                            : isDone
                            ? "text-cream-100"
                            : "text-cream-300/30"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Two-Column Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: Items Breakdown */}
            <div className="md:col-span-7 p-6 sm:p-8 rounded-3xl bg-cocoa-900/40 border border-white/10 space-y-4">
              <h3 className="text-lg font-serif font-bold text-cream-100 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-caramel-400" />
                Ordered Desserts
              </h3>

              <div className="divide-y divide-white/5">
                {(order.items || []).map((item) => (
                  <div key={item.id} className="py-3.5 space-y-1">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="font-semibold text-cream-100">
                        {item.productName} ({item.customization}) × {item.quantity}
                      </span>
                      <span className="font-bold text-caramel-400">
                        ₹{item.lineTotal}
                      </span>
                    </div>
                    {item.selectedAddons && item.selectedAddons !== "[]" && (
                      <p className="text-[11px] text-cream-300/60">
                        Toppings: {JSON.parse(item.selectedAddons).map((a: any) => a.name).join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-1.5 text-xs text-cream-200/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{order.deliveryFee > 0 ? `₹${order.deliveryFee}` : "FREE"}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-cream-100 pt-2 border-t border-white/5">
                  <span>Total Paid</span>
                  <span className="text-caramel-400">₹{order.total}</span>
                </div>
              </div>
            </div>

            {/* Right: Delivery Information */}
            <div className="md:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-cocoa-900/40 border border-white/10 space-y-4 text-xs">
                <h3 className="text-sm font-bold text-cream-100 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-caramel-400" />
                  Delivery Details
                </h3>

                <div className="space-y-1 text-cream-200/80">
                  <p className="font-semibold text-cream-100">{order.customerName}</p>
                  <p className="font-mono">{order.customerPhone}</p>
                  <p className="pt-1 leading-relaxed">{order.deliveryAddress}</p>
                  {order.landmark && (
                    <p className="text-cream-300/60">Landmark: {order.landmark}</p>
                  )}
                  {order.specialInstructions && (
                    <p className="text-caramel-300 pt-1 italic">
                      Note: "{order.specialInstructions}"
                    </p>
                  )}
                </div>
              </div>

              {/* Kitchen Assistance */}
              <div className="p-6 rounded-3xl bg-cocoa-900/40 border border-white/10 space-y-3 text-xs text-cream-200/80">
                <h4 className="font-bold text-cream-100">Need Immediate Help?</h4>
                <p className="text-[11px] font-light">
                  Our kitchen dispatch team can update instructions or check live rider coordinates directly.
                </p>
                <a
                  href="https://wa.me/918688367177"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-full bg-[#25D366] text-black font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  WhatsApp Kitchen Dispatch
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
