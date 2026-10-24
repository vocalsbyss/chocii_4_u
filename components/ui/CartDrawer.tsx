"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import {
  getStoredCart,
  updateCartQuantity,
  removeFromCart,
  calculateCartSummary,
} from "@/lib/cart";
import { CartItem } from "@/types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const syncCart = () => {
      setCart(getStoredCart());
    };
    syncCart();
    window.addEventListener("cravings_cart_updated", syncCart);
    return () => window.removeEventListener("cravings_cart_updated", syncCart);
  }, [isOpen]);

  if (!isOpen) return null;

  const summary = calculateCartSummary(cart);

  const handleCheckoutClick = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#EADCCE] text-cocoa-950 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#EADCCE] flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-caramel-600" />
              <h2 className="text-lg font-serif font-bold text-cocoa-950">
                Your Craving Cart ({summary.totalItemCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-cocoa-950/10 text-cocoa-900 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Goal Banner */}
          {cart.length > 0 && (
            <div className="bg-caramel-50 border-b border-caramel-200/60 px-5 py-3">
              {summary.isFreeDelivery ? (
                <div className="flex items-center gap-2 text-xs text-caramel-700 font-semibold">
                  <Sparkles className="w-4 h-4 text-caramel-600 shrink-0" />
                  <span>Congratulations! You qualify for Free Delivery 🚀</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-cocoa-900">
                    <span>
                      Add <strong className="text-caramel-700">₹{summary.amountNeededForFreeDelivery}</strong> more for <strong>FREE Delivery</strong>
                    </span>
                    <span>₹{summary.subtotal} / ₹599</span>
                  </div>
                  <div className="w-full bg-caramel-200/50 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-caramel-500 h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (summary.subtotal / 599) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#EADCCE] flex items-center justify-center text-caramel-600 shadow-sm">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-cocoa-950">Your cart is empty</h3>
                  <p className="text-xs text-cocoa-800/60 mt-1 max-w-xs">
                    Satisfy your sweet tooth with our signature Dream Cakes, brownie bowls, and churros.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    router.push("/menu");
                  }}
                  className="px-5 py-2.5 rounded-full bg-cocoa-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-caramel-500 hover:text-cocoa-950 transition-all shadow-md"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-[#FAF7F2] border border-[#EADCCE] rounded-2xl p-3.5 flex gap-3.5 transition-all hover:border-caramel-400 shadow-sm"
                >
                  {/* Item Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#EADCCE]">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-cocoa-950 truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-cocoa-900/40 hover:text-strawberry-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Customization Badge */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-md bg-caramel-100 text-caramel-800 border border-caramel-200">
                          {item.customization}
                        </span>
                        {item.selectedAddons.map((addon) => (
                          <span
                            key={addon.id}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-white text-cocoa-900/80 border border-[#EADCCE]"
                          >
                            +{addon.name} (₹{addon.price})
                          </span>
                        ))}
                      </div>

                      {item.specialInstructions && (
                        <p className="text-[11px] text-cocoa-800/60 italic mt-1 truncate">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </div>

                    {/* Price and Quantity Controls */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#EADCCE]/50">
                      <span className="text-sm font-bold text-cocoa-950">
                        ₹{item.lineTotal}
                      </span>

                      <div className="flex items-center gap-2 bg-white border border-[#EADCCE] rounded-lg px-2 py-0.5">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.cartItemId, item.quantity - 1)
                          }
                          className="text-cocoa-900 hover:text-caramel-600 p-0.5 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-1 text-cocoa-950">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.cartItemId, item.quantity + 1)
                          }
                          className="text-cocoa-900 hover:text-caramel-600 p-0.5 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-5 pb-safe border-t border-[#EADCCE] bg-[#FAF7F2] space-y-3">
              <div className="space-y-1.5 text-xs text-cocoa-900">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-cocoa-950">₹{summary.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-cocoa-950">
                    {summary.deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${summary.deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-cocoa-950 pt-2 border-t border-[#EADCCE]">
                  <span>Total Payable</span>
                  <span className="text-cocoa-950 text-base font-black">₹{summary.grandTotal}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 rounded-xl bg-cocoa-950 hover:bg-caramel-500 text-white hover:text-cocoa-950 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-xl shadow-cocoa-950/20 transition-all active:scale-98"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
