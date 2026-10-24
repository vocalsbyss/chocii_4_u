"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import SlideDessertScene from "./SlideDessertScene";
import DessertFallback from "./DessertFallback";

interface SlideDessertCanvasProps {
  slideId: number; // 1 | 2 | 3 | 4
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
  interactiveBadge?: boolean;
}

export default function SlideDessertCanvas({
  slideId,
  className = "w-full h-full min-h-[460px] md:min-h-[580px]",
  cameraPosition = [0, 0.3, 6.2],
  fov = 48,
  interactiveBadge = true,
}: SlideDessertCanvasProps) {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    // Test WebGL availability safely
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // While detecting or if WebGL not supported or reduced motion requested, use fallback
  if (hasWebGL === false || prefersReducedMotion) {
    return <DessertFallback />;
  }

  return (
    <div className={`relative flex items-center justify-center bg-white ${className}`}>
      <Suspense fallback={<DessertFallback />}>
        <Canvas
          shadows
          camera={{ position: cameraPosition, fov }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <SlideDessertScene slideId={slideId} />
        </Canvas>
      </Suspense>

      {/* Floating 3D Interaction Pill */}
      {interactiveBadge && (
        <div className="absolute bottom-6 right-6 pointer-events-none hidden md:flex items-center gap-2 bg-white/95 backdrop-blur-md border border-[#EADCCE] text-cocoa-950 text-[11px] font-bold px-4 py-1.5 rounded-full shadow-md z-20">
          <span className="w-2 h-2 rounded-full bg-caramel-500 animate-ping" />
          <span>Full 3D Stage • Moving Pourings, Bars & Chips</span>
        </div>
      )}
    </div>
  );
}
