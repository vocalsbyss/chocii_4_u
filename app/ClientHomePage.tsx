"use client";

import React, { useState, useRef } from "react";
import Navbar from "@/components/ui/Navbar";
import ArtisticParallaxSlider from "@/components/sections/ArtisticParallaxSlider";
import CartDrawer from "@/components/ui/CartDrawer";
import ProductModal from "@/components/ui/ProductModal";
import Footer from "@/components/ui/Footer";
import { Product } from "@/types";

export default function ClientHomePage({
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
      {/* Sticky Navigation */}
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-grow">
        {/* Pages 1 (Hero), 2 (4-Item Menu), 3 (Reference Image Menu), 4 (Feedback) */}
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
