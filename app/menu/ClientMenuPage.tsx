"use client";

import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ProductCard from "@/components/products/ProductCard";
import ProductModal from "@/components/ui/ProductModal";
import CartDrawer from "@/components/ui/CartDrawer";
import FloatingChocolateCanvas from "@/components/3d/FloatingChocolateCanvas";
import { Search, Sparkles } from "lucide-react";
import { Product, Category } from "@/types";

export default function ClientMenuPage({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filter products by category and search query
  const filteredProducts = initialProducts.filter((p) => {
    const matchesCategory =
      selectedCategory === "ALL" || p.category?.slug === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-cocoa-950 flex flex-col font-sans">
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header Banner with 3D Chocolate Floating Atelier */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-8 sm:p-10 shadow-sm relative overflow-hidden">
            {/* Low-Opacity Watermark Brand Logo */}
            <div className="absolute top-1/2 left-1/2 sm:left-1/4 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[500px] max-w-[80vw] aspect-[857/543] pointer-events-none select-none z-0 opacity-12 sm:opacity-15">
              <Image
                src="/images/chocii-logo.png"
                alt="chocii 4 u logo watermark"
                fill
                sizes="(max-width: 640px) 340px, 500px"
                className="object-contain"
                priority
              />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-3">
                <span className="text-xs uppercase tracking-[0.25em] text-caramel-700 font-bold flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-caramel-600" />
                  ( need amazing desserts ) • Direct Cloud Kitchen Menu
                </span>
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-sans tracking-tighter text-cocoa-950 uppercase leading-[0.92] drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]">
                  <span className="block drop-shadow-[0_1px_8px_rgba(255,255,255,0.9)]">DESSERTS TO</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cocoa-950 via-caramel-700 to-cocoa-950 italic font-serif lowercase my-1 drop-shadow-[0_2px_8px_rgba(255,255,255,0.85)]">
                    truly
                  </span>
                  <span className="block drop-shadow-[0_1px_8px_rgba(255,255,255,0.9)]">OBSESS OVER</span>
                </h1>
                <p className="text-xs sm:text-sm text-cocoa-950 font-medium leading-relaxed max-w-xl">
                  Explore our tempting collection of chocolate treats, layered cakes, churros, and dessert creations. Find your favourite and place your order.
                </p>
              </div>

              {/* 3D Floating Chocolate Canvas */}
              <div className="lg:col-span-5 h-[280px] sm:h-[340px] rounded-2xl overflow-hidden relative border-2 border-stone-200 bg-white shadow-xl">
                <FloatingChocolateCanvas
                  variant="ambient"
                  className="h-full w-full"
                  cameraPosition={[0, 0.2, 5.8]}
                  badgeText="Live 3D • Grand Spiral Pouring & Splashing Bar"
                />
              </div>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="space-y-4">
            {/* Search Input */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cocoa-950/40" />
              <input
                type="text"
                placeholder="Search dream cakes, bowls, churros..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-full pl-11 pr-4 py-3 text-xs text-cocoa-950 placeholder:text-cocoa-950/40 focus:outline-none focus:border-caramel-500 shadow-sm"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setSelectedCategory("ALL")}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  selectedCategory === "ALL"
                    ? "bg-cocoa-950 text-white shadow-md shadow-cocoa-950/15"
                    : "bg-white text-cocoa-900 hover:bg-caramel-50 border border-stone-200 shadow-sm"
                }`}
              >
                All Desserts ({initialProducts.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    selectedCategory === cat.slug
                      ? "bg-cocoa-950 text-white shadow-md shadow-cocoa-950/15"
                      : "bg-white text-cocoa-900 hover:bg-caramel-50 border border-stone-200 shadow-sm"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
              <p className="text-base text-cocoa-950 font-medium">
                No desserts matched your search query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("ALL");
                  setSearchQuery("");
                }}
                className="text-xs text-caramel-700 underline font-semibold"
              >
                Clear filters & show all desserts
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Product Customizer Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddedToCart={() => setIsCartOpen(true)}
      />

      <Footer />
    </div>
  );
}
