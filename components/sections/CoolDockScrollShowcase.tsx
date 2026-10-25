"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Flame,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  ChevronDown,
  ShoppingBag,
  Award,
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
  const [scrollProgress, setScrollProgress] = useState(0);

  // Take the 4 signature dessert showstoppers
  const items = products.slice(0, 4);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || typeof window.requestAnimationFrame !== "function") {
      setScrollProgress(1);
      container.style.setProperty("--cd-progress", "1");
      return;
    }

    let isTicking = false;

    const clamp = (val: number, min = 0, max = 1) =>
      Math.min(Math.max(val, min), max);

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = Math.max(container.offsetHeight - viewportHeight, 1);
      const progress = clamp(-rect.top / totalScrollable);

      container.style.setProperty("--cd-progress", progress.toFixed(4));
      setScrollProgress(progress);
      isTicking = false;
    };

    const onScroll = () => {
      if (!isTicking) {
        isTicking = true;
        window.requestAnimationFrame(handleScroll);
      }
    };

    let isAttached = false;
    const attach = () => {
      if (!isAttached) {
        isAttached = true;
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        handleScroll();
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
      { rootMargin: "150px 0px" }
    );

    observer.observe(container);
    handleScroll();

    return () => {
      observer.disconnect();
      detach();
    };
  }, []);

  // Card initial scatter vectors for desktop & mobile
  // Phase 1 (0 to 0.75): Scattered floating cards glide and rotate into place
  // Phase 2 (0.75 to 1.0): Cards snap flush into the frosted glass dock slots
  const p = scrollProgress;
  // Eased progress using smooth cubic deceleration
  const easeProgress = 1 - Math.pow(1 - p, 3);
  const settleFactor = p >= 0.85 ? 1 : easeProgress;
  const isSettled = p >= 0.8;

  // Individual card trajectories: [initialX, initialY, initialRotate, initialScale]
  const trajectories = [
    { x: -160, y: -70, r: -9, s: 1.25, badge: "🍫 70% Belgian Dark" },
    { x: 150, y: -90, r: 8, s: 1.28, badge: "🔥 Warm Molten Core" },
    { x: -130, y: 80, r: 7, s: 1.22, badge: "✨ Crispy Sugar Glaze" },
    { x: 140, y: 70, r: -8, s: 1.26, badge: "🍓 Fresh Berry Coulis" },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-[240vh] bg-gradient-to-b from-cocoa-950 via-cocoa-900 to-cocoa-950 text-cream-100 overflow-clip select-none"
      style={{ "--cd-progress": "0" } as React.CSSProperties}
    >
      {/* Background Radial Ambient Halos */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-gradient-radial from-caramel-500/12 via-caramel-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Sticky Viewport Shell */}
      <div className="sticky top-0 h-screen flex flex-col justify-between items-center py-6 sm:py-8 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden">
        {/* Top Eyebrow & Headline */}
        <div className="text-center space-y-2 z-20 pt-2 sm:pt-4 max-w-2xl transition-all duration-300">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-caramel-500/15 border border-caramel-500/30 text-caramel-300 text-[11px] font-mono font-bold uppercase tracking-widest shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-caramel-400 animate-pulse" />
            Signature Dessert Dock
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            Watch our signature creations{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-caramel-300 via-caramel-400 to-amber-200">
              fall into place.
            </span>
          </h2>

          <p className="text-[11px] sm:text-xs text-cream-300/70 max-w-md mx-auto leading-relaxed">
            {isSettled
              ? "✨ The dessert platter is locked and ready! Click any treat to customize your box."
              : "Scroll down to see our four signature showstoppers converge smoothly into the live tasting dock."}
          </p>
        </div>

        {/* Central Convergent Dock Stage */}
        <div className="relative w-full max-w-5xl my-auto z-10 flex flex-col items-center">
          {/* Frosted Dock Station Frame (The Target Stage) */}
          <div
            className={`w-full rounded-3xl sm:rounded-[32px] p-4 sm:p-6 transition-all duration-500 border backdrop-blur-2xl shadow-2xl relative ${
              isSettled
                ? "bg-cocoa-900/85 border-caramel-400/50 shadow-caramel-500/20 ring-1 ring-caramel-400/30"
                : "bg-cocoa-950/40 border-white/10 shadow-black/40"
            }`}
          >
            {/* Dock Top Window Bar (Mac Style) */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-strawberry-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <span className="text-[11px] font-mono text-cream-300/50 ml-2 hidden sm:inline">
                  chocii-4-u.dock
                </span>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isSettled ? "bg-emerald-400" : "bg-caramel-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isSettled ? "bg-emerald-500" : "bg-caramel-500"
                    }`}
                  />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-caramel-300 font-semibold">
                  {isSettled ? "Platter Assembled" : "Aligning Ingredients..."}
                </span>
              </div>

              {/* Progress counter */}
              <div className="text-[11px] font-mono text-cream-300/40">
                {Math.round(p * 100)}%
              </div>
            </div>

            {/* Converging 4-Slot Grid Container */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 relative">
              {items.map((item, idx) => {
                const traj = trajectories[idx % trajectories.length];

                // Interpolate individual position relative to scroll progress
                // As p goes from 0 to 1, deltaX and deltaY smoothly interpolate to 0
                const currentDeltaX = traj.x * (1 - settleFactor);
                const currentDeltaY = traj.y * (1 - settleFactor);
                const currentRotate = traj.r * (1 - settleFactor);
                const currentScale = 1 + (traj.s - 1) * (1 - settleFactor);

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectProduct(item)}
                    style={{
                      transform: `translate3d(${currentDeltaX}px, ${currentDeltaY}px, 0) rotate(${currentRotate}deg) scale(${currentScale})`,
                      willChange: "transform, opacity",
                      transition: "transform 0.06s linear",
                    }}
                    className={`group relative rounded-2xl sm:rounded-3xl p-3 sm:p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between border ${
                      isSettled
                        ? "bg-cocoa-950/80 border-caramel-500/40 hover:border-caramel-400 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-caramel-500/25 ring-1 ring-white/5"
                        : "bg-cocoa-900/60 border-white/10 shadow-lg"
                    }`}
                  >
                    {/* Floating Tasting Badge during Flight */}
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-caramel-500 text-cocoa-950 font-bold text-[9px] sm:text-[10px] tracking-wide whitespace-nowrap shadow-md transition-opacity duration-300 z-30 pointer-events-none ${
                        isSettled ? "opacity-0" : "opacity-90"
                      }`}
                    >
                      {traj.badge}
                    </div>

                    {/* Image Area */}
                    <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-cocoa-950/90 border border-white/10 mb-2.5 group-hover:border-caramel-400/60 transition-colors">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 45vw, 22vw"
                        className="object-cover group-hover:scale-108 transition-transform duration-500"
                      />

                      {/* Price Pill */}
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-bold text-caramel-300 shadow-md">
                        ₹{item.salePrice || item.basePrice}
                      </div>

                      {/* Quick Add Button */}
                      <button
                        type="button"
                        className={`absolute bottom-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-caramel-500 text-cocoa-950 flex items-center justify-center font-bold transition-all duration-300 shadow-lg hover:scale-110 active:scale-95 ${
                          isSettled ? "opacity-100 scale-100" : "opacity-0 scale-75"
                        }`}
                        title="Customize dessert"
                      >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>

                    {/* Item Details */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-xs sm:text-sm font-serif font-bold text-cream-100 group-hover:text-caramel-300 transition-colors truncate">
                          {item.name}
                        </h3>
                        <span className="text-[10px] text-emerald-400 font-bold shrink-0 hidden sm:inline">
                          Fresh
                        </span>
                      </div>

                      <p className="text-[10px] text-cream-300/60 line-clamp-2 leading-tight">
                        {item.description}
                      </p>
                    </div>

                    {/* Settle Action Prompt when locked */}
                    <div
                      className={`pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[10px] transition-opacity duration-300 ${
                        isSettled ? "opacity-100" : "opacity-30"
                      }`}
                    >
                      <span className="text-caramel-300/90 font-medium group-hover:text-caramel-300">
                        Customize
                      </span>
                      <ArrowRight className="w-3 h-3 text-caramel-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Dock Control Bar */}
            <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 text-cream-300/70 text-[11px]">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Made Fresh in Visakhapatnam
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">100% Pure Vegetarian</span>
              </div>

              {onExploreMenu && (
                <button
                  onClick={onExploreMenu}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-400 hover:to-caramel-500 text-cocoa-950 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all active:scale-95 ml-auto sm:ml-0"
                >
                  <span>Explore Full Menu</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Progress Helper Pill */}
        <div className="z-20 pb-2 flex items-center justify-center">
          <div
            className={`px-3 py-1 rounded-full border text-[11px] font-mono transition-all duration-300 flex items-center gap-1.5 ${
              isSettled
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                : "bg-cocoa-950/80 border-white/10 text-cream-300/60"
            }`}
          >
            {isSettled ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>All 4 Desserts Snapped into Dock! Continue scrolling for full menu</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 animate-bounce text-caramel-400" />
                <span>Scroll down to assemble the dessert platter</span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
