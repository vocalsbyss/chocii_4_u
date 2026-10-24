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
    return (
      <div className={`w-9 h-9 rounded-full bg-stone-200/40 border border-stone-300/40 ${className}`} />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      className={`relative w-9 h-9 rounded-full transition-all duration-300 active:scale-90 flex items-center justify-center shadow-sm cursor-pointer ${
        isDark
          ? "bg-[#2A140F] hover:bg-[#361D17] text-amber-300 border border-caramel-500/40"
          : "bg-stone-100 hover:bg-stone-200 text-cocoa-950 border border-stone-300"
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-45 text-amber-300" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12 text-cocoa-900" />
      )}
    </button>
  );
}
