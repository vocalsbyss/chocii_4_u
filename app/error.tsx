"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, ArrowRight, Utensils, MessageCircle, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("chocii 4 u application error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cocoa-950 text-cream-100 flex flex-col justify-center items-center px-4 py-16 font-sans relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-caramel-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-cocoa-900/80 border border-caramel-500/20 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6 relative z-10">
        <div className="w-16 h-16 mx-auto rounded-full bg-caramel-500/20 text-caramel-400 flex items-center justify-center border border-caramel-500/30">
          <Utensils className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-caramel-400 font-bold block">
            Kitchen Recalibrating
          </span>
          <h1 className="text-3xl font-serif font-black text-cream-100">
            A Little Hiccup in the Kitchen
          </h1>
          <p className="text-sm text-cream-200/70 leading-relaxed font-light">
            We encountered a momentary delay preparing your sweet treats. Don&apos;t worry, your selections and bag are safe.
          </p>
        </div>

        {error?.digest && (
          <p className="text-[10px] font-mono text-cream-300/40 bg-cocoa-950/80 py-1.5 px-3 rounded-lg border border-white/5 inline-block">
            Ref: {error.digest}
          </p>
        )}

        <div className="space-y-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full py-3.5 px-6 rounded-full bg-caramel-500 hover:bg-caramel-400 text-cocoa-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/menu"
            className="w-full py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/15 text-cream-100 font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <span>Browse Dessert Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10 text-xs text-cream-300/70">
            <Link
              href="/"
              className="hover:text-caramel-400 transition-colors flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span>•</span>
            <a
              href="https://wa.me/918688367177?text=Hi%20chocii%204%20u,%20I%20need%20help%20with%20an%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-caramel-400 transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Kitchen</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
