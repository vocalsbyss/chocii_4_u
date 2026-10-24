"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid hydration mismatch by rendering placeholder with fixed dimensions
    return (
      <div className={`w-9 h-9 rounded-full bg-white/5 border border-white/10 ${className}`} />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? "Switch to warm cream light theme" : "Switch to dark chocolate theme"}
      title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      className={`relative p-2 rounded-full transition-all duration-300 active:scale-90 flex items-center justify-center ${
        isDark
          ? "bg-white/5 hover:bg-white/15 text-caramel-400 border border-white/10 shadow-sm"
          : "bg-cocoa-900/10 hover:bg-cocoa-900/20 text-cocoa-950 border border-cocoa-900/20 shadow-sm"
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-45 text-caramel-400" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12 text-cocoa-900" />
      )}
    </button>
  );
}
