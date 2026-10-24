"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import AmbientChocolateScene from "./AmbientChocolateScene";
import DessertFallback from "./DessertFallback";

interface FloatingChocolateCanvasProps {
  variant?: "ambient" | "spotlight" | "dessert" | "feedback";
  slideId?: number; // 1 | 2 | 3 | 4
  className?: string;
  cameraPosition?: [number, number, number];
  badgeText?: string;
}

export default function FloatingChocolateCanvas({
  variant = "ambient",
  slideId,
  className = "h-[360px] sm:h-[440px]",
  cameraPosition = [0, 0.8, 5],
  badgeText,
}: FloatingChocolateCanvasProps) {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (hasWebGL === false || prefersReducedMotion) {
    return <DessertFallback />;
  }

  return (
    <div className={`relative w-full flex items-center justify-center ${className}`}>
      {/* Ambient warm lighting halo for white background */}
      <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-caramel-500/10 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute w-52 h-52 rounded-full bg-amber-600/10 blur-2xl -z-10 translate-x-12 -translate-y-6 pointer-events-none" />

      <Suspense fallback={<DessertFallback />}>
        <Canvas
          shadows
          camera={{ position: cameraPosition, fov: 45 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <AmbientChocolateScene variant={variant} slideId={slideId} />
        </Canvas>
      </Suspense>

      {badgeText && (
        <div className="absolute bottom-3 right-4 pointer-events-none flex items-center gap-2 bg-white/95 backdrop-blur-md border border-[#EADCCE] text-cocoa-950 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-caramel-500 animate-ping" />
          <span>{badgeText}</span>
        </div>
      )}
    </div>
  );
}
