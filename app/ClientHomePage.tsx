"use client";

import React, { useState, useRef, useEffect } from "react";
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
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const menuSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const storedDeleted = localStorage.getItem("cravings_deleted_items");
      const deletedKeys: string[] = storedDeleted ? JSON.parse(storedDeleted) : [];
      const storedOverrides = localStorage.getItem("cravings_product_overrides");
      const overrides: Record<string, Product> = storedOverrides ? JSON.parse(storedOverrides) : {};

      const synced = initialProducts
        .filter((p) => !deletedKeys.includes(p.id) && !deletedKeys.includes(p.slug))
        .map((p) => {
          const override = overrides[p.id] || overrides[p.slug];
          return override ? { ...p, ...override } : p;
        });

      setProducts(synced);
    } catch {}
  }, [initialProducts]);

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
          products={products}
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
