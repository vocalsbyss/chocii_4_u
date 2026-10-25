"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  Plus,
  CheckCircle2,
  ChevronDown,
  Layers,
  Heart,
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
  const [isMobile, setIsMobile] = useState(false);

  // Take the 4 signature dessert showstoppers
  const items = products.slice(0, 4);

  // Check mobile screen size on mount & resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || typeof window.requestAnimationFrame !== "function") {
      setScrollProgress(1);
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
      { rootMargin: "100px 0px" }
    );

    observer.observe(container);
    handleScroll();

    return () => {
      observer.disconnect();
      detach();
    };
  }, []);

  // Smooth cubic ease-out deceleration curve
  const p = scrollProgress;
  // Natural cubic deceleration: starts responsive, glides into zero-velocity stop
  const easeProgress = 1 - Math.pow(1 - p, 3);
  const isSettled = p >= 0.85;

  // Trajectory vectors tuned specifically to ALWAYS stay within screen bounds
  // Desktop: Gentle inward & downward glide (~60-80px max horizontal delta)
  // Mobile: Subtly scaled down (~20-25px max horizontal delta)
  const trajectoriesDesktop = [
    { x: -75, y: -160, r: -7, s: 1.15, badge: "🍫 70% Dark Chocolate" },
    { x: -25, y: -190, r: 6, s: 1.18, badge: "🔥 Molten Lava Core" },
    { x: 25, y: -180, r: -5, s: 1.16, badge: "✨ Crispy Sugar Glaze" },
    { x: 75, y: -150, r: 7, s: 1.14, badge: "🍓 Fresh Berry Coulis" },
  ];

  const trajectoriesMobile = [
    { x: -22, y: -90, r: -4, s: 1.08, badge: "🍫 70% Dark" },
    { x: -8, y: -110, r: 4, s: 1.1, badge: "🔥 Molten" },
    { x: 8, y: -105, r: -3, s: 1.09, badge: "✨ Crispy" },
    { x: 22, y: -85, r: 4, s: 1.08, badge: "🍓 Berry" },
  ];

  const trajectories = isMobile ? trajectoriesMobile : trajectoriesDesktop;

  return (
    <section
      ref={containerRef}
      className="relative min-h-[190vh] bg-gradient-to-b from-[#100906] via-[#1a0f0a] to-[#120a06] text-cream-100 select-none"
    >
      {/* Ambient Lighting & Luxury Backlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[450px] bg-caramel-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[300px] sm:w-[500px] h-[300px] bg-amber-600/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Sticky Viewport Shell (Fits 100% within any laptop, phone, or tablet) */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between items-center py-4 sm:py-6 px-3 sm:px-6 max-w-6xl mx-auto overflow-hidden">
        {/* ========================================================================= */}
        {/* TIER 1: ELEGANT EDITORIAL HEADER                                          */}
        {/* ========================================================================= */}
        <div className="text-center space-y-1.5 sm:space-y-2 z-20 pt-1 sm:pt-3 max-w-xl transition-all duration-300">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-caramel-500/15 border border-caramel-500/30 text-caramel-300 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest shadow-inner">
            <Sparkles className="w-3 h-3 text-caramel-400 animate-pulse" />
            Signature Tasting Dock
          </div>

          <h2 className="text-xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight text-white leading-tight">
            Watch our signature creations{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-caramel-300 via-caramel-400 to-amber-200">
              dock into place.
            </span>
          </h2>

          <p className="text-[11px] sm:text-xs text-cream-300/70 max-w-md mx-auto leading-relaxed">
            {isSettled
              ? "✨ Platter assembled & ready! Click any dessert to customize your box."
              : "Scroll down to see each handcrafted dessert glide seamlessly into its dock slot."}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* TIER 2: THE MAC-STYLE DESSERT DOCK STAGE                                  */}
        {/* ========================================================================= */}
        <div className="w-full max-w-4xl my-auto z-10 flex flex-col items-center px-1 sm:px-4">
          {/* Frosted Dock Shell */}
          <div
            className={`w-full rounded-2xl sm:rounded-[32px] p-3 sm:p-5 transition-all duration-500 border backdrop-blur-2xl shadow-2xl relative ${
              isSettled
                ? "bg-cocoa-950/85 border-caramel-400/50 shadow-caramel-500/20 ring-1 ring-caramel-400/30"
                : "bg-cocoa-950/45 border-white/10 shadow-black/50"
            }`}
          >
            {/* macOS Dock Header Bar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] font-mono text-cream-300/50 ml-1.5 hidden sm:inline">
                  chocii-4-u.dock
                </span>
              </div>

              {/* Status Badge */}
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
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-caramel-300 font-semibold">
                  {isSettled ? "Dock Locked & Ready" : "Aligning Ingredients..."}
                </span>
              </div>

              {/* Numerical Progress Indicator */}
              <div className="text-[11px] font-mono text-cream-300/40">
                {Math.round(p * 100)}%
              </div>
            </div>

            {/* 4 DOCK SLOTS CONTAINER (Equal width, 100% responsive, never overflows) */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3.5 lg:gap-4 relative">
              {items.map((item, idx) => {
                const traj = trajectories[idx % trajectories.length];

                // Interpolate individual position relative to scroll progress
                // Delta smoothly goes to 0 as easeProgress approaches 1
                const deltaMultiplier = 1 - easeProgress;
                const currentDeltaX = traj.x * deltaMultiplier;
                const currentDeltaY = traj.y * deltaMultiplier;
                const currentRotate = traj.r * deltaMultiplier;
                const currentScale = 1 + (traj.s - 1) * deltaMultiplier;

                return (
                  <div key={item.id} className="relative flex flex-col items-center">
                    {/* Ghost Dock Bay Outline (Shows user where the card is docking into) */}
                    <div
                      className={`absolute inset-0 rounded-xl sm:rounded-2xl border transition-all duration-300 pointer-events-none ${
                        isSettled
                          ? "opacity-0 border-transparent"
                          : "opacity-40 border-dashed border-caramel-400/40 bg-caramel-500/5"
                      }`}
                    />

                    {/* The Active Flying/Docked Card */}
                    <div
                      onClick={() => onSelectProduct(item)}
                      style={{
                        transform: `translate3d(${currentDeltaX}px, ${currentDeltaY}px, 0) rotate(${currentRotate}deg) scale(${currentScale})`,
                        willChange: "transform",
                      }}
                      className={`group w-full relative rounded-xl sm:rounded-2xl p-2 sm:p-3 cursor-pointer transition-colors duration-200 flex flex-col justify-between border ${
                        isSettled
                          ? "bg-cocoa-900/90 border-caramel-500/40 hover:border-caramel-400 hover:shadow-xl hover:shadow-caramel-500/25 ring-1 ring-white/5"
                          : "bg-cocoa-950/90 border-white/15 shadow-xl"
                      }`}
                    >
                      {/* Floating Tasting Badge (Visible during flight, smoothly fades when docked) */}
                      <div
                        className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-caramel-500 text-cocoa-950 font-bold text-[8px] sm:text-[9px] tracking-wide whitespace-nowrap shadow-md transition-opacity duration-300 z-30 pointer-events-none ${
                          isSettled ? "opacity-0 scale-90" : "opacity-95 scale-100"
                        }`}
                      >
                        {traj.badge}
                      </div>

                      {/* Dessert Squircle Image Area */}
                      <div className="relative aspect-square w-full rounded-lg sm:rounded-xl overflow-hidden bg-cocoa-950/80 border border-white/10 mb-1.5 sm:mb-2 group-hover:border-caramel-400/60 transition-colors">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 22vw, 180px"
                          className="object-cover group-hover:scale-108 transition-transform duration-300"
                        />

                        {/* Price Pill */}
                        <div className="absolute top-1.5 right-1.5 px-1.5 sm:px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md border border-white/15 text-[9px] sm:text-[11px] font-bold text-caramel-300 shadow">
                          ₹{item.salePrice || item.basePrice}
                        </div>

                        {/* Quick Add Button when Settled */}
                        <button
                          type="button"
                          className={`absolute bottom-1.5 right-1.5 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-caramel-500 text-cocoa-950 flex items-center justify-center font-bold transition-all duration-300 shadow hover:scale-110 active:scale-95 ${
                            isSettled
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-50 pointer-events-none"
                          }`}
                          title="Customize dessert"
                        >
                          <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>

                      {/* Card Content & Details */}
                      <div className="space-y-0.5 sm:space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="text-[11px] sm:text-xs md:text-sm font-serif font-bold text-cream-100 group-hover:text-caramel-300 transition-colors truncate">
                            {item.name}
                          </h3>
                        </div>

                        <p className="text-[9px] sm:text-[10px] text-cream-300/60 line-clamp-1 leading-tight hidden xs:block">
                          {item.description}
                        </p>
                      </div>

                      {/* Bottom Settle Pill */}
                      <div
                        className={`pt-1.5 mt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] sm:text-[10px] transition-opacity duration-300 ${
                          isSettled ? "opacity-100" : "opacity-20"
                        }`}
                      >
                        <span className="text-caramel-300/90 font-medium group-hover:text-caramel-300">
                          Customize
                        </span>
                        <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-caramel-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Dock Control Bar */}
            <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/5 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-cream-300/70 text-[10px] sm:text-[11px]">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Made Fresh Daily in Visakhapatnam
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline text-caramel-300/80 font-medium">
                  100% Pure Vegetarian
                </span>
              </div>

              {onExploreMenu && (
                <button
                  onClick={onExploreMenu}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-400 hover:to-caramel-500 text-cocoa-950 font-bold text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center gap-1 shadow transition-all active:scale-95"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TIER 3: SCROLL PROGRESS / SETTLED STATUS PILL                             */}
        {/* ========================================================================= */}
        <div className="z-20 pb-1 sm:pb-2 flex items-center justify-center">
          <div
            className={`px-3.5 py-1 rounded-full border text-[10px] sm:text-[11px] font-mono transition-all duration-300 flex items-center gap-1.5 shadow-lg ${
              isSettled
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                : "bg-cocoa-950/80 border-white/10 text-cream-300/70 backdrop-blur-md"
            }`}
          >
            {isSettled ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>All 4 Desserts Snapped Flush! Scroll to explore the catalog</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 animate-bounce text-caramel-400" />
                <span>Scroll down to dock signature desserts</span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
