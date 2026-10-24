"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, ArrowLeft } from "lucide-react";
import {
  getStoredCart,
  updateCartQuantity,
  removeFromCart,
  calculateCartSummary,
  clearCart,
} from "@/lib/cart";
import { CartItem } from "@/types";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setCart(getStoredCart());
    sync();
    window.addEventListener("cravings_cart_updated", sync);
    return () => window.removeEventListener("cravings_cart_updated", sync);
  }, []);

  const summary = calculateCartSummary(cart);

  return (
    <div className="min-h-screen bg-cocoa-950 text-cream-100 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-caramel-400 font-bold">
                Order Review
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-cream-100 mt-1">
                Your Craving Cart
              </h1>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-strawberry-400 hover:text-strawberry-300 font-semibold self-start sm:self-auto flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Cart
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="py-20 text-center space-y-4 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-cocoa-900 border border-caramel-500/20 flex items-center justify-center text-caramel-400 mx-auto">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-serif font-bold text-cream-100">Your cart is empty</h2>
              <p className="text-xs text-cream-200/70">
                You haven't added any sweet treats yet. Explore our five signature creations!
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Cart Items */}
              <div className="lg:col-span-7 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-4 sm:p-5 flex gap-4 transition-all hover:border-caramel-500/40"
                  >
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-serif font-bold text-cream-100 truncate">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-cream-300/40 hover:text-strawberry-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-caramel-500/20 text-caramel-300 border border-caramel-500/30">
                            {item.customization}
                          </span>
                          {item.selectedAddons.map((addon) => (
                            <span
                              key={addon.id}
                              className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-cream-200/80"
                            >
                              +{addon.name} (₹{addon.price})
                            </span>
                          ))}
                        </div>

                        {item.specialInstructions && (
                          <p className="text-[11px] text-cream-300/60 italic mt-1.5 truncate">
                            Note: {item.specialInstructions}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                        <span className="text-base font-bold text-cream-100">
                          ₹{item.lineTotal}
                        </span>

                        <div className="flex items-center gap-3 bg-cocoa-950 border border-white/10 rounded-xl px-2.5 py-1">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.cartItemId, item.quantity - 1)
                            }
                            className="text-cream-200 hover:text-caramel-400 transition-colors p-0.5"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-semibold px-1 text-cream-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.cartItemId, item.quantity + 1)
                            }
                            className="text-cream-200 hover:text-caramel-400 transition-colors p-0.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-caramel-400 hover:underline pt-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Add more desserts from menu
                </Link>
              </div>

              {/* Right: Summary Card */}
              <div className="lg:col-span-5 bg-cocoa-900/80 border border-caramel-500/30 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-md">
                <h3 className="text-lg font-serif font-bold text-cream-100">
                  Bill Summary
                </h3>

                {/* Free Delivery Goal */}
                <div className="p-3.5 rounded-2xl bg-cocoa-950/60 border border-caramel-500/20 space-y-2">
                  {summary.isFreeDelivery ? (
                    <div className="flex items-center gap-2 text-xs text-caramel-400 font-semibold">
                      <Sparkles className="w-4 h-4 text-caramel-400 shrink-0" />
                      <span>Free Delivery Unlocked! 🚀</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-xs text-cream-200">
                        <span>
                          Add <strong className="text-caramel-400">₹{summary.amountNeededForFreeDelivery}</strong> for <strong>Free Delivery</strong>
                        </span>
                        <span>₹{summary.subtotal} / ₹599</span>
                      </div>
                      <div className="w-full bg-cocoa-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-caramel-400 h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (summary.subtotal / 599) * 100)}%`,
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-2.5 text-xs text-cream-200/90">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-cream-100">₹{summary.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="font-semibold text-cream-100">
                      {summary.deliveryFee === 0 ? (
                        <span className="text-emerald-400">FREE</span>
                      ) : (
                        `₹${summary.deliveryFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-cream-100 pt-3 border-t border-white/10">
                    <span>Grand Total</span>
                    <span className="text-caramel-400 text-lg">₹{summary.grandTotal}</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-400 hover:to-caramel-500 text-cocoa-950 font-bold uppercase tracking-wider text-xs shadow-xl shadow-caramel-500/25 transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
