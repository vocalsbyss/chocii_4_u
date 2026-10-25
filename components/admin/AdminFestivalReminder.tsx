"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Megaphone, Tag, X } from "lucide-react";

export default function AdminFestivalReminder() {
  const [festival, setFestival] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/festivals/today")
      .then((res) => res.json())
      .then((data) => {
        if (data.festival) {
          setFestival(data.festival);
        }
      })
      .catch(() => {});
  }, []);

  if (!festival || dismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-caramel-500/20 via-cocoa-900 to-cocoa-900 border border-caramel-500/40 p-5 sm:p-6 shadow-xl animate-fadeIn">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-caramel-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cocoa-950/80 border border-caramel-500/30 flex items-center justify-center text-3xl shrink-0 shadow-inner">
            {festival.emoji}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-caramel-500/20 text-caramel-300 border border-caramel-500/40">
                {festival.isToday ? "Special Day Today" : "Upcoming Celebration"}
              </span>
              <span className="text-xs text-cream-300/60 font-medium">
                {festival.date}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-serif font-black text-cream-100 flex items-center gap-2">
              Today is {festival.name}! {festival.emoji}
            </h3>

            <p className="text-xs text-cream-200/80 max-w-2xl leading-relaxed">
              <span className="text-caramel-300 font-semibold">{festival.greeting}</span> —{" "}
              {festival.description}
            </p>

            <p className="text-xs font-semibold text-caramel-400 pt-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Do you want to do anything new or special for customers today?
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
          <Link
            href="/admin/broadcast"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-400 hover:to-caramel-500 text-cocoa-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-caramel-500/20 transition-all active:scale-95"
          >
            <Megaphone className="w-3.5 h-3.5" />
            Send Festival Wishes
          </Link>

          <Link
            href="/admin/coupons"
            className="px-4 py-2.5 rounded-xl bg-cocoa-950/80 hover:bg-cocoa-950 border border-caramel-500/40 hover:border-caramel-500 text-caramel-300 font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
          >
            <Tag className="w-3.5 h-3.5" />
            Create Festival Coupon
          </Link>

          <button
            onClick={() => setDismissed(true)}
            className="p-2 rounded-xl text-cream-300/40 hover:text-cream-100 hover:bg-white/5 transition-colors"
            title="Dismiss reminder"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
