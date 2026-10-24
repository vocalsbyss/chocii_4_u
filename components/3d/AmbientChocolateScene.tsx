"use client";

import React from "react";
import {
  ChocolateBarWithSplash,
  CascadingChocoChips,
} from "./ChocolateElements";
import SlideDessertScene from "./SlideDessertScene";

interface AmbientChocolateSceneProps {
  variant?: "ambient" | "spotlight" | "dessert" | "feedback";
  slideId?: number; // 1 | 2 | 3 | 4
}

export default function AmbientChocolateScene({
  variant = "ambient",
  slideId,
}: AmbientChocolateSceneProps) {
  // If a dessert slideId is specified, render the full centerpiece with spiral pourings, bars, and chips
  if (slideId) {
    return <SlideDessertScene slideId={slideId} />;
  }

  if (variant === "feedback") {
    return (
      <group position={[0, 0, 0]}>
        {/* Bright Studio Lighting */}
        <ambientLight intensity={2.2} color="#FFFFFF" />
        <directionalLight position={[6, 9, 6]} intensity={3.8} color="#FFFDF9" castShadow />
        <directionalLight position={[-6, 4, -5]} intensity={2.2} color="#E5AF7B" />
        <pointLight position={[0, 2, 3]} intensity={3.0} color="#FFF6EA" />

        {/* 8-Square Chocolate Bars with Splash Crown */}
        <ChocolateBarWithSplash
          position={[-2.4, 0.6, 0.4]}
          rotation={[0.3, 0.6, -0.2]}
          scale={0.82}
          speed={0.9}
          showSplash={true}
        />
        <ChocolateBarWithSplash
          position={[2.3, -0.8, 0.5]}
          rotation={[-0.4, -0.5, 0.3]}
          scale={0.76}
          speed={1.05}
          showSplash={true}
        />

        {/* Cascading Choco Chips and Shards Swarm */}
        <CascadingChocoChips count={34} radius={3.2} height={10.0} speed={1.0} />
      </group>
    );
  }

  if (variant === "spotlight") {
    return (
      <group position={[0, 0, 0]}>
        <ambientLight intensity={2.2} color="#FFFFFF" />
        <directionalLight position={[6, 9, 6]} intensity={3.8} color="#FFFDF9" castShadow />
        <directionalLight position={[-6, 4, -5]} intensity={2.2} color="#E5AF7B" />
        <pointLight position={[0, 3, 3]} intensity={3.0} color="#FFF6EA" />

        {/* 8-Square Chocolate Bars with Splash Crown */}
        <ChocolateBarWithSplash
          position={[-2.2, 0.8, 0.4]}
          rotation={[0.35, -0.4, 0.3]}
          scale={0.85}
          speed={0.9}
          showSplash={true}
        />
        <ChocolateBarWithSplash
          position={[2.2, -0.6, 0.3]}
          rotation={[-0.3, 0.5, -0.2]}
          scale={0.8}
          speed={1.1}
          showSplash={true}
        />

        {/* Cascading Choco Chips */}
        <CascadingChocoChips count={30} radius={3.0} height={9.5} speed={1.1} />
      </group>
    );
  }

  // Default "ambient" scene (for section backgrounds and banners)
  return (
    <group position={[0, 0, 0]}>
      <ambientLight intensity={2.0} color="#FFFFFF" />
      <directionalLight position={[5, 7, 5]} intensity={3.4} color="#FFFDF9" />
      <directionalLight position={[-5, 3, -4]} intensity={1.8} color="#E5AF7B" />

      {/* Floating 8-Square Chocolate Bars with Splash */}
      <ChocolateBarWithSplash
        position={[-2.2, 0.5, 0.2]}
        rotation={[0.4, -0.5, 0.4]}
        scale={0.78}
        speed={0.9}
        showSplash={true}
      />
      <ChocolateBarWithSplash
        position={[2.1, -0.5, 0.3]}
        rotation={[-0.35, 0.6, -0.3]}
        scale={0.72}
        speed={1.0}
        showSplash={true}
      />

      {/* Cascading Teardrop Choco Chips & Shards */}
      <CascadingChocoChips count={28} radius={3.0} height={9.0} speed={0.95} />
    </group>
  );
}
