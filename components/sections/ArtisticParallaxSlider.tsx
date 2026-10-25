"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  ChevronDown,
  Search,
  Star,
  MessageSquare,
  Send,
  Heart,
} from "lucide-react";
import ProductCard from "../products/ProductCard";
import { Product } from "@/types";

interface ArtisticParallaxSliderProps {
  onExploreClick?: () => void;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  menuSectionRef?: React.RefObject<HTMLDivElement>;
}

interface CustomerReview {
  author: string;
  city?: string;
  rating: number;
  dessert?: string;
  quote: string;
}

export default function ArtisticParallaxSlider({
  onExploreClick,
  products = [],
  onSelectProduct,
  menuSectionRef,
}: ArtisticParallaxSliderProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [menuSearchQuery, setMenuSearchQuery] = useState("");
  const [activeMenuCategory, setActiveMenuCategory] = useState("ALL");
  const heroRef = useRef<HTMLDivElement>(null);

  // Review form local state
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewDessert, setReviewDessert] = useState("Dream Cake");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [customerReviews, setCustomerReviews] = useState<CustomerReview[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cravings_customer_reviews");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCustomerReviews(parsed);
        }
      }
    } catch {}
  }, []);

  // Find products for direct action buttons
  const dreamCake = products.find((p) => p.slug === "dream-cake") || products[0];
  const dreamBowl = products.find((p) => p.slug === "dream-bowl") || products[1];
  const chocoChurros = products.find((p) => p.slug === "choco-churros") || products[2];
  const fruizy = products.find((p) => p.slug === "fruizy") || products[3];
  const canCake = products.find((p) => p.slug === "can-cake") || products[4];

  // Dynamically extract categories from available products
  const categoryTabs = useMemo(() => {
    const list = [{ slug: "ALL", name: "All Cravings" }];
    const seen = new Set<string>();
    products.forEach((p) => {
      if (p.category?.slug && p.category?.name && !seen.has(p.category.slug)) {
        seen.add(p.category.slug);
        list.push({ slug: p.category.slug, name: p.category.name });
      }
    });
    return list;
  }, [products]);

  // Filter products for the 3rd page menu
  const filteredMenuItems = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeMenuCategory === "ALL" || p.category?.slug === activeMenuCategory;
      const q = menuSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, activeMenuCategory, menuSearchQuery]);

  // Parallax mouse move handler for Hero
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const normX = (clientX / innerWidth - 0.5) * 2;
    const normY = (clientY / innerHeight - 0.5) * 2;
    setMousePos({ x: normX, y: normY });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const newRev: CustomerReview = {
      author: reviewName.trim(),
      city: "Visakhapatnam",
      rating: reviewRating,
      dessert: reviewDessert,
      quote: reviewComment.trim(),
    };

    const updated = [newRev, ...customerReviews];
    setCustomerReviews(updated);
    try {
      localStorage.setItem("cravings_customer_reviews", JSON.stringify(updated));
    } catch {}

    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setReviewName("");
      setReviewComment("");
    }, 4000);
  };

  return (
    <div className="w-full bg-white text-cocoa-950 font-sans">
      {/* ========================================================================= */}
      {/* 1. GRAND HERO SECTION: EDITORIAL HEADLINE (FIRST PAGE - SAME AS NOW)      */}
      {/* ========================================================================= */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative w-full min-h-[92vh] sm:min-h-screen bg-white text-cocoa-950 overflow-hidden flex items-center justify-center select-none pt-20"
      >
        {/* Crisp Pure White Background with Subtle High-Precision Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(rgba(36, 19, 15, 0.15) 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
          }}
        />

        {/* Luminous High-Opacity Radiant Brand Logo on Hero Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[580px] md:w-[760px] lg:w-[900px] max-w-[88vw] aspect-[857/543] pointer-events-none select-none z-0 transition-all duration-700">
          {/* Warm Golden / Caramel Ambient Radiant Backlight */}
          <div
            className="absolute inset-0 -m-8 sm:-m-16 rounded-full blur-3xl pointer-events-none opacity-60 dark:opacity-85 transition-opacity"
            style={{
              background: "radial-gradient(ellipse at center, rgba(217, 160, 102, 0.45) 0%, rgba(197, 138, 85, 0.25) 45%, transparent 75%)",
            }}
          />

          <Image
            src="/images/chocii-logo.png"
            alt="chocii 4 u logo watermark"
            fill
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 760px, 900px"
            className="object-contain opacity-50 sm:opacity-60 md:opacity-70 dark:opacity-80 dark:sm:opacity-90 filter drop-shadow-[0_0_35px_rgba(217,160,102,0.45)] sm:drop-shadow-[0_0_65px_rgba(217,160,102,0.6)] brightness-110 contrast-105 saturate-115 dark:brightness-130 dark:contrast-115 dark:drop-shadow-[0_0_80px_rgba(217,160,102,0.75)] transition-all duration-500"
            priority
          />
        </div>

        {/* Hero Content Composition (Clean Pure White Stage - Centered Luxury Showcase) */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-10 h-full flex flex-col justify-center items-center text-center py-12">
          <motion.div
            animate={{
              x: mousePos.x * 8,
              y: mousePos.y * 8,
            }}
            transition={{ type: "spring", damping: 30, stiffness: 90 }}
            className="space-y-6 sm:space-y-8 flex flex-col items-center max-w-4xl w-full"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 max-w-full">
              <span className="w-2.5 h-2.5 rounded-full bg-caramel-500 animate-ping shrink-0" />
              <span className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-[0.25em] text-caramel-700 font-black bg-white/95 dark:bg-cocoa-900/95 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-stone-300 dark:border-white/10 shadow-md font-mono max-w-[88vw] truncate">
                ( NEED AMAZING DESSERTS ) • CHOCII 4 U
              </span>
            </div>

            {/* Massive Editorial Headline (Iconic High-Contrast Signature with Ambient Halo) */}
            <h1 className="text-3xl sm:text-6xl lg:text-8xl font-black font-sans tracking-tight text-cocoa-950 dark:text-cream-100 uppercase leading-[0.95] sm:leading-[0.92] drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_2px_16px_rgba(21,10,8,0.95)] break-words">
              <span className="block drop-shadow-[0_1px_8px_rgba(255,255,255,0.9)] dark:drop-shadow-[0_1px_10px_rgba(21,10,8,0.9)]">NEED</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cocoa-950 via-caramel-700 to-cocoa-950 dark:from-white dark:via-caramel-300 dark:to-white italic font-serif lowercase my-1 drop-shadow-[0_2px_8px_rgba(255,255,255,0.85)] dark:drop-shadow-[0_2px_10px_rgba(21,10,8,0.9)]">
                amazing
              </span>
              <span className="block drop-shadow-[0_1px_8px_rgba(255,255,255,0.9)] dark:drop-shadow-[0_1px_10px_rgba(21,10,8,0.9)]">DESSERTS</span>
            </h1>

            {/* Minimalist Subtitle on Clean Bright White Frosted Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/90 dark:bg-cocoa-900/90 backdrop-blur-md border border-stone-200/90 dark:border-white/10 shadow-md max-w-xl mx-auto space-y-1.5 text-center">
              <p className="text-xs uppercase tracking-[0.2em] font-mono text-caramel-700 font-bold">
                “A Little Treat, Just for You.”
              </p>
              <p className="text-sm sm:text-base text-cocoa-950 font-medium leading-relaxed">
                Explore our tempting collection of chocolate treats, layered cakes, churros, and dessert creations. Find your favourite and place your order.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onExploreClick}
                className="group px-8 py-3.5 rounded-full bg-cocoa-950 text-white hover:bg-caramel-500 hover:text-cocoa-950 font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center gap-2 shadow-xl shadow-cocoa-950/20 active:scale-95"
              >
                <span>EXPLORE CRAVINGS</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-caramel-400 group-hover:text-cocoa-950" />
              </button>

              <Link
                href="/menu"
                className="px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-cocoa-950 font-semibold uppercase tracking-wider text-xs transition-colors shadow-sm"
              >
                FULL MENU
              </Link>

              {dreamCake && onSelectProduct && (
                <button
                  onClick={() => onSelectProduct(dreamCake)}
                  className="px-5 py-3 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-cocoa-950 font-bold uppercase tracking-wider text-xs transition-colors shadow-sm hidden sm:inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-caramel-600" />
                  <span>Quick Order Cake</span>
                </button>
              )}
            </div>

            {/* Editorial Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-[11px] font-mono text-cocoa-900/70 uppercase tracking-wider">
              <span className="px-3 py-1 rounded-full bg-stone-50 border border-stone-200">Chocii Specialties</span>
              <span className="text-stone-300 hidden sm:inline">•</span>
              <span className="px-3 py-1 rounded-full bg-stone-50 border border-stone-200">Prompt Local Delivery</span>
              <span className="text-stone-300 hidden sm:inline">•</span>
              <span className="px-3 py-1 rounded-full bg-stone-50 border border-stone-200">Secure Packaging</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div
          onClick={onExploreClick}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-cocoa-900/50 hover:text-caramel-600 transition-colors cursor-pointer"
        >
          <span className="text-[9px] uppercase tracking-[0.25em] font-semibold">
            SCROLL TO EXPLORE MENU
          </span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DESSERT MENU CATALOG (FAST DIRECT ACCESS FOR CUSTOMERS)                */}
      {/* ========================================================================= */}
      <section
        ref={menuSectionRef}
        id="full-menu-section"
        className="relative py-12 sm:py-16 bg-white border-t border-stone-200 overflow-hidden"
      >
        {/* Crisp Pure White Background with Subtle Precision Dots */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(rgba(36, 19, 15, 0.15) 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-10 lg:px-14 space-y-8">
          {/* Direct, Streamlined Menu Header */}
          <div className="text-center space-y-2.5 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 max-w-full">
              <span className="w-2.5 h-2.5 rounded-full bg-caramel-500 animate-ping shrink-0" />
              <span className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-[0.2em] text-caramel-700 font-black bg-stone-50 px-3.5 sm:px-4 py-1.5 rounded-full border border-stone-300 shadow-xs font-mono">
                CHOCII 4 U • DESSERT MENU
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black font-sans tracking-tight text-cocoa-950 uppercase leading-tight">
              Explore Our Menu
            </h2>

            <p className="text-xs sm:text-sm text-cocoa-900/70 font-medium max-w-md mx-auto">
              Handcrafted fresh daily in Visakhapatnam. Select any treat to customize toppings, choose sweetness, and place your order.
            </p>
          </div>

          {/* Interactive Search & Filter Bar */}
          <div className="space-y-4 max-w-3xl mx-auto">
            {/* Live Search Input */}
            <div className="relative shadow-sm rounded-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-caramel-700" />
              <input
                type="text"
                placeholder="Search dream cakes, brownie bowls, cinnamon churros, fruizy..."
                value={menuSearchQuery}
                onChange={(e) => setMenuSearchQuery(e.target.value)}
                className="w-full bg-white/95 border-2 border-stone-300/90 rounded-full pl-11 pr-10 py-3.5 text-xs sm:text-sm text-cocoa-950 font-medium placeholder:text-cocoa-900/60 focus:outline-none focus:border-caramel-600 shadow-sm transition-all"
              />
              {menuSearchQuery && (
                <button
                  type="button"
                  onClick={() => setMenuSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-cocoa-900/60 hover:text-cocoa-950 font-bold p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {categoryTabs.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setActiveMenuCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    activeMenuCategory === cat.slug
                      ? "bg-cocoa-950 text-white shadow-md shadow-cocoa-950/25 scale-[1.02]"
                      : "bg-white hover:bg-stone-50 border border-stone-300 text-cocoa-950 shadow-xs"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Tilt Product Grid */}
          {filteredMenuItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMenuItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct || (() => {})}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-stone-50/60 rounded-3xl border border-stone-200 space-y-4">
              <p className="text-sm font-semibold text-cocoa-900">
                No artisanal creations found matching &ldquo;{menuSearchQuery}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => {
                  setMenuSearchQuery("");
                  setActiveMenuCategory("ALL");
                }}
                className="px-5 py-2 rounded-full bg-cocoa-950 text-white text-xs font-bold uppercase tracking-wider shadow-sm"
              >
                Reset Search Filters
              </button>
            </div>
          )}

          {/* Catalog Link & Quick Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-200">
            <span className="text-xs text-cocoa-900/70 font-mono">
              Showing {filteredMenuItems.length} desserts ready for order
            </span>
            <div className="flex items-center gap-4">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-cocoa-950 hover:text-caramel-600 transition-colors"
              >
                <span>Explore Full Menu Catalog & Add-ons</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SENSORY FEEDBACK & CUSTOMER REVIEWS (4TH PAGE)                         */}
      {/* ========================================================================= */}
      <section
        id="feedback-section"
        className="relative py-24 sm:py-32 bg-[#FAF7F2] border-t border-stone-200 overflow-hidden"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-10 lg:px-14 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 max-w-full">
              <span className="w-2.5 h-2.5 rounded-full bg-caramel-500 animate-ping shrink-0" />
              <span className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-[0.25em] text-caramel-700 dark:text-caramel-400 font-black bg-white dark:bg-cocoa-900 px-3 sm:px-3.5 py-1.5 rounded-full border border-stone-200 dark:border-white/10 shadow-sm font-mono max-w-[88vw] truncate">
                CHOCII 4 U • CUSTOMER FEEDBACK
              </span>
            </div>
            <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black font-sans uppercase tracking-tight text-cocoa-950 dark:text-cream-100 leading-[0.95] break-words">
              <span className="block">SHARE YOUR</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cocoa-950 via-caramel-600 to-caramel-500 dark:from-cream-100 dark:via-caramel-400 dark:to-caramel-300 italic font-serif lowercase">
                sweet experience
              </span>
            </h2>
            <p className="text-sm text-cocoa-900/80 dark:text-cream-200/80 font-normal leading-relaxed max-w-xl mx-auto">
              We craft each dessert fresh daily with genuine passion. Tell us how your sweet craving was satisfied!
            </p>
          </div>

          {/* Real Customer Reviews Grid (Only shown when genuine reviews are submitted) */}
          {customerReviews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {customerReviews.slice(0, 6).map((t, idx) => (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-white dark:bg-cocoa-900 border border-stone-200 dark:border-white/10 space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex gap-1 text-caramel-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-caramel-500 text-caramel-500" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-cocoa-900/90 dark:text-cream-100 italic font-normal leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  <div className="border-t border-stone-200/60 dark:border-white/10 pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-cocoa-950 dark:text-cream-100">{t.author}</p>
                      {t.city && <p className="text-[11px] text-cocoa-800/60 dark:text-cream-300/70">{t.city}</p>}
                    </div>
                    {t.dessert && (
                      <span className="text-[10px] font-mono text-caramel-700 dark:text-caramel-400 font-bold uppercase bg-stone-100 dark:bg-white/10 px-2 py-0.5 rounded">
                        {t.dessert}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Review Submission Box */}
          <div className="max-w-2xl mx-auto rounded-3xl bg-white dark:bg-cocoa-900 border border-stone-200 dark:border-white/10 p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-serif font-black text-cocoa-950 dark:text-cream-100 mb-1">
              Share Your Craving Experience
            </h3>
            <p className="text-xs text-cocoa-900/70 dark:text-cream-300/70 mb-5">
              Let us know how you enjoyed your treat. Your review helps us craft even sweeter moments!
            </p>

            {reviewSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Thank you! Your sweet feedback has been received with love.</span>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-cocoa-900 dark:text-cream-200 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-cocoa-950 border border-stone-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-cocoa-950 dark:text-cream-100 placeholder:text-stone-400 dark:placeholder:text-cream-300/40 focus:outline-none focus:border-caramel-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-cocoa-900 dark:text-cream-200 mb-1">
                      Dessert Enjoyed
                    </label>
                    <select
                      value={reviewDessert}
                      onChange={(e) => setReviewDessert(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-cocoa-950 border border-stone-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-cocoa-950 dark:text-cream-100 focus:outline-none focus:border-caramel-500"
                    >
                      <option value="Dream Cake">Dream Cake</option>
                      <option value="Dream Bowl">Dream Bowl</option>
                      <option value="Choco Churros">Choco Churros</option>
                      <option value="Fruizy">Fruizy</option>
                      <option value="Can Cake">Can Cake</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-cocoa-900 dark:text-cream-200 mb-1">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-caramel-500 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating ? "fill-caramel-500" : "text-stone-300 dark:text-stone-700"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-cocoa-900 dark:text-cream-200 mb-1">
                    Your Review
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us about the texture, flavour, and delivery experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-cocoa-950 border border-stone-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-cocoa-950 dark:text-cream-100 placeholder:text-stone-400 dark:placeholder:text-cream-300/40 focus:outline-none focus:border-caramel-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Link
                    href="/feedback"
                    className="text-[11px] text-caramel-700 dark:text-caramel-400 hover:underline font-bold uppercase tracking-wider"
                  >
                    View All Customer Reviews →
                  </Link>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-cocoa-950 hover:bg-caramel-500 dark:bg-caramel-500 dark:hover:bg-caramel-400 text-white dark:text-cocoa-950 text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
                  >
                    <span>Submit Review</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
