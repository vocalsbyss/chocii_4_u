"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ProductCard from "@/components/products/ProductCard";
import ProductModal from "@/components/ui/ProductModal";
import CartDrawer from "@/components/ui/CartDrawer";
import { ArrowLeft, Sparkles, Filter } from "lucide-react";
import { Product, Category } from "@/types";

interface ClientCollectionPageProps {
  category: { id: string; name: string; slug: string };
  products: Product[];
  allCategories: Category[];
}

export default function ClientCollectionPage({
  category,
  products,
  allCategories,
}: ClientCollectionPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cocoa-950 text-cream-100 flex flex-col font-sans">
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-cream-300/60">
            <Link href="/" className="hover:text-caramel-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/menu" className="hover:text-caramel-400 transition-colors">
              Menu
            </Link>
            <span>/</span>
            <span className="text-caramel-400 font-bold">{category.name}</span>
          </div>

          {/* Header Banner */}
          <div className="border-b border-white/10 pb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-caramel-500/10 border border-caramel-500/30 text-caramel-400 text-[11px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              Artisanal Collection
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-black text-cream-100 tracking-tight">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-cream-200/80 font-light max-w-2xl leading-relaxed">
              Carefully prepared in our Visakhapatnam kitchen using quality chocolate, cocoa, and dairy ingredients.
            </p>
          </div>

          {/* Collection Category Switcher Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Link
              href="/menu"
              className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-cream-200/80 shrink-0 border border-white/10"
            >
              All Categories
            </Link>
            {allCategories.map((cat) => {
              const isCurrent = cat.slug === category.slug;
              return (
                <Link
                  key={cat.id}
                  href={`/collections/${cat.slug}`}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 transition-all ${
                    isCurrent
                      ? "bg-caramel-500 text-cocoa-950 font-bold shadow-md shadow-caramel-500/20"
                      : "bg-white/5 hover:bg-white/10 text-cream-200/80 border border-white/10"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="py-20 text-center space-y-4 max-w-md mx-auto">
              <p className="text-cream-200/70 text-sm">
                No active desserts currently listed in this collection.
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-caramel-500 text-cocoa-950 font-bold uppercase tracking-wider text-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Desserts
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
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

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

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
