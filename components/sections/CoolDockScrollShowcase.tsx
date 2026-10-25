"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Flame,
  ArrowRight,
  Heart,
  Star,
  Plus,
  Clock,
  CheckCircle2,
  Sliders,
  ChevronDown,
} from "lucide-react";
import { Product } from "@/types";

interface CoolDockScrollShowcaseProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onExploreMenu?: () => void;
}

export default function CoolDockScrollShowcase({
  products,
  onSelectProduct,
  onExploreMenu,
}: CoolDockScrollShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Showcase featured items (Take top 4 or fallback)
  const featured = products.slice(0, 4);

  // CoolDock Normalized Scroll Engine
  useEffect(() => {
    const container = containerRef.current;
    const scrollArea = scrollAreaRef.current;
    if (!container || !scrollArea) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || typeof window.requestAnimationFrame !== "function") {
      container.style.setProperty("--cd-wall-scale", "1");
      container.style.setProperty("--cd-wall-translate", "0px");
      container.style.setProperty("--cd-wall-opacity", "1");
      container.style.setProperty("--cd-dock-scale", "1");
      container.style.setProperty("--cd-dock-translate", "0px");
      return;
    }

    let isTicking = false;

    const clamp = (val: number, min = 0, max = 1) =>
      Math.min(Math.max(val, min), max);

    const updateScrollMetrics = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate progress factor from 0.0 to 1.0 as the container enters and leaves viewport
      const totalDist = Math.max(container.offsetHeight - viewportHeight, 1);
      const scrollProgress = clamp(-rect.top / totalDist);

      // Phase 1: Floating convergence (0.0 to 0.70)
      const phase1 = clamp(scrollProgress / 0.7);
      // Phase 2: Dock locking and settle (0.70 to 1.0)
      const phase2 = clamp((scrollProgress - 0.7) / 0.3);

      // Calculate transforms using CoolDock normalized interpolation curves
      const wallScale = phase2 > 0 ? 1 : 1.6 - 0.6 * phase1;
      const wallTranslate = phase2 > 0 ? 0 : 360 * (1 - phase1);
      const wallOpacity = phase1 < 0.15 ? phase1 / 0.15 : 1;

      const dockScale = 0.95 + 0.05 * phase2;
      const dockTranslate = phase2 > 0 ? 0 : 50 * (1 - phase2);
      const dockGlow = phase2;

      // Pass directly to GPU-accelerated CSS variables
      container.style.setProperty("--cd-wall-scale", wallScale.toFixed(4));
      container.style.setProperty("--cd-wall-translate", `${wallTranslate.toFixed(2)}px`);
      container.style.setProperty("--cd-wall-opacity", wallOpacity.toFixed(4));
      container.style.setProperty("--cd-dock-scale", dockScale.toFixed(4));
      container.style.setProperty("--cd-dock-translate", `${dockTranslate.toFixed(2)}px`);
      container.style.setProperty("--cd-dock-glow", dockGlow.toFixed(4));

      isTicking = false;
    };

    const onScroll = () => {
      if (!isTicking) {
        isTicking = true;
        window.requestAnimationFrame(updateScrollMetrics);
      }
    };

    // Attach scroll and resize listeners only when intersecting viewport
    let isAttached = false;
    const attach = () => {
      if (!isAttached) {
        isAttached = true;
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        onScroll();
      }
    };

    const detach = () => {
      if (isAttached) {
        isAttached = false;
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            attach();
          } else {
            detach();
          }
        });
      },
      { rootMargin: "100px 0px" }
    );

    observer.observe(container);
    onScroll();

    return () => {
      observer.disconnect();
      detach();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[220vh] bg-gradient-to-b from-cocoa-950 via-cocoa-900 to-cocoa-950 text-cream-100 overflow-clip"
      style={
        {
          "--cd-wall-scale": "1.6",
          "--cd-wall-translate": "360px",
          "--cd-wall-opacity": "0.1",
          "--cd-dock-scale": "0.95",
          "--cd-dock-translate": "50px",
          "--cd-dock-glow": "0",
        } as React.CSSProperties
      }
    >
      {/* Ambient background light gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-caramel-500/15 via-caramel-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Sticky Viewport Stage */}
      <div
        ref={scrollAreaRef}
        className="sticky top-0 h-screen flex flex-col justify-between items-center py-10 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden"
      >
        {/* Stage Header */}
        <div className="text-center space-y-3 z-10 pt-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-caramel-500/15 border border-caramel-500/30 text-caramel-300 text-xs font-mono font-bold uppercase tracking-widest shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-caramel-400 animate-pulse" />
            Interactive Dessert Dock Experience
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white">
            Everything sweet,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-caramel-300 via-caramel-400 to-amber-200">
              one scroll away.
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-cream-300/80 leading-relaxed max-w-lg mx-auto">
            Scroll down to watch our signature artisanal creations converge into the live
            chocii 4 u dessert dock. Click any dessert to customize and order!
          </p>
        </div>

        {/* Central Floating Constellation / Converging Wall */}
        <div
          className="relative w-full max-w-5xl my-auto flex items-center justify-center pointer-events-auto"
          style={{
            transform:
              "translateY(var(--cd-wall-translate)) scale(var(--cd-wall-scale))",
            opacity: "var(--cd-wall-opacity)",
            transformOrigin: "center center",
            willChange: "transform, opacity",
            transition: "transform 0.05s linear, opacity 0.05s linear",
          }}
        >
          {/* Floating Dessert Orbit Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full">
            {featured.map((item, idx) => {
              const offsets = [
                "-rotate-3 sm:-translate-y-6",
                "rotate-2 sm:translate-y-4",
                "-rotate-1 sm:-translate-y-4",
                "rotate-3 sm:translate-y-6",
              ];
              const rotation = offsets[idx % offsets.length];

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectProduct(item)}
                  className={`group relative rounded-3xl bg-cocoa-900/90 border border-caramel-500/30 hover:border-caramel-400 p-4 shadow-2xl backdrop-blur-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-caramel-500/25 ${rotation}`}
                >
                  {/* Image Container with Ambient Glow */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-cocoa-950 border border-white/10 mb-3 group-hover:border-caramel-500/50 transition-colors">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Price Tag Badge */}
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-xs font-bold text-caramel-300">
                      ₹{item.salePrice || item.basePrice}
                    </div>

                    {/* Quick Add Pulse Button */}
                    <button
                      type="button"
                      className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-caramel-500 text-cocoa-950 flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg shadow-black/50 hover:scale-110"
                      title="Customize dessert"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-serif font-bold text-cream-100 group-hover:text-caramel-300 transition-colors truncate">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-cream-300/60 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Floating CoolDock (Mac-Style Dock Bar) */}
        <div
          className="w-full max-w-4xl z-20 pb-2"
          style={{
            transform:
              "translateY(var(--cd-dock-translate)) scale(var(--cd-dock-scale))",
            willChange: "transform",
            transition: "transform 0.05s linear",
          }}
        >
          <div className="relative rounded-3xl bg-cocoa-950/80 border border-caramel-500/40 p-3 sm:p-4 shadow-2xl backdrop-blur-2xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
            {/* Left Dock Widget: Live Kitchen Badge */}
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-cocoa-900/60 border border-white/5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <div className="text-left">
                <p className="text-[10px] font-mono uppercase tracking-wider text-cream-300/60">
                  Kitchen Status
                </p>
                <p className="text-xs font-bold text-cream-100">Baking Fresh Daily</p>
              </div>
            </div>

            {/* Center: Interactive Dessert Icons Dock */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-1">
              {featured.map((item) => (
                <button
                  key={`dock-${item.id}`}
                  onClick={() => onSelectProduct(item)}
                  className="group relative flex flex-col items-center p-1.5 rounded-2xl hover:bg-caramel-500/15 transition-all duration-200 active:scale-95"
                  title={`Open ${item.name}`}
                >
                  <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border border-white/10 group-hover:border-caramel-400 group-hover:scale-110 transition-all shadow-md">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-medium text-cream-300/80 group-hover:text-caramel-300 max-w-[60px] truncate mt-1">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Right: CTA Button */}
            <div className="flex items-center gap-2 shrink-0">
              {onExploreMenu && (
                <button
                  onClick={onExploreMenu}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-400 hover:to-caramel-500 text-cocoa-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-caramel-500/20 transition-all active:scale-95"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator Prompt */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[11px] font-mono text-cream-300/40 animate-bounce pointer-events-none">
          <ChevronDown className="w-3.5 h-3.5" />
          <span>Scroll down to experience the convergence</span>
        </div>
      </div>
    </section>
  );
}
