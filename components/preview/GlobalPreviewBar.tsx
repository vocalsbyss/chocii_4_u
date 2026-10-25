"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Undo2, Check, ChevronUp, ChevronDown, Eye } from "lucide-react";
import { usePreview } from "./PreviewContext";

export default function GlobalPreviewBar() {
  const { isPreviewActive, undoPreview, makePermanent } = usePreview();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isPreviewActive) return null;

  const handleMakePermanent = async () => {
    setIsSubmitting(true);
    const success = await makePermanent();
    setIsSubmitting(false);
    if (success) {
      setStatusMessage("Applied officially for all visitors! Preview bar will now dismiss.");
      setTimeout(() => {
        setStatusMessage(null);
        window.location.reload();
      }, 1500);
    }
  };

  const handleUndo = async () => {
    setIsSubmitting(true);
    await undoPreview();
    setIsSubmitting(false);
    window.location.reload();
  };

  // Minimized Floating Pill Badge in bottom corner
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-cocoa-950/95 border border-caramel-500/50 text-cream-100 shadow-2xl backdrop-blur-md text-xs font-mono font-bold hover:scale-105 transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-caramel-400 animate-ping" />
          <Sparkles className="w-3.5 h-3.5 text-caramel-400" />
          <span>Preview Active</span>
          <ChevronUp className="w-3 h-3 text-caramel-300 ml-1" />
        </button>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50 bg-[#140b07]/95 border-b border-caramel-500/40 text-cream-100 backdrop-blur-lg px-3 sm:px-4 py-2 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Left: Indicator & Description */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-caramel-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-caramel-500" />
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-caramel-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-caramel-400" />
              Whole Website Preview:
            </span>
            <span className="text-cream-200 font-medium">
              CoolDock Scroll Transitions & Frosted Dock Active
            </span>
          </div>

          <span className="hidden xl:inline text-[11px] text-cream-300/60 pl-2 border-l border-white/10">
            Test any page, menu, or cart. Like it or undo anytime!
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 text-xs shrink-0">
          {statusMessage ? (
            <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              {statusMessage}
            </span>
          ) : (
            <>
              {/* Make Permanent Button */}
              <button
                type="button"
                onClick={handleMakePermanent}
                disabled={isSubmitting}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-[11px] flex items-center gap-1 shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Make Official for All</span>
              </button>

              {/* Undo / Revert Button */}
              <button
                type="button"
                onClick={handleUndo}
                disabled={isSubmitting}
                className="px-3 py-1.5 rounded-xl bg-cocoa-900/90 hover:bg-rose-950/80 border border-white/15 hover:border-rose-500/50 text-cream-200 hover:text-rose-200 font-bold text-[11px] flex items-center gap-1 transition-all active:scale-95 disabled:opacity-50"
              >
                <Undo2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Undo (Classic Site)</span>
              </button>

              {/* Minimize */}
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded-lg text-cream-300/60 hover:text-white hover:bg-white/5 transition-colors"
                title="Minimize preview bar"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
