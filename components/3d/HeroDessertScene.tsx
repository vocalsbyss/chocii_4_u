"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Floating gold & cocoa particles
function FloatingParticles({ count = 80 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const goldColor = new THREE.Color("#C58A55");
    const chocolateColor = new THREE.Color("#E85D75");
    const creamColor = new THREE.Color("#FFF5E9");

    for (let i = 0; i < count; i++) {
      // Sphere distribution around cake
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2.4 + Math.random() * 2.2;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const chosenColor =
        Math.random() > 0.6
          ? goldColor
          : Math.random() > 0.3
          ? creamColor
          : chocolateColor;

      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 3D Cake Composition
export default function HeroDessertScene() {
  const cakeGroup = useRef<THREE.Group>(null);
  const swirlGroup = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Continuous slow rotation
    if (cakeGroup.current) {
      cakeGroup.current.rotation.y += delta * 0.35;
      // Gentle floating motion
      cakeGroup.current.position.y =
        Math.sin(state.clock.elapsedTime * 1.2) * 0.12;

      // Subtle mouse interaction
      const targetRotX = state.pointer.y * 0.18;
      const targetRotZ = -state.pointer.x * 0.18;
      cakeGroup.current.rotation.x = THREE.MathUtils.lerp(
        cakeGroup.current.rotation.x,
        targetRotX,
        0.05
      );
      cakeGroup.current.rotation.z = THREE.MathUtils.lerp(
        cakeGroup.current.rotation.z,
        targetRotZ,
        0.05
      );
    }

    if (swirlGroup.current) {
      swirlGroup.current.rotation.y -= delta * 0.25;
      swirlGroup.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* Studio Lighting */}
      <ambientLight intensity={0.8} color="#FFF5E9" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={2.2}
        color="#FFF0DB"
        castShadow
      />
      <directionalLight
        position={[-5, 4, -4]}
        intensity={1.2}
        color="#C58A55"
      />
      <pointLight position={[0, 3, 2]} intensity={1.5} color="#E85D75" />
      <pointLight position={[0, -3, 0]} intensity={0.6} color="#3A211B" />

      {/* Floating Sparkles & Cocoa Flakes */}
      <FloatingParticles count={90} />

      {/* Main Cake Group */}
      <group ref={cakeGroup}>
        {/* Tier 1 (Bottom Tier) - Rich Chocolate Sponge with cocoa crumb */}
        <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.7, 1.75, 0.9, 64]} />
          <meshStandardMaterial
            color="#502A1A"
            roughness={0.65}
            metalness={0.1}
          />
        </mesh>

        {/* Tier 1 Ganache Border Ring */}
        <mesh position={[0, -0.15, 0]}>
          <torusGeometry args={[1.72, 0.08, 16, 64]} />
          <meshStandardMaterial
            color="#5C3220"
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>

        {/* Tier 2 (Top Tier) - Dark Chocolate Mud Cake */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.25, 1.3, 0.85, 64]} />
          <meshStandardMaterial
            color="#452316"
            roughness={0.5}
            metalness={0.15}
          />
        </mesh>

        {/* Glossy Chocolate Mirror Glaze Topping */}
        <mesh position={[0, 0.78, 0]}>
          <cylinderGeometry args={[1.26, 1.26, 0.04, 64]} />
          <meshStandardMaterial
            color="#4C2618"
            roughness={0.08}
            metalness={0.4}
            envMapIntensity={1.8}
          />
        </mesh>

        {/* Chocolate Drips running down the side */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * 1.25;
          const z = Math.sin(rad) * 1.25;
          const dripHeight = 0.2 + (i % 3) * 0.12;
          return (
            <mesh
              key={angle}
              position={[x, 0.7 - dripHeight / 2, z]}
              castShadow
            >
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial
                color="#4C2618"
                roughness={0.1}
                metalness={0.3}
              />
            </mesh>
          );
        })}

        {/* Top Garnishes: Chocolate Truffles */}
        {[
          { pos: [0.55, 0.88, 0.4], color: "#5C3220", size: 0.18 },
          { pos: [-0.5, 0.88, 0.45], color: "#6E3D28", size: 0.19 },
          { pos: [0.1, 0.88, -0.6], color: "#5C3220", size: 0.2 },
          { pos: [-0.4, 0.88, -0.35], color: "#C58A55", size: 0.16 }, // Gold-dusted caramel truffle
        ].map((truffle, idx) => (
          <mesh key={idx} position={truffle.pos as [number, number, number]} castShadow>
            <sphereGeometry args={[truffle.size, 32, 32]} />
            <meshStandardMaterial
              color={truffle.color}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
        ))}

        {/* Top Garnish: Fresh Ruby Strawberry */}
        <group position={[0.4, 0.88, -0.2]}>
          <mesh castShadow>
            <coneGeometry args={[0.18, 0.35, 32]} />
            <meshStandardMaterial
              color="#E85D75"
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
          {/* Leaves */}
          <mesh position={[0, -0.05, 0]}>
            <coneGeometry args={[0.14, 0.06, 5]} />
            <meshStandardMaterial color="#4A7C59" roughness={0.6} />
          </mesh>
        </group>

        {/* Golden chocii 4 u Brand Medallion on Top */}
        <mesh position={[0, 0.95, 0]} rotation={[-Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.03, 32]} />
          <meshStandardMaterial
            color="#D9A066"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* Floating Chocolate Sauce Ribbon around the dessert */}
      <group ref={swirlGroup}>
        <mesh rotation={[Math.PI / 3, 0, Math.PI / 6]}>
          <torusGeometry args={[2.3, 0.06, 16, 100]} />
          <meshStandardMaterial
            color="#633621"
            roughness={0.15}
            metalness={0.3}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>
    </group>
  );
}
