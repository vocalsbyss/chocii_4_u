"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, disable transform sliding and only use subtle instant fade
  if (shouldReduceMotion) {
    return (
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="w-full"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Subtle Luxury Golden Caramel Progress Glide on Page Transition */}
      <motion.div
        key={`progress-${pathname}`}
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1],
          opacity: { delay: 0.35, duration: 0.2 },
        }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-caramel-600 via-caramel-400 to-amber-300 origin-left z-[9999] pointer-events-none"
      />

      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 14, scale: 0.996 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.996 }}
        transition={{
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1], // Custom luxury bezier
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
