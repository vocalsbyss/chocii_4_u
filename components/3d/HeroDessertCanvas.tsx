"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import HeroDessertScene from "./HeroDessertScene";
import DessertFallback from "./DessertFallback";

export default function HeroDessertCanvas() {
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
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] flex items-center justify-center">
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-caramel-500/10 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute w-64 h-64 rounded-full bg-amber-600/10 blur-2xl -z-10 translate-x-20 -translate-y-10 pointer-events-none" />

      <Suspense fallback={<DessertFallback />}>
        <Canvas
          shadows
          camera={{ position: [0, 1.2, 5.2], fov: 45 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <HeroDessertScene />
        </Canvas>
      </Suspense>

      {/* Floating 3D Interaction Badge */}
      <div className="absolute bottom-4 right-4 pointer-events-none hidden md:flex items-center gap-2 bg-white/95 backdrop-blur-md border border-stone-200 text-cocoa-900 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-md font-mono">
        <span className="w-2 h-2 rounded-full bg-caramel-500 animate-ping" />
        Interactive 3D • Drag to Rotate
      </div>
    </div>
  );
}
