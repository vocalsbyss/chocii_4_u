"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Sparkles, Check } from "lucide-react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Mild 3D tilt effect
    setRotX((-y / rect.height) * 12);
    setRotY((x / rect.width) * 12);
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
  };

  const isSoldOut = !product.isAvailable;
  const currentPrice =
    product.salePrice && product.salePrice > 0
      ? product.salePrice
      : product.basePrice;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      className="group relative bg-white hover:bg-[#FFFDF9] border border-[#EADCCE] hover:border-caramel-400/80 rounded-3xl overflow-hidden flex flex-col justify-between shadow-[0_4px_20px_rgba(36,19,15,0.04)] hover:shadow-[0_12px_32px_rgba(36,19,15,0.08)] transition-all duration-300"
    >
      {/* Top Image Section */}
      <div>
        <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-[#F5EFEB]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={Boolean(product.imageUrl?.startsWith("data:"))}
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cocoa-950/70 via-transparent to-transparent" />

          {/* Featured / Sold out Badges */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
            {product.isFeatured && (
              <span className="bg-caramel-500 text-cocoa-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Signature
              </span>
            )}
            {isSoldOut && (
              <span className="bg-strawberry-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                Sold Out
              </span>
            )}
          </div>

          {/* Category Tag */}
          <div className="absolute bottom-3 left-4">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-cocoa-950 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-[#EADCCE]">
              {product.category?.name || "Artisanal Dessert"}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-5 sm:p-6 space-y-3">
          <Link href={`/menu/${product.slug}`} className="block">
            <h3 className="text-xl font-serif font-black text-cocoa-950 group-hover:text-caramel-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-cocoa-800/70 line-clamp-2 font-normal leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Price & Add to Cart Action */}
      <div className="p-5 sm:p-6 pt-0 flex items-center justify-between border-t border-[#EADCCE]/60 mt-2">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-cocoa-950">₹{currentPrice}</span>
          {product.salePrice && product.salePrice > 0 && (
            <span className="text-xs text-cocoa-900/40 line-through">
              ₹{product.basePrice}
            </span>
          )}
        </div>

        <button
          onClick={() => onSelect(product)}
          disabled={isSoldOut}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md ${
            isSoldOut
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-cocoa-950 hover:bg-caramel-500 text-white hover:text-cocoa-950 active:scale-95 shadow-cocoa-950/15"
          }`}
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          {isSoldOut ? "Unavailable" : "Customize"}
        </button>
      </div>
    </div>
  );
}
