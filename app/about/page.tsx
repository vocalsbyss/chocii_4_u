import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import FloatingChocolateCanvas from "@/components/3d/FloatingChocolateCanvas";
import { ArrowRight, Sparkles, ShieldCheck, Heart, Award, Flame } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story & Craft | chocii 4 u",
  description:
    "Learn about chocii 4 u: An Indian dessert cloud kitchen crafting delicious chocolate treats, layered cakes, churros, and dessert creations.",
  openGraph: {
    title: "Our Story & Craft | chocii 4 u",
    description:
      "A Little Treat, Just for You. Prepared in Visakhapatnam.",
    url: "https://chocii4u.com/about",
  },
  alternates: {
    canonical: "https://chocii4u.com/about",
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About chocii 4 u",
    description:
      "The story of chocii 4 u, an Indian dessert cloud kitchen crafting dream cakes, brownie bowls, golden churros, and candied fruits.",
    publisher: {
      "@type": "Organization",
      name: "chocii 4 u",
      url: "https://chocii4u.com",
      logo: "https://chocii4u.com/logo.png",
      sameAs: ["https://instagram.com/chocii4u.official"],
    },
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-cocoa-950 flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Hero Banner with 3D Chocolate Visual */}
          <section className="rounded-3xl border border-[#EADCCE] bg-gradient-to-b from-white via-[#FFFDF9] to-[#F5EEE6] p-8 sm:p-12 shadow-sm text-center space-y-6 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-caramel-500/10 border border-caramel-500/30 text-caramel-700 text-xs font-bold uppercase tracking-widest font-mono">
              <Sparkles className="w-3.5 h-3.5 text-caramel-600" />
              A Little Treat, Just for You.
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-cocoa-950 leading-tight">
              A Little Treat, <br />
              <span className="text-caramel-600 italic">Just for You.</span>
            </h1>

            <p className="text-base sm:text-lg text-cocoa-900/80 font-normal leading-relaxed max-w-2xl mx-auto">
              We started chocii 4 u with a simple belief: desserts shouldn't just be an afterthought at the end of a meal. They should be the main event.
            </p>

            {/* 3D Floating Chocolate Experience */}
            <div className="max-w-2xl mx-auto h-[220px] sm:h-[260px] rounded-2xl overflow-hidden relative border border-[#EADCCE] bg-white shadow-sm mt-6">
              <FloatingChocolateCanvas
                variant="ambient"
                className="h-full w-full"
                badgeText="Live 3D Chocolate Craft"
              />
            </div>
          </section>

          {/* Story Visual Split Section */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative">
              <div className="relative h-[420px] sm:h-[500px] w-full rounded-3xl overflow-hidden border-2 border-caramel-500/30 shadow-xl bg-[#FAF7F2]">
                <Image
                  src="/images/chocii-logo-orig.jpg"
                  alt="CHOCII 4 U Signature Artisanal Chocolate Sculpture"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa-950/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EADCCE] text-xs text-cocoa-950 shadow-md">
                  <span className="text-[10px] text-caramel-700 font-mono font-bold uppercase tracking-wider block">
                    The Signature Art of CHOCII 4 U
                  </span>
                  “A Little Treat, Just for You” • Prepared, assembled, and packed in Muralinagar, Madhavadhara, Visakhapatnam.
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-caramel-600 font-bold">
                Why We Started
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-cocoa-950 tracking-tight">
                Beyond the Ordinary Bakery
              </h2>
              <p className="text-sm sm:text-base text-cocoa-900/80 font-normal leading-relaxed">
                Many commercial desserts rely on heavy sugar and artificial flavors, which can easily overwhelm the true nuance of cocoa.
              </p>
              <p className="text-sm sm:text-base text-cocoa-900/80 font-normal leading-relaxed">
                We focus on delicious textures and rich cocoa flavor, giving customers the choice between our indulgent Classic sweetness and our deeper, less sweet Balanced option.
              </p>

              <div className="pt-2 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#EADCCE] shadow-sm">
                  <span className="text-2xl font-black text-caramel-600 font-mono">Chocii</span>
                  <p className="text-xs font-semibold text-cocoa-950 mt-1">Dedicated Kitchen</p>
                  <p className="text-[11px] text-cocoa-800/60">Crafted with care in Visakhapatnam.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#EADCCE] shadow-sm">
                  <span className="text-2xl font-black text-caramel-600 font-mono">Secure</span>
                  <p className="text-xs font-semibold text-cocoa-950 mt-1">Delivery Packaging</p>
                  <p className="text-[11px] text-cocoa-800/60">Delivered in protective food containers.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Pillars of Quality */}
          <section className="space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-caramel-600 font-bold">
                Uncompromising Standards
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-cocoa-950">
                Four Pillars of Our Kitchen
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-[#EADCCE] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-caramel-500/20 text-caramel-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-cocoa-950">Quality Cocoa</h3>
                <p className="text-xs text-cocoa-900/70 font-normal leading-relaxed">
                  We select rich chocolate and cocoa butter balanced for depth and smooth flavor.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#EADCCE] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-strawberry-500/20 text-strawberry-700 flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-cocoa-950">Fresh Preparation</h3>
                <p className="text-xs text-cocoa-900/70 font-normal leading-relaxed">
                  Churros and cakes prepared with care so they arrive tasting delightful.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#EADCCE] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-caramel-500/20 text-caramel-700 flex items-center justify-center font-bold">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-cocoa-950">Thoughtful Ingredients</h3>
                <p className="text-xs text-cocoa-900/70 font-normal leading-relaxed">
                  Quality vanilla, cocoa, dairy, and confectionery ingredients.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#EADCCE] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-cocoa-950">Protective Packaging</h3>
                <p className="text-xs text-cocoa-900/70 font-normal leading-relaxed">
                  Every order travels in secure, sturdy food-grade containers to protect your dessert during transit.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-cocoa-950 via-cocoa-900 to-cocoa-950 border border-caramel-500/30 text-center space-y-6 text-white shadow-xl shadow-cocoa-950/15">
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-white">
              Ready to experience the obsession?
            </h2>
            <p className="text-sm text-cream-200/80 font-normal max-w-xl mx-auto">
              Explore our five signature creations or order directly for express cloud kitchen delivery across Visakhapatnam.
            </p>
            <div className="pt-2 flex justify-center gap-4">
              <Link
                href="/menu"
                className="px-8 py-3.5 rounded-full bg-caramel-500 hover:bg-caramel-400 text-cocoa-950 font-bold uppercase tracking-wider text-xs shadow-xl shadow-caramel-500/20 transition-all flex items-center gap-2"
              >
                <span>View Full Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
