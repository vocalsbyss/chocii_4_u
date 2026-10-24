"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search, Sparkles, MessageCircle } from "lucide-react";

interface FaqItem {
  category: string;
  question: string;
  answer: string;
}

export default function ClientFaqPage({ faqItems }: { faqItems: FaqItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = ["All", ...Array.from(new Set(faqItems.map((f) => f.category)))];

  const filteredFaqs = faqItems.filter((f) => {
    const matchesCat = selectedCategory === "All" || f.category === selectedCategory;
    const matchesQuery =
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-caramel-500/10 border border-caramel-500/30 text-caramel-700 text-[11px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3 h-3 text-caramel-600" />
          Everything You Need to Know
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-cocoa-950 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-cocoa-900/80 font-normal max-w-xl mx-auto">
          From dessert ingredients to delivery packaging and storage advice.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cocoa-950/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions (e.g. ingredients, storage, reheat, nuts)..."
          className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white border border-[#EADCCE] text-cocoa-950 text-sm focus:outline-none focus:border-caramel-500 transition-colors shadow-sm placeholder:text-cocoa-950/40"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              selectedCategory === cat
                ? "bg-cocoa-950 text-white font-bold shadow-md shadow-cocoa-950/15"
                : "bg-white hover:bg-caramel-50 text-cocoa-900/80 border border-[#EADCCE] shadow-sm"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="py-12 text-center text-cocoa-800/60 text-xs bg-white rounded-2xl border border-[#EADCCE]">
            No questions matched your search query. Try searching for "ingredients" or "delivery".
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#EADCCE] bg-white overflow-hidden transition-colors shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 text-cocoa-950 font-semibold text-sm sm:text-base hover:text-caramel-700 transition-colors"
                >
                  <span className="flex-1">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-caramel-600 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-cocoa-900/80 font-normal leading-relaxed border-t border-[#EADCCE]/50 pt-4">
                    <p>{faq.answer}</p>
                    <div className="mt-3">
                      <span className="text-[10px] font-mono text-caramel-700 font-bold uppercase tracking-wider bg-caramel-50 px-2.5 py-0.5 rounded-full border border-caramel-200">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still Have Questions Banner */}
      <div className="p-8 rounded-3xl bg-white border border-[#EADCCE] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-sm">
        <div>
          <h4 className="text-lg font-bold text-cocoa-950">Still have a question?</h4>
          <p className="text-xs text-cocoa-900/70 font-normal mt-1">
            Our kitchen team is available on WhatsApp daily from 12 PM to 1 AM.
          </p>
        </div>
        <Link
          href="/contact"
          className="px-6 py-3 rounded-full bg-cocoa-950 hover:bg-cocoa-900 text-white font-bold uppercase tracking-wider text-xs shadow-md transition-transform active:scale-95 shrink-0"
        >
          Contact Kitchen
        </Link>
      </div>
    </div>
  );
}
