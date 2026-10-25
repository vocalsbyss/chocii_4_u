"use client";

import React from "react";
import { Sparkles, Cake, Flame, Cookie, Apple } from "lucide-react";
import { Category } from "@/types";

interface CoolDockCategoryBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export default function CoolDockCategoryBar({
  categories,
  selectedCategory,
  onSelectCategory,
}: CoolDockCategoryBarProps) {
  // Category icon mapping
  const getCategoryIcon = (slug: string) => {
    switch (slug.toLowerCase()) {
      case "signature-cakes":
      case "cakes":
        return <Cake className="w-4 h-4 text-caramel-400" />;
      case "brownie-bowls":
      case "bowls":
        return <Flame className="w-4 h-4 text-amber-400" />;
      case "signature-classics":
      case "churros":
        return <Cookie className="w-4 h-4 text-caramel-300" />;
      case "chilled-specialities":
      case "fruizy":
        return <Apple className="w-4 h-4 text-rose-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-caramel-400" />;
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[94vw] sm:max-w-max pointer-events-auto">
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl sm:rounded-full bg-[#120a06]/90 backdrop-blur-2xl border border-caramel-500/35 shadow-2xl shadow-black/70 ring-1 ring-white/10">
        {/* All Items Button */}
        <button
          type="button"
          onClick={() => onSelectCategory("ALL")}
          className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-full text-xs font-bold transition-all ${
            selectedCategory === "ALL"
              ? "bg-caramel-500 text-cocoa-950 shadow-md scale-105"
              : "text-cream-200/80 hover:text-white hover:bg-white/10"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">All Cravings</span>
        </button>

        <div className="w-[1px] h-4 bg-white/15 mx-0.5" />

        {/* Dynamic Category Slots */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-full text-xs font-medium transition-all group ${
                isSelected
                  ? "bg-caramel-500 text-cocoa-950 font-bold shadow-md scale-105"
                  : "text-cream-200/75 hover:text-white hover:bg-white/10 hover:-translate-y-0.5"
              }`}
              title={cat.name}
            >
              <span className="shrink-0 group-hover:scale-115 transition-transform">
                {getCategoryIcon(cat.slug)}
              </span>
              <span className="whitespace-nowrap hidden sm:inline">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
