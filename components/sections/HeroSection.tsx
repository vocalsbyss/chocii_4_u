"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import HeroDessertCanvas from "../3d/HeroDessertCanvas";

interface HeroSectionProps {
  onExploreClick?: () => void;
}

export default function HeroSection({ onExploreClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden max-w-full w-full bg-gradient-to-b from-cocoa-950 via-cocoa-900 to-cocoa-950">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[700px] h-[90vw] max-h-[700px] sm:w-[900px] sm:h-[900px] rounded-full border border-caramel-500/10 pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[500px] h-[70vw] max-h-[500px] sm:w-[650px] sm:h-[650px] rounded-full border border-caramel-500/15 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left Editorial Copy */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cocoa-900/80 border border-caramel-500/30 text-caramel-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-caramel-400" />
            <span>Dessert Cloud Kitchen</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-cream-100 tracking-tight leading-[1.1]">
            Your Cravings. <br />
            <span className="bg-gradient-to-r from-caramel-400 via-cream-100 to-caramel-500 bg-clip-text text-transparent">
              Our Obsession.
            </span>
          </h1>

          <p className="text-lg sm:text-xl font-serif italic text-caramel-300/90 font-light">
            “A Little Treat, Just for You.”
          </p>

          <p className="text-sm sm:text-base text-cream-200/80 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
            Meet your next favourite dessert. Freshly prepared, beautifully packed, and made for your sweetest cravings.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-caramel-500 hover:bg-caramel-400 text-cocoa-950 font-bold uppercase tracking-wider text-xs shadow-xl shadow-caramel-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Explore Desserts
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/menu"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-cocoa-900/80 hover:bg-cocoa-800 text-cream-100 border border-caramel-500/40 font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2"
            >
              Order Now
            </Link>
          </div>

          {/* Customer Trust Badges */}
          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/10 text-center lg:text-left max-w-md mx-auto lg:mx-0">
            <div>
              <p className="text-lg font-bold text-cream-100">Chocii</p>
              <p className="text-[11px] text-cream-300/60 uppercase tracking-wider">Specialties</p>
            </div>
            <div>
              <p className="text-lg font-bold text-cream-100">Secure</p>
              <p className="text-[11px] text-cream-300/60 uppercase tracking-wider">Packaging</p>
            </div>
            <div>
              <p className="text-lg font-bold text-cream-100">Direct</p>
              <p className="text-[11px] text-cream-300/60 uppercase tracking-wider">Ordering</p>
            </div>
          </div>
        </div>

        {/* Right 3D Dessert Canvas */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <HeroDessertCanvas />
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-cream-300/50 hover:text-caramel-400 transition-colors pointer-events-auto cursor-pointer" onClick={onExploreClick}>
        <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll to Crave</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
}
