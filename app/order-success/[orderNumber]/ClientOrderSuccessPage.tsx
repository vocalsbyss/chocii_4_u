"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import confetti from "canvas-confetti";
import { CheckCircle2, Clock, MapPin, ArrowRight, Share2, Phone } from "lucide-react";
import { Order } from "@/types";

export default function ClientOrderSuccessPage({ order }: { order: Order }) {
  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#C58A55", "#E85D75", "#FFF5E9", "#3A211B"],
    });
  }, []);

  // Format WhatsApp summary if customer wants a copy on phone
  const whatsappText = encodeURIComponent(
    `*chocii 4 u — Order Copy*\n` +
      `Order #: ${order.orderNumber}\n` +
      `Total: ₹${order.total}\n` +
      `Customer: ${order.customerName}\n` +
      `Address: ${order.deliveryAddress}\n` +
      `Payment: ${order.paymentMethod}\n` +
      `Track: ${window.location.origin}/track-order?token=${order.trackingToken}`
  );

  return (
    <div className="min-h-screen bg-cocoa-950 text-cream-100 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Success Banner */}
          <div className="bg-cocoa-900/80 border border-caramel-500/30 rounded-3xl p-8 text-center space-y-4 shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs uppercase tracking-widest text-caramel-400 font-bold">
              Order Confirmed & Sent to Kitchen
            </span>

            <h1 className="text-3xl sm:text-4xl font-serif font-black text-cream-100">
              We're Preparing Your Cravings!
            </h1>

            <p className="text-xs sm:text-sm text-cream-200/80 max-w-lg mx-auto font-light leading-relaxed">
              Your order has been recorded in our kitchen management system. Our pastry chefs are crafting your desserts right now.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-2 text-xs">
                <span className="text-cream-300/60 mr-1.5">Order Number:</span>
                <strong className="text-caramel-400 font-mono text-sm">{order.orderNumber}</strong>
              </div>
              <div className="bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-2 text-xs">
                <span className="text-cream-300/60 mr-1.5">Estimated Time:</span>
                <strong className="text-cream-100 font-semibold">25–35 Mins</strong>
              </div>
              <div className="bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-2 text-xs flex items-center gap-1.5">
                <span className="text-cream-300/60 mr-1">Payment:</span>
                {order.paymentStatus === "PAID" ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    PAID (₹{order.total})
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold">
                    {order.paymentMethod === "CASH_ON_DELIVERY" ? "Cash on Delivery" : "Payment Pending"} (₹{order.total})
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/track-order?token=${order.trackingToken}`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-caramel-500 hover:bg-caramel-400 text-cocoa-950 font-bold uppercase tracking-wider text-xs shadow-xl shadow-caramel-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Track Live Order Status
              </Link>

              <a
                href={`https://wa.me/?text=${whatsappText}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-cocoa-950 border border-caramel-500/30 text-cream-200 hover:text-white hover:bg-cocoa-800 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5 text-caramel-400" />
                Share Copy on WhatsApp
              </a>
            </div>
          </div>

          {/* Order Details Breakdown */}
          <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-serif font-bold text-cream-100 border-b border-white/10 pb-4">
              Order Receipt & Snapshot
            </h2>

            {/* Destination Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-cream-200/80 pb-4 border-b border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold tracking-wider text-caramel-400">
                  Recipient
                </p>
                <p className="text-sm font-semibold text-cream-100">{order.customerName}</p>
                <p>{order.customerPhone}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold tracking-wider text-caramel-400">
                  Delivery Address
                </p>
                <p className="text-cream-100">{order.deliveryAddress}</p>
                {order.landmark && <p className="text-cream-300/60">Landmark: {order.landmark}</p>}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-caramel-400">
                Desserts Ordered
              </p>
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs py-2 border-b border-white/5"
                >
                  <div>
                    <span className="font-semibold text-cream-100">{item.productName}</span>
                    <span className="text-cream-300/60 ml-2">({item.customization})</span>
                    <span className="text-caramel-400 ml-2">× {item.quantity}</span>
                  </div>
                  <span className="font-bold text-cream-100">₹{item.lineTotal}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-xs text-cream-200 pt-2 border-t border-white/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-cream-100">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-semibold text-cream-100">
                  {order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-cream-100 pt-2 border-t border-white/10">
                <span>{order.paymentStatus === "PAID" ? "Total Paid Online" : "Amount Due on Delivery"}</span>
                <span className={order.paymentStatus === "PAID" ? "text-emerald-400 text-lg font-mono" : "text-caramel-400 text-lg font-mono"}>
                  ₹{order.total}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
