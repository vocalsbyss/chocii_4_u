"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import CoolDockScrollShowcase from "@/components/sections/CoolDockScrollShowcase";
import ArtisticParallaxSlider from "@/components/sections/ArtisticParallaxSlider";
import CartDrawer from "@/components/ui/CartDrawer";
import ProductModal from "@/components/ui/ProductModal";
import Footer from "@/components/ui/Footer";
import { Product } from "@/types";
import { Sparkles, ArrowLeft, Check, Undo2, ExternalLink } from "lucide-react";

export default function PreviewClientPage({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const menuSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToMenu = () => {
    menuSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-cocoa-950 flex flex-col selection:bg-caramel-500 selection:text-white">
      {/* Top Floating Preview Control Bar */}
      <div className="sticky top-0 z-50 bg-cocoa-950/95 border-b border-caramel-500/30 text-cream-100 backdrop-blur-md px-4 py-2.5 text-xs shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-caramel-400 animate-ping" />
            <span className="font-bold text-caramel-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Preview Mode:
            </span>
            <span className="text-cream-200">
              CoolDock-Style GPU Scroll Transition Demo
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-cream-300/60 hidden md:inline">
              Your live homepage remains unchanged. Like it or undo it anytime!
            </span>
            <Link
              href="/"
              className="px-3 py-1 rounded-xl bg-cocoa-900 hover:bg-cocoa-800 border border-white/10 text-cream-200 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Standard Homepage
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-grow">
        {/* 1. CoolDock-Inspired Interactive Scroll Showcase */}
        <CoolDockScrollShowcase
          products={initialProducts}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onExploreMenu={handleScrollToMenu}
        />

        {/* 2. Full Menu Catalog, Customization & Reviews */}
        <ArtisticParallaxSlider
          onExploreClick={handleScrollToMenu}
          products={initialProducts}
          onSelectProduct={(p) => setSelectedProduct(p)}
          menuSectionRef={menuSectionRef}
        />
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Product Customization Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddedToCart={() => setIsCartOpen(true)}
      />

      {/* Luxury Footer */}
      <Footer />
    </div>
  );
}
