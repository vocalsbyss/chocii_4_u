"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  ChocolateBarWithSplash,
  CascadingChocoChips,
} from "./ChocolateElements";

interface SlideDessertSceneProps {
  slideId: number; // 1, 2, 3, or 4
}

// ============================================================
// SLIDE 1 CENTERPIECE: SIGNATURE DREAM CAKE
// ============================================================
function DreamCakeCenterpiece() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.35;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.1;
  });

  return (
    <group ref={group}>
      {/* Bottom Sponge Tier */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.55, 0.8, 64]} />
        <meshPhysicalMaterial color="#824B30" roughness={0.65} metalness={0.1} />
      </mesh>

      {/* Top Mud Tier */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.15, 1.2, 0.8, 64]} />
        <meshPhysicalMaterial color="#7A442A" roughness={0.5} metalness={0.15} />
      </mesh>

      {/* Dark Chocolate Shell Top */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[1.16, 1.16, 0.05, 64]} />
        <meshPhysicalMaterial
          color="#884F33"
          roughness={0.06}
          metalness={0.35}
          clearcoat={1.0}
        />
      </mesh>

      {/* Shell Drips */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <mesh
            key={deg}
            position={[Math.cos(rad) * 1.15, 0.65 - (i % 2) * 0.1, Math.sin(rad) * 1.15]}
          >
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshPhysicalMaterial color="#884F33" roughness={0.08} metalness={0.3} clearcoat={1.0} />
          </mesh>
        );
      })}

      {/* Truffles on top */}
      {[
        { pos: [0.4, 0.82, 0.3], color: "#9E5E3D", r: 0.18 },
        { pos: [-0.4, 0.82, 0.25], color: "#B2724D", r: 0.17 },
        { pos: [0, 0.82, -0.4], color: "#E5B278", r: 0.16 }, // Gold Truffle
      ].map((t, idx) => (
        <mesh key={idx} position={t.pos as [number, number, number]}>
          <sphereGeometry args={[t.r, 24, 24]} />
          <meshPhysicalMaterial color={t.color} roughness={0.25} metalness={0.3} clearcoat={0.9} />
        </mesh>
      ))}

      {/* 24K Gold Medallion */}
      <mesh position={[0, 0.88, 0]} rotation={[-Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.03, 32]} />
        <meshPhysicalMaterial color="#E5B278" roughness={0.15} metalness={0.85} clearcoat={1.0} />
      </mesh>
    </group>
  );
}

// ============================================================
// SLIDE 2 CENTERPIECE: BROWNIE BOWL
// ============================================================
function DreamBowlCenterpiece() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.3;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.08;
  });

  return (
    <group ref={group} position={[0, -0.3, 0]}>
      {/* Ceramic Dessert Bowl */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.7, 1.0, 1.0, 64, 1, true]} />
        <meshPhysicalMaterial color="#FAF5EE" roughness={0.18} metalness={0.05} side={THREE.DoubleSide} clearcoat={0.8} />
      </mesh>
      {/* Bowl Base */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.08, 64]} />
        <meshPhysicalMaterial color="#E8E0D5" roughness={0.2} />
      </mesh>

      {/* Baked Brownie Core */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[1.45, 1.35, 0.65, 48]} />
        <meshPhysicalMaterial color="#7C462C" roughness={0.75} metalness={0.05} />
      </mesh>

      {/* Ganache Sauce Pool */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.08, 48]} />
        <meshPhysicalMaterial color="#8A4E31" roughness={0.06} metalness={0.3} clearcoat={1.0} />
      </mesh>

      {/* Crispy Feuilletine Crunchy Pearls */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <mesh
            key={deg}
            position={[Math.cos(rad) * 0.85, 0.44, Math.sin(rad) * 0.85]}
          >
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshPhysicalMaterial color="#C58A55" roughness={0.2} metalness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

// ============================================================
// SLIDE 3 CENTERPIECE: CRISPY FLUTED CHURROS & DIPS
// ============================================================
function ChurrosCenterpiece() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.3;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.3) * 0.09;
  });

  return (
    <group ref={group}>
      {/* 3 Golden Cinnamon Churro Sticks */}
      {[-0.6, 0, 0.6].map((xOffset, i) => (
        <group
          key={i}
          position={[xOffset, 0.2, (i % 2) * 0.15]}
          rotation={[0.1, 0, (i - 1) * -0.2]}
        >
          {/* Main Fluted Churro Body */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.18, 0.18, 2.8, 16]} />
            <meshPhysicalMaterial color="#C0843E" roughness={0.65} metalness={0.05} />
          </mesh>
          {/* Dark Chocolate Dip Coating (Top 35%) */}
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.19, 0.19, 1.0, 16]} />
            <meshPhysicalMaterial color="#854C2F" roughness={0.06} metalness={0.25} clearcoat={1.0} />
          </mesh>
        </group>
      ))}

      {/* Ceramic Dipping Pots */}
      <group position={[0, -1.2, 0.5]}>
        {/* Dark Chocolate Dip Pot */}
        <mesh position={[-0.8, 0, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.45, 0.5, 32]} />
          <meshPhysicalMaterial color="#854C2F" roughness={0.06} metalness={0.25} clearcoat={1.0} />
        </mesh>
        {/* White Chocolate Dip Pot */}
        <mesh position={[0.8, 0, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.45, 0.5, 32]} />
          <meshPhysicalMaterial color="#FFF5EA" roughness={0.12} metalness={0.1} clearcoat={1.0} />
        </mesh>
      </group>
    </group>
  );
}

// ============================================================
// ============================================================
// SLIDE 4 CENTERPIECE: POP-TOP CAN CAKE (LAYERED CHIFFON & GANACHE)
// ============================================================
function CanCakeCenterpiece() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.35;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.09;
  });

  return (
    <group ref={group} position={[0, 0, 0]} scale={1.15}>
      {/* Transparent Plastic Can Body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 0.95, 2.0, 48]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          roughness={0.1}
          metalness={0.1}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Chiffon Cake Layer 1 (bottom) */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[0.91, 0.91, 0.45, 48]} />
        <meshPhysicalMaterial color="#7C462C" roughness={0.7} />
      </mesh>

      {/* Mascarpone Vanilla Cream Layer 1 */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.91, 0.91, 0.4, 48]} />
        <meshPhysicalMaterial color="#FFF5E9" roughness={0.3} />
      </mesh>

      {/* Chiffon Cake Layer 2 */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.91, 0.91, 0.45, 48]} />
        <meshPhysicalMaterial color="#7C462C" roughness={0.7} />
      </mesh>

      {/* Ganache & Truffle Topping (top) */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.91, 0.91, 0.3, 48]} />
        <meshPhysicalMaterial color="#8A4E31" roughness={0.08} metalness={0.25} clearcoat={1.0} />
      </mesh>

      {/* Metallic Aluminum Pop-Top Can Rim */}
      <mesh position={[0, 1.02, 0]}>
        <torusGeometry args={[0.96, 0.05, 16, 48]} />
        <meshPhysicalMaterial color="#D8D8D8" roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
}

// ============================================================
// SLIDE 5 CENTERPIECE: CANDIED FRUIZY (TANGHULU FRUIT SKEWERS)
// ============================================================
function FruizyCenterpiece() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.4;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.3) * 0.08;
  });

  return (
    <group ref={group} position={[0, 0, 0]} scale={1.2}>
      {/* Skewer 1: Fresh Candied Strawberries */}
      <group position={[-0.35, 0, 0]} rotation={[0, 0, -0.15]}>
        {/* Wooden Skewer Stick */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 2.8, 16]} />
          <meshPhysicalMaterial color="#D4A771" roughness={0.8} />
        </mesh>

        {/* Strawberry 1 (top) */}
        <mesh position={[0, 0.75, 0]}>
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshPhysicalMaterial color="#E85D75" roughness={0.1} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.75, 0]}>
          <sphereGeometry args={[0.33, 24, 24]} />
          <meshPhysicalMaterial color="#FFFFFF" roughness={0.02} metalness={0.1} transparent opacity={0.55} />
        </mesh>

        {/* Strawberry 2 (middle) */}
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshPhysicalMaterial color="#D9405B" roughness={0.1} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.35, 24, 24]} />
          <meshPhysicalMaterial color="#FFFFFF" roughness={0.02} metalness={0.1} transparent opacity={0.55} />
        </mesh>

        {/* Strawberry 3 (bottom) */}
        <mesh position={[0, -0.65, 0]}>
          <sphereGeometry args={[0.29, 24, 24]} />
          <meshPhysicalMaterial color="#E85D75" roughness={0.1} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshPhysicalMaterial color="#FFFFFF" roughness={0.02} metalness={0.1} transparent opacity={0.55} />
        </mesh>
      </group>

      {/* Skewer 2: Candied Green Grapes & Berries */}
      <group position={[0.35, 0, 0.1]} rotation={[0, 0, 0.18]}>
        {/* Wooden Skewer Stick */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 2.8, 16]} />
          <meshPhysicalMaterial color="#D4A771" roughness={0.8} />
        </mesh>

        {/* Grape 1 */}
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshPhysicalMaterial color="#7CB342" roughness={0.1} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.31, 24, 24]} />
          <meshPhysicalMaterial color="#FFFFFF" roughness={0.02} metalness={0.1} transparent opacity={0.55} />
        </mesh>

        {/* Strawberry */}
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.31, 24, 24]} />
          <meshPhysicalMaterial color="#E85D75" roughness={0.1} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.34, 24, 24]} />
          <meshPhysicalMaterial color="#FFFFFF" roughness={0.02} metalness={0.1} transparent opacity={0.55} />
        </mesh>

        {/* Grape 2 */}
        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.27, 24, 24]} />
          <meshPhysicalMaterial color="#7CB342" roughness={0.1} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshPhysicalMaterial color="#FFFFFF" roughness={0.02} metalness={0.1} transparent opacity={0.55} />
        </mesh>
      </group>
    </group>
  );
}

// ============================================================
// MAIN UNIFIED 3D SCENE (Tailored for each slide, FULL-PAGE SPREAD)
// Features the 3 Reference elements:
// - Reference 1: Grand Spiral Liquid Chocolate Pouring Wave (spanning full height)
// - Reference 2: Cascading Choco Chips & Broken Cocoa Shards Swarm
// - Reference 3: 8-Square Chocolate Bar with Liquid Splash Crown
// - Plus the signature dessert centerpiece
// ============================================================
export default function SlideDessertScene({ slideId }: SlideDessertSceneProps) {
  return (
    <group position={[0, 0, 0]}>
      {/* Studio Lighting - Bright, Crisp & Radiant White Studio Aesthetic */}
      <ambientLight intensity={2.2} color="#FFFFFF" />
      <directionalLight
        position={[6, 9, 6]}
        intensity={3.8}
        color="#FFFDF9"
        castShadow
      />
      <directionalLight
        position={[-7, 5, -5]}
        intensity={2.2}
        color="#E5AF7B"
      />
      <pointLight position={[0, 3, 3]} intensity={3.0} color="#FFF6EA" />
      <pointLight position={[-3, -3, 2]} intensity={1.8} color="#E5AF7B" />

      {/* 1. DESSERT CENTERPIECE (Changes per slide) */}
      <group position={[0, 0, 0]} scale={1.05}>
        {slideId === 1 && <DreamCakeCenterpiece />}
        {slideId === 2 && <DreamBowlCenterpiece />}
        {slideId === 3 && <ChurrosCenterpiece />}
        {slideId === 4 && <CanCakeCenterpiece />}
        {slideId === 5 && <FruizyCenterpiece />}
      </group>

      {/* 2. 8-SQUARE CHOCOLATE BARS WITH LIQUID SPLASH CROWN */}
      {/* Flanking the scene with realistic bevels and splash crown */}
      <ChocolateBarWithSplash
        position={[2.4, 1.3, 0.8]}
        rotation={[-0.35, 0.5, 0.2]}
        scale={0.88}
        speed={1.0}
        showSplash={true}
      />
      <ChocolateBarWithSplash
        position={[-2.6, -1.2, 0.9]}
        rotation={[0.3, -0.6, -0.3]}
        scale={0.78}
        speed={0.85}
        showSplash={true}
      />
      <ChocolateBarWithSplash
        position={[0.4, 3.2, -1.2]}
        rotation={[0.5, 0.4, -0.2]}
        scale={0.65}
        speed={0.9}
        showSplash={false}
      />

      {/* 4. CASCADING CHOCO CHIPS & BROKEN COCOA SHARDS (Reference 2) */}
      {/* 36 pointed teardrop chips and cocoa shards cascading down the vertical helix */}
      <CascadingChocoChips count={36} radius={3.6} height={11.0} speed={1.1} />
    </group>
  );
}
