"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { ShoppingBag, ArrowRight, Clock, RefreshCw, AlertCircle } from "lucide-react";
import { Order } from "@/types";

export default function CustomerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check auth first
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((authData) => {
        if (!authData.authenticated) {
          router.push("/sign-in?redirect=/orders");
          return;
        }

        // Fetch customer orders
        return fetch("/api/orders")
          .then((res) => res.json())
          .then((ordersData) => {
            if (ordersData.success && ordersData.orders) {
              setOrders(ordersData.orders);
            }
          });
      })
      .catch((err) => {
        setError("Failed to load your orders.");
      })
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen bg-cocoa-950 text-cream-100 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="border-b border-white/10 pb-6">
            <span className="text-xs uppercase tracking-widest text-caramel-400 font-bold">
              Account History
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-cream-100 mt-1">
              Your Past Cravings
            </h1>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-caramel-400 animate-spin mx-auto" />
              <p className="text-sm font-medium">Loading your orders...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-strawberry-500/15 border border-strawberry-500/40 text-strawberry-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-cocoa-900 border border-caramel-500/20 flex items-center justify-center text-caramel-400 mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-cream-100">No past orders found</h3>
              <p className="text-xs text-cream-200/70">
                You haven't ordered from chocii 4 u yet. Explore our signature creations!
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-caramel-500 text-cocoa-950 font-bold uppercase tracking-wider text-xs hover:bg-caramel-400 transition-all shadow-lg"
              >
                Browse Desserts Menu
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4 transition-all hover:border-caramel-500/40"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-caramel-400">
                        Order #{order.orderNumber}
                      </span>
                      <p className="text-xs text-cream-300/60 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-caramel-500/15 text-caramel-300 border border-caramel-500/30">
                        {order.fulfillmentStatus.replace(/_/g, " ")}
                      </span>
                      <span className="text-lg font-bold text-cream-100">
                        ₹{order.total}
                      </span>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="space-y-1 text-xs text-cream-200/80">
                    {order.items?.map((it) => (
                      <div key={it.id} className="flex justify-between py-0.5">
                        <span>
                          {it.productName} ({it.customization}) × {it.quantity}
                        </span>
                        <span className="text-cream-100 font-semibold">₹{it.lineTotal}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Links */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-xs font-bold text-cream-100 hover:text-caramel-400 underline underline-offset-4"
                    >
                      View Order Details
                    </Link>

                    <Link
                      href={`/track-order?token=${order.trackingToken}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-caramel-400 hover:text-caramel-300 uppercase tracking-wider"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Track Status
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
