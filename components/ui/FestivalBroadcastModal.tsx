"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  X,
  Gift,
  Copy,
  Check,
  Play,
  ArrowRight,
  Megaphone,
} from "lucide-react";

interface ActiveBroadcast {
  id: string;
  title: string;
  occasion: string;
  subject: string;
  message: string;
  mediaUrl?: string | null;
  mediaType?: "image" | "video" | null;
  offerCode?: string | null;
  discountText?: string | null;
  validTill?: string | null;
  ctaText?: string;
  ctaLink?: string;
}

export default function FestivalBroadcastModal() {
  const pathname = usePathname();
  const [broadcast, setBroadcast] = useState<ActiveBroadcast | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  // Skip rendering on any admin portal routes
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdminRoute) return;

    fetch("/api/broadcast/active")
      .then((res) => res.json())
      .then((data) => {
        if (data.hasActive && data.broadcast) {
          setBroadcast(data.broadcast);

          // Check if modal was already dismissed during this session
          try {
            const dismissedId = sessionStorage.getItem(`chocii_broadcast_seen_${data.broadcast.id}`);
            if (!dismissedId) {
              // Delay slightly for smooth page load experience
              const timer = setTimeout(() => {
                setIsOpen(true);
              }, 1200);
              return () => clearTimeout(timer);
            }
          } catch {}
        }
      })
      .catch(() => {});
  }, [isAdminRoute]);

  if (isAdminRoute || !broadcast) return null;

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(`chocii_broadcast_seen_${broadcast.id}`, "true");
    } catch {}
  };

  const handleCopyCode = () => {
    if (!broadcast.offerCode) return;
    navigator.clipboard.writeText(broadcast.offerCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Occasion styling helper
  let occasionBadge = "✨ Festive Greetings";
  let bgGradient = "from-caramel-600/30 to-cocoa-900";
  const occ = (broadcast.occasion || "").toUpperCase();
  if (occ.includes("DIWALI")) {
    occasionBadge = "🪔 Happy Diwali Celebrations";
    bgGradient = "from-amber-600/30 via-caramel-700/20 to-cocoa-950";
  } else if (occ.includes("EID")) {
    occasionBadge = "🌙 Eid Mubarak Wishes";
    bgGradient = "from-emerald-700/30 via-caramel-700/20 to-cocoa-950";
  } else if (occ.includes("CHRISTMAS")) {
    occasionBadge = "🎄 Merry Christmas & Happy Holidays";
    bgGradient = "from-rose-700/30 via-caramel-700/20 to-cocoa-950";
  } else if (occ.includes("NEW_YEAR") || occ.includes("NEW YEAR")) {
    occasionBadge = "🎆 Happy New Year Celebration";
    bgGradient = "from-purple-700/30 via-caramel-700/20 to-cocoa-950";
  } else if (occ.includes("HOLI")) {
    occasionBadge = "🎨 Happy Holi Celebrations";
    bgGradient = "from-pink-600/30 via-caramel-700/20 to-cocoa-950";
  } else if (occ.includes("OFFER")) {
    occasionBadge = "⚡ Exclusive Sweet Offer";
    bgGradient = "from-amber-700/30 via-caramel-800/20 to-cocoa-950";
  }

  return (
    <>
      {/* 1. Top Festive Announcement Ribbon (Fixed at the very top of storefront) */}
      {isBannerVisible && (
        <div className="relative z-40 bg-gradient-to-r from-cocoa-950 via-caramel-900 to-cocoa-950 text-cream-100 border-b border-caramel-500/30 px-3 py-2 text-xs sm:text-sm font-medium shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden truncate">
              <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-caramel-500/20 text-caramel-400">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              </span>
              <span className="font-semibold text-caramel-300 shrink-0">
                {occasionBadge}:
              </span>
              <span className="truncate text-cream-200">
                {broadcast.title}
              </span>
              {broadcast.offerCode && (
                <button
                  onClick={handleCopyCode}
                  className="hidden sm:inline-flex items-center gap-1 bg-caramel-500/20 hover:bg-caramel-500/30 text-caramel-200 border border-caramel-500/40 rounded-full px-2.5 py-0.5 text-[11px] font-mono tracking-wider transition-colors ml-1 shrink-0"
                  title="Click to copy coupon code"
                >
                  <Gift className="w-3 h-3 text-caramel-400" />
                  Code: <strong className="text-white">{broadcast.offerCode}</strong>
                  {copiedCode ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-caramel-400" />
                  )}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsOpen(true)}
                className="text-[11px] font-bold text-caramel-300 hover:text-white underline underline-offset-2 transition-colors whitespace-nowrap"
              >
                View Greeting & Deal
              </button>
              <button
                onClick={() => setIsBannerVisible(false)}
                className="text-white/60 hover:text-white p-0.5 transition-colors"
                title="Dismiss banner"
                aria-label="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Interactive Festive Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg bg-cocoa-950 border border-caramel-500/30 rounded-3xl overflow-hidden shadow-2xl text-cream-100 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/10"
              aria-label="Close greetings modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Scrollable Container */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {/* Media Section: Image or Video */}
              {broadcast.mediaUrl ? (
                <div className="relative w-full bg-black flex items-center justify-center overflow-hidden">
                  {broadcast.mediaType === "video" ? (
                    <video
                      src={broadcast.mediaUrl}
                      controls
                      autoPlay
                      muted
                      playsInline
                      loop
                      className="w-full max-h-64 object-cover"
                    />
                  ) : (
                    <img
                      src={broadcast.mediaUrl}
                      alt={broadcast.title}
                      className="w-full max-h-64 object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-cocoa-950 via-transparent to-transparent pointer-events-none" />
                </div>
              ) : (
                <div className={`p-6 bg-gradient-to-b ${bgGradient} text-center relative overflow-hidden`}>
                  <div className="inline-flex items-center gap-2 bg-caramel-500/20 border border-caramel-500/40 text-caramel-300 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    {occasionBadge}
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-black text-cream-100 tracking-wide mt-2">
                    {broadcast.title}
                  </h3>
                </div>
              )}

              {/* Content Card Body */}
              <div className="p-6 sm:p-7 space-y-4">
                {broadcast.mediaUrl && (
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-caramel-500/20 border border-caramel-500/40 text-caramel-300 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                      <Sparkles className="w-3 h-3" />
                      {occasionBadge}
                    </div>
                    <h3 className="font-serif text-2xl font-black text-cream-100 tracking-wide">
                      {broadcast.title}
                    </h3>
                  </div>
                )}

                {/* Message Body */}
                <div className="text-sm sm:text-base text-cream-200/90 leading-relaxed whitespace-pre-line font-sans">
                  {broadcast.message
                    .replace(/\{name\}/gi, "Foodie Friend")
                    .replace(/\{\{name\}\}/gi, "Foodie Friend")}
                </div>

                {/* Offer Coupon Card */}
                {broadcast.offerCode && (
                  <div className="bg-gradient-to-br from-cocoa-900 to-cocoa-950 border-2 border-dashed border-caramel-500/50 rounded-2xl p-4 sm:p-5 text-center space-y-2">
                    <div className="text-[11px] font-bold tracking-widest text-caramel-400 uppercase flex items-center justify-center gap-1.5">
                      <Gift className="w-3.5 h-3.5" />
                      Exclusive Festive Coupon
                    </div>
                    {broadcast.discountText && (
                      <div className="text-lg sm:text-xl font-black text-white font-serif">
                        {broadcast.discountText}
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <div className="bg-cocoa-950 border border-caramel-500/60 text-caramel-200 font-mono font-bold text-base sm:text-lg tracking-widest px-4 py-1.5 rounded-xl shadow-inner select-all">
                        {broadcast.offerCode}
                      </div>
                      <button
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-1.5 bg-caramel-500 hover:bg-caramel-400 text-cocoa-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-950" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    {broadcast.validTill && (
                      <div className="text-[11px] text-cream-300/60 font-mono pt-1">
                        ⏰ {broadcast.validTill}
                      </div>
                    )}
                  </div>
                )}

                {/* CTA Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={broadcast.ctaLink || "/#full-menu-section"}
                    onClick={handleClose}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-400 hover:to-caramel-500 text-cocoa-950 font-black text-sm tracking-wide px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-caramel-500/20 active:scale-98"
                  >
                    <span>{broadcast.ctaText || "Claim Sweet Treat"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={handleClose}
                    className="px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/5 text-xs text-cream-300 font-medium transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>

                <div className="text-center pt-1 text-[11px] text-cream-400/50">
                  chocii 4 u • “A Little Treat, Just for You.”
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
