"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("cravings_theme") as Theme | null;
      const initialTheme: Theme = savedTheme === "dark" ? "dark" : "light";

      setThemeState(initialTheme);
      applyThemeToDOM(initialTheme);
    } catch {
      // Fallback if localStorage is inaccessible
      applyThemeToDOM("light");
    }
    setMounted(true);
  }, []);

  const applyThemeToDOM = (newTheme: Theme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.remove("light");
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("cravings_theme", newTheme);
    } catch {}
    applyThemeToDOM(newTheme);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cravings_theme_changed", { detail: newTheme }));
    }
  };

  const toggleTheme = () => {
    const isCurrentlyDark =
      typeof document !== "undefined"
        ? document.documentElement.classList.contains("dark")
        : theme === "dark";

    const nextTheme: Theme = isCurrentlyDark ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
