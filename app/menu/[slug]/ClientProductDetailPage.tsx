"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import CartDrawer from "@/components/ui/CartDrawer";
import FloatingChocolateCanvas from "@/components/3d/FloatingChocolateCanvas";
import { ArrowLeft, Check, Plus, Minus, ShoppingBag, Sparkles, Box } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { Product, ProductAddon, CartItemOption } from "@/types";

export default function ClientProductDetailPage({ product }: { product: Product }) {
  const [customization, setCustomization] = useState<"CLASSIC" | "BALANCED">("CLASSIC");
  const [selectedAddons, setSelectedAddons] = useState<CartItemOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"3D" | "PHOTO">("3D");

  const getSlideIdForSlug = (slug: string) => {
    if (slug.includes("cake") && !slug.includes("can")) return 1;
    if (slug.includes("bowl")) return 2;
    if (slug.includes("churros")) return 3;
    if (slug.includes("can")) return 4;
    if (slug.includes("fruizy")) return 5;
    return 1;
  };

  const slideId = getSlideIdForSlug(product.slug);

  const basePrice =
    product.salePrice && product.salePrice > 0 ? product.salePrice : product.basePrice;
  const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const unitPrice = basePrice + addonsTotal;
  const lineTotal = unitPrice * quantity;

  const toggleAddon = (addon: ProductAddon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, { id: addon.id, name: addon.name, price: addon.price }];
      }
    });
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      unitPrice,
      quantity,
      customization,
      selectedAddons,
      specialInstructions: specialInstructions.trim() || undefined,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsCartOpen(true);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-white text-cocoa-950 flex flex-col font-sans">
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb Back */}
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs font-semibold text-cocoa-900/70 hover:text-caramel-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Desserts
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left: Product 3D Stage & Photo Switcher */}
            <div className="lg:col-span-6 relative space-y-3">
              {/* View Switcher Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("3D")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    viewMode === "3D"
                      ? "bg-cocoa-950 text-white shadow-md shadow-cocoa-950/15"
                      : "bg-white text-cocoa-900 border border-stone-200 hover:bg-caramel-50"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-caramel-400" />
                  <span>3D Atelier View (Bars & Chips)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("PHOTO")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    viewMode === "PHOTO"
                      ? "bg-cocoa-950 text-white shadow-md shadow-cocoa-950/15"
                      : "bg-white text-cocoa-900 border border-stone-200 hover:bg-caramel-50"
                  }`}
                >
                  <span>Studio Photo</span>
                </button>
              </div>

              {/* Viewport: 3D Scene or Studio Photo */}
              {viewMode === "3D" ? (
                <div className="relative h-[460px] sm:h-[560px] lg:h-[600px] w-full rounded-3xl overflow-hidden border-2 border-stone-200 bg-white shadow-2xl flex items-center justify-center">
                  <FloatingChocolateCanvas
                    slideId={slideId}
                    className="h-full w-full"
                    cameraPosition={[0, 0.2, 5.8]}
                    badgeText="Live 3D • Grand Pouring, Splashing Bar & Chips"
                  />
                  <div className="absolute top-4 left-4 z-10 pointer-events-none">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-caramel-700 bg-white/95 px-3 py-1 rounded-full border border-stone-200 shadow-sm">
                      {product.category?.name || "Signature Dessert"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative h-[460px] sm:h-[560px] lg:h-[600px] w-full rounded-3xl overflow-hidden border-2 border-stone-200 bg-white shadow-xl">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cocoa-950/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white bg-cocoa-950/90 px-3 py-1 rounded-full border border-caramel-500/30">
                      {product.category?.name || "Signature Dessert"}
                    </span>
                  </div>
                </div>
              )}

              {/* Feature Highlights beneath 3D viewport */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2.5 rounded-2xl bg-white border border-stone-200 text-[10px] font-semibold text-cocoa-950 shadow-sm">
                  🌊 Grand Spiral Pouring
                </div>
                <div className="p-2.5 rounded-2xl bg-white border border-stone-200 text-[10px] font-semibold text-cocoa-950 shadow-sm">
                  🍫 Bar with Splash Crown
                </div>
                <div className="p-2.5 rounded-2xl bg-white border border-stone-200 text-[10px] font-semibold text-cocoa-950 shadow-sm">
                  🌰 Cascading Choco Chips
                </div>
              </div>
            </div>

            {/* Right: Customization Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-caramel-700 font-bold mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-caramel-600" />
                  ( need amazing desserts ) • Dessert Atelier
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans uppercase tracking-tight text-cocoa-950 leading-[0.95]">
                  <span className="block">{product.name.split(" ")[0]}</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cocoa-950 via-caramel-600 to-caramel-500 italic font-serif lowercase">
                    {product.name.split(" ").slice(1).join(" ") || "signature"}
                  </span>
                </h1>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-2xl font-bold text-caramel-600">
                    ₹{basePrice}
                  </span>
                  {product.salePrice && product.salePrice > 0 && (
                    <span className="text-sm text-cocoa-950/40 line-through">
                      ₹{product.basePrice}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-cocoa-900/80 font-normal leading-relaxed">
                {product.description}
              </p>

              {product.preparationInfo && (
                <div className="bg-white border border-stone-200 rounded-2xl p-3.5 text-xs text-cocoa-900 flex items-center gap-2.5 shadow-sm">
                  <Sparkles className="w-4 h-4 text-caramel-600 shrink-0" />
                  <span>{product.preparationInfo}</span>
                </div>
              )}

              {/* Customization: Classic vs Balanced */}
              <div className="space-y-2.5 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-cocoa-950">
                  Select Customization Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCustomization("CLASSIC")}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      customization === "CLASSIC"
                        ? "border-caramel-600 bg-caramel-50/80 ring-1 ring-caramel-500 shadow-sm"
                        : "border-stone-200 bg-white text-cocoa-900 hover:border-caramel-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cocoa-950">CLASSIC</span>
                      {customization === "CLASSIC" && (
                        <Check className="w-4 h-4 text-caramel-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-cocoa-900/70 mt-1">
                      Traditional chef balance of intense sweetness and dark chocolate.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomization("BALANCED")}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      customization === "BALANCED"
                        ? "border-caramel-600 bg-caramel-50/80 ring-1 ring-caramel-500 shadow-sm"
                        : "border-stone-200 bg-white text-cocoa-900 hover:border-caramel-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cocoa-950">BALANCED</span>
                      {customization === "BALANCED" && (
                        <Check className="w-4 h-4 text-caramel-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-cocoa-900/70 mt-1">
                      Emphasizes roasted cocoa beans and lower sweetness notes.
                    </p>
                  </button>
                </div>
              </div>

              {/* Addons */}
              {product.addons && product.addons.length > 0 && (
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-cocoa-950">
                    Add-ons & Gourmet Extras
                  </label>
                  <div className="space-y-2">
                    {product.addons.map((addon) => {
                      const isSelected = selectedAddons.some((a) => a.id === addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? "border-caramel-600 bg-caramel-50/80 text-cocoa-950 shadow-sm"
                              : "border-stone-200 bg-white text-cocoa-900 hover:border-caramel-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "bg-caramel-600 border-caramel-600 text-white"
                                  : "border-stone-200 bg-white"
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-medium">{addon.name}</span>
                          </div>
                          <span className="text-xs font-semibold text-caramel-600">
                            +₹{addon.price}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-cocoa-950">
                  Kitchen Notes / Packaging Request
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extra cutlery, warm sauce packed separately..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  maxLength={150}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-cocoa-950 placeholder:text-cocoa-950/40 focus:outline-none focus:border-caramel-500 shadow-sm"
                />
              </div>

              {/* Quantity and Add to Cart Row */}
              <div className="pt-4 flex items-center justify-between gap-4 border-t border-stone-200">
                <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-2xl px-3.5 py-2.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 rounded-lg text-cocoa-950 hover:text-caramel-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold w-6 text-center text-cocoa-950">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 rounded-lg text-cocoa-950 hover:text-caramel-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isSuccess || !product.isAvailable}
                  className={`flex-1 py-4 px-6 rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-xl ${
                    isSuccess
                      ? "bg-emerald-600 text-white"
                      : "bg-cocoa-950 hover:bg-cocoa-900 text-white shadow-cocoa-950/20 active:scale-98"
                  }`}
                >
                  {isSuccess ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-caramel-400" />
                      Add to Cart • ₹{lineTotal}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Footer />
    </div>
  );
}
