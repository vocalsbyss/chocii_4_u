"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Plus, Minus, Check, Sparkles, ShoppingBag } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { Product, ProductAddon, CartItemOption } from "@/types";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddedToCart?: () => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onAddedToCart,
}: ProductModalProps) {
  const [customization, setCustomization] = useState<"CLASSIC" | "BALANCED">(
    "CLASSIC"
  );
  const [selectedAddons, setSelectedAddons] = useState<CartItemOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const basePrice =
    product.salePrice && product.salePrice > 0
      ? product.salePrice
      : product.basePrice;

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
      onClose();
      if (onAddedToCart) onAddedToCart();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-white border border-[#EADCCE] rounded-3xl text-cocoa-950 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-cocoa-950 flex items-center justify-center border border-[#EADCCE] transition-colors shadow-sm"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Product Header & Image (Clean photo without text overlay) */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#F5EFEB]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
              unoptimized={Boolean(product.imageUrl?.startsWith("data:"))}
            />
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] uppercase tracking-wider text-caramel-600 font-bold">
                  {product.category?.name || "Artisanal Dessert"}
                </span>
                {product.isFeatured && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-caramel-700 bg-caramel-500/15 px-2.5 py-0.5 rounded-full border border-caramel-500/30">
                    <Sparkles className="w-3 h-3 text-caramel-600" /> Signature
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-cocoa-950 mt-1">
                {product.name}
              </h2>
            </div>
            <p className="text-sm text-cocoa-900/80 leading-relaxed font-normal">
              {product.description}
            </p>

            {product.preparationInfo && (
              <div className="bg-caramel-50 border border-caramel-200/60 rounded-xl p-3 text-xs text-cocoa-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-caramel-600 shrink-0" />
                <span>{product.preparationInfo}</span>
              </div>
            )}

            {/* Customization Options: Classic vs Balanced */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-caramel-700">
                Choose Experience Style
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCustomization("CLASSIC")}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    customization === "CLASSIC"
                      ? "border-caramel-500 bg-caramel-50 ring-1 ring-caramel-500"
                      : "border-[#EADCCE] bg-[#FAF7F2] hover:border-caramel-400/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cocoa-950">CLASSIC</span>
                    {customization === "CLASSIC" && (
                      <Check className="w-4 h-4 text-caramel-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-cocoa-800/70 mt-1 leading-normal">
                    The standard chef recipe with full decadent sweetness & cocoa intensity.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setCustomization("BALANCED")}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    customization === "BALANCED"
                      ? "border-caramel-500 bg-caramel-50 ring-1 ring-caramel-500"
                      : "border-[#EADCCE] bg-[#FAF7F2] hover:border-caramel-400/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cocoa-950">BALANCED</span>
                    {customization === "BALANCED" && (
                      <Check className="w-4 h-4 text-caramel-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-cocoa-800/70 mt-1 leading-normal">
                    An alternative ratio emphasizing deeper bitter-cocoa notes over sweetness.
                  </p>
                </button>
              </div>
            </div>

            {/* Paid Add-ons */}
            {product.addons && product.addons.length > 0 && (
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-caramel-700">
                  Elevate Your Dessert (Optional Add-ons)
                </label>
                <div className="space-y-2">
                  {product.addons.map((addon) => {
                    const isSelected = selectedAddons.some((a) => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "border-caramel-500 bg-caramel-50 text-cocoa-950"
                            : "border-[#EADCCE] bg-[#FAF7F2] text-cocoa-900/80 hover:border-caramel-400/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              isSelected
                                ? "bg-caramel-500 border-caramel-500 text-white"
                                : "border-[#EADCCE] bg-white"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-medium">{addon.name}</span>
                        </div>
                        <span className="text-xs font-bold text-caramel-700">
                          +₹{addon.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Kitchen Instructions */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-caramel-700">
                Special Kitchen Note
              </label>
              <input
                type="text"
                placeholder="e.g. Extra napkins, cutlery, sauces packed separately..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                maxLength={150}
                className="w-full bg-[#FAF7F2] border border-[#EADCCE] rounded-xl px-3.5 py-2.5 text-xs text-cocoa-950 placeholder:text-cocoa-900/40 focus:outline-none focus:border-caramel-500"
              />
            </div>

            {/* Quantity and Add to Cart Row */}
            <div className="pt-2 flex items-center justify-between gap-4 border-t border-[#EADCCE]">
              <div className="flex items-center gap-3 bg-[#FAF7F2] border border-[#EADCCE] rounded-2xl px-3 py-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 rounded-lg text-cocoa-900 hover:text-caramel-600 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold w-6 text-center text-cocoa-950">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 rounded-lg text-cocoa-900 hover:text-caramel-600 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSuccess}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-xl ${
                  isSuccess
                    ? "bg-emerald-600 text-white"
                    : "bg-cocoa-950 hover:bg-caramel-500 text-white hover:text-cocoa-950 shadow-cocoa-950/20 active:scale-98"
                }`}
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart • ₹{lineTotal}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
