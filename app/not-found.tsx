import React from "react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { ArrowRight, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cocoa-950 text-cream-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-32 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-16 h-16 rounded-full bg-caramel-500/20 text-caramel-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase font-mono font-bold tracking-widest text-caramel-400 block">
            Error 404
          </span>

          <h1 className="text-4xl sm:text-5xl font-serif font-black text-cream-100 tracking-tight">
            Cravings Not Found
          </h1>

          <p className="text-xs sm:text-sm text-cream-200/70 font-light leading-relaxed">
            The dessert or page you are looking for has been devoured or moved to a new kitchen counter.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/menu"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-caramel-500 hover:bg-caramel-400 text-cocoa-950 font-bold uppercase tracking-wider text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Explore Signature Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-cream-100 font-bold uppercase tracking-wider text-xs border border-white/10 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
