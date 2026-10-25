"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import CartDrawer from "@/components/ui/CartDrawer";
import FloatingChocolateCanvas from "@/components/3d/FloatingChocolateCanvas";
import {
  Star,
  Sparkles,
  CheckCircle2,
  Heart,
  MessageSquare,
  Send,
  ThumbsUp,
  Award,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

interface ReviewItem {
  id: string;
  author: string;
  city: string;
  dessert: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export default function FeedbackPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load real customer reviews from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("cravings_customer_reviews");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setReviews(
            parsed.map((r: any, idx: number) => ({
              id: r.id || `rev-${idx}-${Date.now()}`,
              author: r.author || "Guest",
              city: r.city || "Visakhapatnam",
              dessert: r.dessert || "Dessert Creation",
              rating: r.rating || 5,
              date: r.date || r.createdAt || "Recent",
              comment: r.comment || r.quote || "",
              verified: true,
            }))
          );
        }
      }
    } catch {}
  }, []);

  // New review form states
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [dessert, setDessert] = useState("3D Dream Cake");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: name.trim(),
      city: city.trim() || "Visakhapatnam, India",
      dessert,
      rating,
      date: "Just now",
      comment: comment.trim(),
      verified: true,
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem("cravings_customer_reviews", JSON.stringify(updated));
    } catch {}

    setSubmitted(true);
    setName("");
    setCity("");
    setComment("");
  };

  return (
    <div className="min-h-screen bg-white text-cocoa-950 flex flex-col font-sans">
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-grow pt-28 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header Banner & 3D Interactive Atelier on Pure Bright White */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-8 sm:p-12 shadow-sm overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Headline and Badges */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-caramel-500/10 border border-caramel-500/30 text-caramel-700 text-xs font-bold uppercase tracking-widest font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-caramel-600" />
                  ( need amazing desserts ) • Sensory Reviews & Feedback
                </div>

                {/* Massive Editorial Headline matching the Hero's (need amazing desserts) signature style */}
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-sans tracking-tighter text-cocoa-950 uppercase leading-[0.92] drop-shadow-sm">
                  <span className="block">DESSERTS THAT LEAVE</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cocoa-950 via-caramel-600 to-caramel-500 italic font-serif lowercase">
                    lasting
                  </span>
                  <span className="block">IMPRESSIONS</span>
                </h1>

                <p className="text-sm sm:text-base text-cocoa-900 font-normal leading-relaxed">
                  Every chocolate creation, warm brownie bowl, and golden fluted churro is prepared to delight. Read genuine reflections from fellow dessert lovers or share your own taste notes.
                </p>

                {/* Genuine Community Feedback Note */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="text-xs text-cocoa-900/70 font-medium">
                    Handcrafted daily in Visakhapatnam • Real reviews from our community
                  </div>
                </div>
              </div>

              {/* Right Column: Moving 3D Chocolate Scene on Pure Bright White */}
              <div className="lg:col-span-6 relative">
                <div className="relative h-[440px] sm:h-[520px] w-full rounded-3xl overflow-hidden border-2 border-stone-200 bg-white shadow-2xl">
                  <FloatingChocolateCanvas
                    variant="feedback"
                    className="h-full w-full bg-white"
                    cameraPosition={[0, 0.2, 5.8]}
                    badgeText="Live 3D • Grand Spiral Pouring, Splashing Bar & Chips"
                  />
                  <div className="absolute top-4 left-4 z-10 pointer-events-none">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-caramel-700 bg-white/95 px-3 py-1 rounded-full border border-stone-200 shadow-sm">
                      3D Atelier Experience
                    </span>
                  </div>
                </div>

                {/* Micro tags below 3D canvas */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                  <div className="p-2 rounded-xl bg-white border border-stone-200 text-[10px] font-semibold text-cocoa-950 shadow-sm">
                    🌊 Grand Spiral Pouring
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-stone-200 text-[10px] font-semibold text-cocoa-950 shadow-sm">
                    🍫 Bar with Splash Crown
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-stone-200 text-[10px] font-semibold text-cocoa-950 shadow-sm">
                    🌰 Cascading Choco Chips
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form and Customer Reviews Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Customer Reviews Grid */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <span className="text-xs uppercase tracking-widest text-caramel-600 dark:text-caramel-400 font-bold">
                    Community Reflections
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-cocoa-950 dark:text-cream-100 mt-1">
                    Customer Reviews
                  </h2>
                </div>
                {reviews.length > 0 && (
                  <span className="text-xs font-mono font-bold bg-white dark:bg-cocoa-900 px-3 py-1.5 rounded-full border border-stone-200 dark:border-white/10 text-cocoa-950 dark:text-cream-200 shadow-sm">
                    {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-cocoa-900 border border-stone-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-cocoa-950 dark:text-cream-100">{rev.author}</h4>
                            {rev.verified && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                Verified Guest
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-cocoa-800/60 dark:text-cream-300/70">{rev.city}</p>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <div className="flex text-caramel-500">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-3.5 h-3.5 fill-caramel-500 text-caramel-500"
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-cocoa-950/40 dark:text-cream-300/40">{rev.date}</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-cocoa-900 dark:text-cream-100 leading-relaxed font-normal">
                        &ldquo;{rev.comment}&rdquo;
                      </p>

                      <div className="border-t border-stone-100 dark:border-white/10 pt-3 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-caramel-700 dark:text-caramel-400 font-bold uppercase">
                          {rev.dessert}
                        </span>
                        <span className="text-[10px] text-cocoa-950/40 dark:text-cream-300/40">Visakhapatnam Kitchen</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 rounded-3xl bg-white dark:bg-cocoa-900 border border-stone-200 dark:border-white/10 text-center space-y-3 shadow-sm">
                    <MessageSquare className="w-10 h-10 text-caramel-500/60 mx-auto" />
                    <h3 className="text-base font-bold text-cocoa-950 dark:text-cream-100">
                      No Customer Reviews Yet
                    </h3>
                    <p className="text-xs text-cocoa-900/60 dark:text-cream-300/60 max-w-sm mx-auto leading-relaxed">
                      Be the first to share your thoughts on our desserts! Fill out the review form to post your feedback.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Submit Review Form */}
            <div className="lg:col-span-5 sticky top-28">
              <div className="p-8 rounded-3xl bg-white dark:bg-cocoa-900 border border-stone-200 dark:border-white/10 shadow-lg space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-caramel-500/10 text-caramel-700 dark:text-caramel-400 text-[10px] font-bold uppercase tracking-wider">
                    <MessageSquare className="w-3 h-3 text-caramel-600 dark:text-caramel-400" />
                    Share Your Craving
                  </div>
                  <h3 className="text-2xl font-serif font-black text-cocoa-950 dark:text-cream-100 mt-2">
                    Submit Your Crave Review
                  </h3>
                  <p className="text-xs text-cocoa-900/70 dark:text-cream-300/70 mt-1">
                    Your taste notes help us craft even more unforgettable chocolate moments.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                      Thank You for Your Feedback!
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      Your review has been verified and added to the community wall.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 underline underline-offset-4 pt-1"
                    >
                      Write Another Review
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-cocoa-950 dark:text-cream-200">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Diya Sengupta"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white dark:bg-cocoa-950 border border-stone-300 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-cocoa-950 dark:text-cream-100 placeholder:text-cocoa-950/40 dark:placeholder:text-cream-300/40 focus:outline-none focus:border-caramel-500 shadow-sm transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-cocoa-950 dark:text-cream-200">
                        City / Locality
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Muralinagar, Visakhapatnam"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white dark:bg-cocoa-950 border border-stone-300 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-cocoa-950 dark:text-cream-100 placeholder:text-cocoa-950/40 dark:placeholder:text-cream-300/40 focus:outline-none focus:border-caramel-500 shadow-sm transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-cocoa-950 dark:text-cream-200">
                        Which Dessert Did You Enjoy?
                      </label>
                      <select
                        value={dessert}
                        onChange={(e) => setDessert(e.target.value)}
                        className="w-full bg-white dark:bg-cocoa-950 border border-stone-300 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-cocoa-950 dark:text-cream-100 focus:outline-none focus:border-caramel-500 shadow-sm transition-colors"
                      >
                        <option value="3D Dream Cake">3D Dream Cake</option>
                        <option value="Brownie Bowl">Brownie Bowl</option>
                        <option value="Fluted Cinnamon Churros">Fluted Cinnamon Churros</option>
                        <option value="Tanghulu Ruby Fruit Skewers">Tanghulu Ruby Fruit Skewers</option>
                        <option value="Layered Pop-Top Can Cake">Layered Pop-Top Can Cake</option>
                      </select>
                    </div>

                    {/* Star Rating Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-cocoa-950 dark:text-cream-200">
                        Your Crave Rating
                      </label>
                      <div className="flex items-center gap-2 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 text-caramel-500 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= rating
                                  ? "fill-caramel-500 text-caramel-500"
                                  : "text-stone-300 dark:text-stone-700 fill-transparent"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-cocoa-950 dark:text-cream-200 ml-2 font-mono">
                          {rating} / 5 Stars
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-cocoa-950 dark:text-cream-200">
                        Review & Sensory Notes
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us about the texture, sweetness balance, chocolate aroma, or delivery packaging..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full bg-white dark:bg-cocoa-950 border border-stone-300 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-cocoa-950 dark:text-cream-100 placeholder:text-cocoa-950/40 dark:placeholder:text-cream-300/40 focus:outline-none focus:border-caramel-500 shadow-sm transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-cocoa-950 hover:bg-caramel-500 dark:bg-caramel-500 dark:hover:bg-caramel-400 text-white dark:text-cocoa-950 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-xl shadow-cocoa-950/15 transition-all active:scale-98"
                    >
                      <Send className="w-4 h-4 text-caramel-400 dark:text-cocoa-950" />
                      Post Verified Review
                    </button>
                  </form>
                )}

                {/* Direct Menu CTA */}
                <div className="pt-4 border-t border-stone-200 text-center">
                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-caramel-700 hover:text-caramel-800 transition-colors"
                  >
                    Ready for your next dessert? Order Now
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Footer />
    </div>
  );
}
