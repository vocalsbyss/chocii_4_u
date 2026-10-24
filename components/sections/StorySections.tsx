"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Instagram,
  Flame,
  Heart,
  Award,
  ChevronDown,
  Star,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react";
import FloatingChocolateCanvas from "../3d/FloatingChocolateCanvas";
import { Product } from "@/types";

interface StorySectionsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  menuSectionRef?: React.RefObject<HTMLDivElement>;
}

// "Choose Your Craving" Moods
const CRAVING_MOODS = [
  {
    id: "dream-cake",
    title: "Signature Chocolate Shell",
    mood: "Rich & Indulgent",
    dessertName: "Dream Cake",
    description: "Dark chocolate top layer over velvety chocolate mousse and soft cake base.",
    tag: "Signature Creation",
  },
  {
    id: "dream-bowl",
    title: "Warm Chocolate Ganache",
    mood: "Warm & Rich",
    dessertName: "Dream Bowl",
    description: "Warm fudgy brownie bowl paired with rich chocolate ganache sauce and chocolate pearls.",
    tag: "Comfort Classic",
  },
  {
    id: "choco-churros",
    title: "Crispy Fluted Crunch",
    mood: "Crispy & Dippable",
    dessertName: "Choco Churros",
    description: "Golden cinnamon fluted churros served with dark and white chocolate dipping sauces.",
    tag: "Crowd Favourite",
  },
  {
    id: "fruizy",
    title: "Glassy Fruit Snap",
    mood: "Chilled & Juicy",
    dessertName: "Fruizy",
    description: "Tanghulu-inspired strawberries and grapes encased in a crisp candied sugar glaze.",
    tag: "Candied Crunch",
  },
  {
    id: "can-cake",
    title: "Layered Pop-Top",
    mood: "Chilled & Layered",
    dessertName: "Can Cake",
    description: "Chiffon cake, vanilla cream, and chocolate ganache layered inside a sealed pop-top can.",
    tag: "Celebration To-Go",
  },
];

// Customer Testimonials
const TESTIMONIALS = [
  {
    quote:
      "The Dream Cake is pure joy. Rich chocolate layers and smooth texture make it a standout dessert.",
    author: "Ananya Iyer",
    city: "Muralinagar, Visakhapatnam",
    rating: 5,
    dessert: "Dream Cake (Balanced)",
  },
  {
    quote:
      "Arrived neatly packed and on time. The cinnamon churros were delightfully crispy and the dark chocolate dip is wonderful.",
    author: "Kabir Mehta",
    city: "Madhavadhara, Visakhapatnam",
    rating: 5,
    dessert: "Choco Churros & Dipping Duo",
  },
  {
    quote:
      "Finally a dessert brand that gives you the option of Balanced cocoa! Rich cocoa flavor without being overly sweet. Our whole office orders on Fridays.",
    author: "Siddharth Rao",
    city: "MVP Colony, Visakhapatnam",
    rating: 5,
    dessert: "Dream Bowl Lava",
  },
];

// Homepage FAQ Accordion Data
const FAQS = [
  {
    question: "How are the desserts packaged for delivery?",
    answer:
      "All orders are packed in secure, food-grade containers designed to protect your desserts during delivery so they arrive intact and ready to enjoy.",
  },
  {
    question: "What ingredients are used in your desserts?",
    answer:
      "We prepare our desserts using cocoa, dairy, wheat flour, and sugar. Please review individual item details on the menu for specific ingredients and allergen notes before placing an order.",
  },
  {
    question: "What is the difference between Classic and Balanced?",
    answer:
      "Classic offers our rich, indulgent dessert sweetness profile. Balanced reduces overall sweetness to emphasize deeper cocoa notes for a less sweet, chocolate-forward treat.",
  },
  {
    question: "Can I schedule a delivery for later?",
    answer:
      "Yes! At checkout you can place an immediate delivery order or specify your preferred delivery instructions and available dispatch slot.",
  },
];

export default function StorySections({
  products,
  onSelectProduct,
  menuSectionRef,
}: StorySectionsProps) {
  const [activeMoodId, setActiveMoodId] = useState("dream-cake");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeCustomization, setActiveCustomization] = useState<"CLASSIC" | "BALANCED">("CLASSIC");

  const signatureProduct =
    products.find((p) => p.slug === "dream-cake") || products[0];

  const activeMood = CRAVING_MOODS.find((m) => m.id === activeMoodId) || CRAVING_MOODS[0];
  const activeMoodProduct = products.find((p) => p.slug === activeMoodId) || signatureProduct;

  return (
    <div className="bg-white text-cocoa-950 overflow-hidden font-sans">
      {/* SECTION 1: THE CRAVING PROMISE */}
      <section className="relative py-20 sm:py-28 bg-white border-t border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-caramel-50 border border-caramel-200 text-caramel-800 text-xs font-bold uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5 text-caramel-600" />
            A Little Treat, Just for You.
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-cocoa-950 max-w-3xl mx-auto leading-tight">
            A Little Treat, Just for You. <br />
            <span className="text-caramel-600 italic">We craft multi-sensory chocolate obsessions.</span>
          </h2>

          <p className="text-sm sm:text-base text-cocoa-900/80 max-w-2xl mx-auto font-normal leading-relaxed">
            Every layer is tuned for sensory contrast: from crisp chocolate shells to rich brownie bases and candied fruit treats.
          </p>

          <div className="pt-2 flex justify-center">
            <div className="h-10 w-[1px] bg-gradient-to-b from-caramel-500 to-transparent" />
          </div>
        </div>
      </section>

      {/* SECTION 2: SIGNATURE DESSERT SPOTLIGHT (The Layer Anatomy) */}
      {signatureProduct && (
        <section className="py-24 bg-white border-t border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Product Visual with Studio Photo */}
              <div className="lg:col-span-6 relative">
                <div className="relative h-[460px] sm:h-[540px] w-full rounded-3xl overflow-hidden border-2 border-stone-200 shadow-xl group">
                  <Image
                    src={signatureProduct.imageUrl}
                    alt={signatureProduct.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cocoa-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-caramel-400 bg-cocoa-950/90 px-3 py-1 rounded-full border border-stone-200">
                        Signature Creation
                      </span>
                      <h4 className="text-2xl font-serif font-black text-white mt-2">
                        {signatureProduct.name}
                      </h4>
                    </div>
                    <span className="text-2xl font-black text-caramel-400">
                      ₹{signatureProduct.salePrice || signatureProduct.basePrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Anatomy Breakdown */}
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs uppercase tracking-[0.25em] text-caramel-600 font-bold">
                  The Signature Experience
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-cocoa-950 tracking-tight leading-tight">
                  Not just dessert. <br />
                  <span className="text-caramel-600 italic">An unforgettable treat.</span>
                </h2>
                <p className="text-sm sm:text-base text-cocoa-900/80 font-normal leading-relaxed">
                  Break through the smooth dark chocolate shell and dive through velvety chocolate mousse straight into rich mud cake.
                </p>

                <div className="space-y-3.5 pt-2">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-caramel-500/20 text-caramel-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-cocoa-950">Break the Shell</p>
                      <p className="text-xs text-cocoa-800/70">Dark chocolate top layer that opens into decadent cake.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-caramel-500/20 text-caramel-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-cocoa-950">Velvety Mousse Layer</p>
                      <p className="text-xs text-cocoa-800/70">Smooth chocolate mousse that melts effortlessly on the tongue.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-caramel-500/20 text-caramel-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-cocoa-950">Rich Mud Cake Base</p>
                      <p className="text-xs text-cocoa-800/70">Decadent cocoa intensity baked to luscious fudgy perfection.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button
                    onClick={() => onSelectProduct(signatureProduct)}
                    className="px-8 py-3.5 rounded-full bg-cocoa-950 hover:bg-caramel-500 text-white hover:text-cocoa-950 font-bold uppercase tracking-wider text-xs shadow-xl shadow-cocoa-950/15 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <span>Order Dream Cake</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/menu/${signatureProduct.slug}`}
                    className="text-xs uppercase tracking-wider font-semibold text-cocoa-900/70 hover:text-cocoa-950"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: "CHOOSE YOUR CRAVING" MOOD DISCOVERY */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-caramel-600 font-bold">
            Interactive Taste Navigator
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-cocoa-950">
            What is your craving right now?
          </h2>
          <p className="text-sm text-cocoa-900/70 font-normal">
            Select your preferred sensory sensation to reveal the tailor-made dessert.
          </p>
        </div>

        {/* Mood Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {CRAVING_MOODS.map((mood) => {
            const isActive = mood.id === activeMoodId;
            return (
              <button
                key={mood.id}
                onClick={() => setActiveMoodId(mood.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-cocoa-950 text-white shadow-lg shadow-cocoa-950/15 scale-105"
                    : "bg-white hover:bg-caramel-50 border border-stone-200 text-cocoa-900/80 shadow-sm"
                }`}
              >
                {mood.mood}
              </button>
            );
          })}
        </div>

        {/* Selected Mood Card Highlight */}
        <div className="bg-white border border-stone-200 shadow-[0_10px_30px_rgba(36,19,15,0.06)] rounded-3xl p-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 relative h-64 rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
            <Image
              src={activeMoodProduct.imageUrl}
              alt={activeMood.dessertName}
              fill
              className="object-cover"
            />
            <div className="absolute top-3 left-3 bg-cocoa-950/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-caramel-400 uppercase tracking-widest border border-stone-200">
              {activeMood.tag}
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-caramel-600 font-bold uppercase tracking-wider">
                {activeMood.title}
              </span>
              <h3 className="text-2xl font-serif font-black text-cocoa-950">
                {activeMood.dessertName}
              </h3>
            </div>
            <p className="text-sm text-cocoa-900/80 font-normal leading-relaxed">
              {activeMood.description}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xl font-black text-cocoa-950">
                ₹{activeMoodProduct.salePrice || activeMoodProduct.basePrice}
              </span>
              <button
                onClick={() => onSelectProduct(activeMoodProduct)}
                className="px-6 py-2.5 rounded-full bg-cocoa-950 hover:bg-caramel-500 text-white hover:text-cocoa-950 font-bold uppercase tracking-wider text-xs transition-transform active:scale-95 shadow-md shadow-cocoa-950/15"
              >
                Add to Craving List
              </button>
              <Link
                href={`/menu/${activeMoodProduct.slug}`}
                className="text-xs uppercase tracking-wider font-semibold text-cocoa-900/70 hover:text-cocoa-950"
              >
                Recipe Notes →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CLASSIC VS BALANCED CUSTOMIZATION BREAKDOWN */}
      <section className="py-24 bg-white border-t border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-[0.25em] text-caramel-600 font-bold">
              Customized For Your Palate
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-cocoa-950">
              Classic vs. Balanced Indulgence
            </h2>
            <p className="text-sm text-cocoa-900/70 font-normal">
              We believe great chocolate respects individual tastes. Pick the intensity that suits you best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Classic Card */}
            <div
              onClick={() => setActiveCustomization("CLASSIC")}
              className={`p-8 rounded-3xl border transition-all cursor-pointer relative ${
                activeCustomization === "CLASSIC"
                  ? "bg-white border-caramel-500 shadow-xl scale-[1.02] ring-2 ring-caramel-500/20"
                  : "bg-white border-stone-200 hover:border-caramel-400/50 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-200/60">
                <div>
                  <span className="text-xs uppercase font-mono tracking-wider text-caramel-600 font-bold">
                    Signature Style
                  </span>
                  <h3 className="text-2xl font-serif font-black text-cocoa-950">Classic Indulgence</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-caramel-500/20 text-caramel-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-cocoa-900/80 font-normal leading-relaxed mt-4">
                Rich, buttery, unapologetic dessert sweetness. Perfect for celebrations, cheat days, and late-night sugar fixes.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-cocoa-800/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-caramel-600 shrink-0" />
                  <span>Balanced milk & dark cocoa blend</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-caramel-600 shrink-0" />
                  <span>Silky sweet ganache ribbon finish</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-caramel-600 shrink-0" />
                  <span>Sweet crunch feuilletine topping</span>
                </li>
              </ul>
            </div>

            {/* Balanced Card */}
            <div
              onClick={() => setActiveCustomization("BALANCED")}
              className={`p-8 rounded-3xl border transition-all cursor-pointer relative ${
                activeCustomization === "BALANCED"
                  ? "bg-white border-caramel-500 shadow-xl scale-[1.02] ring-2 ring-caramel-500/20"
                  : "bg-white border-stone-200 hover:border-caramel-400/50 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-200/60">
                <div>
                  <span className="text-xs uppercase font-mono tracking-wider text-caramel-600 font-bold">
                    Connoisseur Style
                  </span>
                  <h3 className="text-2xl font-serif font-black text-cocoa-950">Balanced Cocoa</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-strawberry-500/20 text-strawberry-600 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-cocoa-900/80 font-normal leading-relaxed mt-4">
                Lower sweetness profile highlighting deep dark cocoa notes. Clean, satisfying chocolate finish.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-cocoa-800/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-caramel-600 shrink-0" />
                  <span>Deep roasted dark cocoa</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-caramel-600 shrink-0" />
                  <span>Balanced sweetness</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-caramel-600 shrink-0" />
                  <span>Roasted cocoa nib & sea salt accent</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: SOURCING & CLOUD KITCHEN CRAFTSMANSHIP */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-stone-200 space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-caramel-500/20 text-caramel-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif font-bold text-cocoa-950">Quality Cocoa</h3>
            <p className="text-xs text-cocoa-900/70 leading-relaxed font-normal">
              Selected chocolate and cocoa butter carefully balanced for rich depth, smooth texture, and full dessert flavour.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-stone-200 space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-caramel-500/20 text-caramel-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif font-bold text-cocoa-950">Dedicated Kitchen</h3>
            <p className="text-xs text-cocoa-900/70 leading-relaxed font-normal">
              Prepared with care in our dedicated dessert kitchen to ensure every creation looks and tastes wonderful.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-stone-200 space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-caramel-500/20 text-caramel-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif font-bold text-cocoa-950">Protective Packaging</h3>
            <p className="text-xs text-cocoa-900/70 leading-relaxed font-normal">
              Sturdy, secure presentation boxes keep your desserts protected and neat from our kitchen to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: CUSTOMER REVIEWS & PRAISE */}
      <section className="py-24 bg-white dark:bg-cocoa-950 border-t border-b border-stone-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-[0.25em] text-caramel-600 dark:text-caramel-400 font-bold">
              Loved By 1,200+ Dessert Enthusiasts
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-cocoa-950 dark:text-cream-100">
              The Word On The Street
            </h2>
            <div className="flex items-center justify-center gap-1 text-caramel-500 pt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-caramel-500 text-caramel-500" />
              ))}
              <span className="text-xs font-mono font-bold text-cocoa-950 dark:text-cream-200 ml-2">4.9 / 5.0 Rating</span>
            </div>
          </div>

          {/* 3D Customer Loved Chocolate Atelier */}
          <div className="rounded-3xl border border-stone-200 dark:border-white/10 bg-white dark:bg-cocoa-900 p-6 sm:p-8 shadow-sm overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-caramel-700 dark:text-caramel-400 bg-white dark:bg-cocoa-950 px-3 py-1 rounded-full border border-stone-200 dark:border-white/10 shadow-sm">
                  3D Sensory Atelier
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-cocoa-950 dark:text-cream-100 leading-tight">
                  Crafted to Crave. <br />
                  Celebrated by Thousands.
                </h3>
                <p className="text-xs sm:text-sm text-cocoa-900/80 dark:text-cream-200/80 leading-relaxed font-normal">
                  Watch rich chocolate ribbons and crisp chocolate pieces swirl in real-time. Every dessert is designed to satisfy your cravings.
                </p>
                <div className="pt-2">
                  <Link
                    href="/feedback"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cocoa-950 hover:bg-cocoa-900 dark:bg-caramel-500 dark:hover:bg-caramel-400 text-white dark:text-cocoa-950 text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-cocoa-950/15"
                  >
                    View 3D Feedback Experience & Reviews
                    <ArrowRight className="w-3.5 h-3.5 text-caramel-400 dark:text-cocoa-950" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-7 h-[360px] sm:h-[440px] rounded-2xl overflow-hidden relative border-2 border-stone-200 dark:border-white/10 bg-white dark:bg-cocoa-950 shadow-xl">
                <FloatingChocolateCanvas
                  variant="feedback"
                  className="h-full w-full"
                  cameraPosition={[0, 0.2, 5.8]}
                  badgeText="Live 3D • Grand Spiral Pouring, Splashing Bar & Chips"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white dark:bg-cocoa-900 border border-stone-200 dark:border-white/10 space-y-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex gap-1 text-caramel-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-caramel-500 text-caramel-500" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-cocoa-900/90 dark:text-cream-100 italic font-normal leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="border-t border-stone-200/60 dark:border-white/10 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-cocoa-950 dark:text-cream-100">{t.author}</p>
                    <p className="text-[11px] text-cocoa-800/60 dark:text-cream-300/70">{t.city}</p>
                  </div>
                  <span className="text-[10px] font-mono text-caramel-600 dark:text-caramel-400 font-bold uppercase">
                    {t.dessert}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/feedback"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-caramel-700 dark:text-caramel-400 hover:text-caramel-800 dark:hover:text-caramel-300 underline underline-offset-8 transition-colors"
            >
              Read All Verified Customer Reviews & Submit Your Own Feedback
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 8: INSTAGRAM SHOWCASE */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-caramel-600 font-bold">
              Captured by Dessert Lovers
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-cocoa-950">
              Too Good Not to Share.
            </h2>
          </div>

          <a
            href="https://instagram.com/chocii4u.official"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-stone-200 text-cocoa-950 hover:bg-cocoa-950 hover:text-white text-xs font-bold uppercase tracking-wider transition-all self-start md:self-auto shadow-sm"
          >
            <Instagram className="w-4 h-4 text-caramel-600" />
            Follow @chocii4u
          </a>
        </div>

        {/* Editorial Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
              title: "Crack Shell Moment",
              tag: "@chocii4u",
            },
            {
              src: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop",
              title: "Brownie Lava Flow",
              tag: "#DreamBowl",
            },
            {
              src: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800&auto=format&fit=crop",
              title: "Golden Fluted Churros",
              tag: "#ChocoChurros",
            },
            {
              src: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop",
              title: "Layered Can Cake",
              tag: "#CanCakeTopping",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-stone-200 shadow-sm"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa-950/80 via-cocoa-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-xs font-bold text-white">{item.title}</p>
                <p className="text-[11px] text-caramel-300 font-medium">{item.tag}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: HOMEPAGE FREQUENTLY ASKED QUESTIONS */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-caramel-600 font-bold">
            Curious Minds Want to Know
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-cocoa-950">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-stone-200 bg-white overflow-hidden transition-colors shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 text-cocoa-950 font-semibold text-sm sm:text-base hover:text-caramel-600 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-caramel-600 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-cocoa-900/80 font-normal leading-relaxed border-t border-stone-200/50 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/faq"
            className="text-xs uppercase tracking-wider font-bold text-caramel-600 hover:text-caramel-700 underline underline-offset-4"
          >
            View All FAQ & Allergen Details →
          </Link>
        </div>
      </section>

      {/* SECTION 10: FINAL CONVERSION */}
      <section className="py-24 sm:py-32 bg-white border-t border-stone-200 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-stone-200 text-[10px] font-bold uppercase tracking-widest text-caramel-700 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-caramel-500 animate-pulse" />
            3D Chocolate Cloud Kitchen Dispatch
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-cocoa-950 tracking-tight">
            Your Next Craving Is Calling.
          </h2>

          <p className="text-base sm:text-lg text-cocoa-900/80 max-w-xl mx-auto font-normal leading-relaxed">
            Order directly from our kitchen to get delicious desserts delivered to your doorstep in secure packaging.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/menu"
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-cocoa-950 hover:bg-caramel-500 text-white hover:text-cocoa-950 font-bold uppercase tracking-wider text-xs shadow-xl shadow-cocoa-950/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Order Your Desserts
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/track-order"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-caramel-50 text-cocoa-950 border border-stone-200 font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center shadow-sm"
            >
              Track Live Order
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
