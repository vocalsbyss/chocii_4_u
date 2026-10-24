"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ============================================================
// 1. REALISTIC 8-SQUARE CHOCOLATE BAR WITH LIQUID SPLASH CROWN
// Matches User Reference Image 3:
// - 8 beveled pillowed chocolate pips (2 columns x 4 rows)
// - Deep snap division grooves
// - Liquid chocolate splash crown with flying droplets
// ============================================================
export function ChocolateBarWithSplash({
  position = [0, 0, 0],
  rotation = [-0.3, 0.4, 0.2],
  scale = 1,
  speed = 1,
  showSplash = true,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  speed?: number;
  showSplash?: boolean;
}) {
  const barGroupRef = useRef<THREE.Group>(null);
  const splashRef = useRef<THREE.Group>(null);
  const initialPos = useMemo(() => position, [position]);

  useFrame((state, delta) => {
    if (!barGroupRef.current) return;
    // Gentle floating and tumbling motion
    barGroupRef.current.rotation.y += delta * 0.35 * speed;
    barGroupRef.current.rotation.x =
      rotation[0] + Math.sin(state.clock.elapsedTime * 1.2 * speed) * 0.12;
    barGroupRef.current.rotation.z =
      rotation[2] + Math.cos(state.clock.elapsedTime * 0.9 * speed) * 0.08;

    barGroupRef.current.position.y =
      initialPos[1] + Math.sin(state.clock.elapsedTime * 1.5 * speed) * 0.18;

    if (splashRef.current) {
      splashRef.current.rotation.y += delta * 0.2 * speed;
    }
  });

  return (
    <group ref={barGroupRef} position={position} rotation={rotation} scale={scale}>
      {/* --- THE CHOCOLATE BAR (2 x 4 Grid = 8 Squares) --- */}
      <group position={[0, 0.2, 0]}>
        {/* Base Chocolate Slab */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.16, 2.6]} />
          <meshPhysicalMaterial
            color="#83492D"
            roughness={0.22}
            metalness={0.12}
            clearcoat={1.0}
            clearcoatRoughness={0.08}
          />
        </mesh>

        {/* 8 Raised Beveled Pillowed Squares (2 cols x 4 rows) */}
        {[-0.38, 0.38].map((x, xi) =>
          [-0.96, -0.32, 0.32, 0.96].map((z, zi) => (
            <group key={`pip-${xi}-${zi}`} position={[x, 0.1, z]}>
              {/* Pip Body with Bevel */}
              <mesh castShadow>
                <boxGeometry args={[0.62, 0.1, 0.52]} />
                <meshPhysicalMaterial
                  color="#9B5C3C"
                  roughness={0.18}
                  metalness={0.15}
                  clearcoat={1.0}
                  clearcoatRoughness={0.06}
                />
              </mesh>
              {/* Pillowed Top Cap */}
              <mesh position={[0, 0.055, 0]}>
                <boxGeometry args={[0.52, 0.03, 0.42]} />
                <meshPhysicalMaterial
                  color="#B27350"
                  roughness={0.16}
                  metalness={0.18}
                  clearcoat={1.0}
                />
              </mesh>
            </group>
          ))
        )}
      </group>

      {/* --- LIQUID CHOCOLATE SPLASH CROWN (Reference Image 3) --- */}
      {showSplash && (
        <group ref={splashRef} position={[0, -0.2, 0]}>
          {/* Main Splash Bowl / Wave */}
          <mesh rotation={[Math.PI / 1.1, 0, 0]}>
            <torusGeometry args={[1.6, 0.22, 16, 64]} />
            <meshPhysicalMaterial
              color="#8D5133"
              roughness={0.06}
              metalness={0.22}
              clearcoat={1.0}
              clearcoatRoughness={0.04}
            />
          </mesh>

          {/* Secondary Fluid Wave Ring */}
          <mesh rotation={[Math.PI / 1.25, 0.4, 0.2]} position={[0, -0.15, 0]}>
            <torusGeometry args={[2.0, 0.14, 16, 64]} />
            <meshPhysicalMaterial
              color="#A46745"
              roughness={0.06}
              metalness={0.22}
              clearcoat={1.0}
            />
          </mesh>

          {/* Flying Splash Droplets and Crowns */}
          {[
            { pos: [-1.4, 0.7, 0.6], r: 0.14 },
            { pos: [1.5, 0.9, -0.5], r: 0.16 },
            { pos: [-1.8, -0.2, -0.7], r: 0.12 },
            { pos: [1.7, 0.3, 0.8], r: 0.15 },
            { pos: [0.3, 1.4, 0.9], r: 0.18 },
            { pos: [-0.6, 1.2, -1.0], r: 0.13 },
            { pos: [1.2, -0.7, -1.1], r: 0.11 },
            { pos: [-1.2, -0.8, 1.0], r: 0.13 },
          ].map((d, i) => (
            <mesh key={i} position={d.pos as [number, number, number]}>
              <sphereGeometry args={[d.r, 20, 20]} />
              <meshPhysicalMaterial
                color="#9B5C3C"
                roughness={0.05}
                metalness={0.25}
                clearcoat={1.0}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

// Alias for backwards compatibility
export const ChocolateBar = ChocolateBarWithSplash;

// ============================================================
// 2. GRAND SPIRAL LIQUID CHOCOLATE POURING (Full-Page Wave)
// Matches User Reference Image 1:
// - Grand, sweeping vertical helical ribbon from y = +6 down to y = -6
// - Curving fluid crests, variable width, and flying droplets
// ============================================================
export function GrandSpiralPouring({
  color = "#82492D",
  secondaryColor = "#B27350",
  speed = 1.0,
  scale = 1.0,
  position = [0, 0, 0],
}: {
  color?: string;
  secondaryColor?: string;
  speed?: number;
  scale?: number;
  position?: [number, number, number];
}) {
  const spiralGroupRef = useRef<THREE.Group>(null);

  // Generate 3D helical ribbon vertices matching Reference Image 1
  const { ribbonGeometry, droplets } = useMemo(() => {
    const pointsCount = 140;
    const height = 12.0; // Spans full viewport height
    const turns = 2.4; // 2.4 graceful spiral twists
    const baseRadius = 2.4;

    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const dropletPositions: [number, number, number, number][] = [];

    for (let i = 0; i <= pointsCount; i++) {
      const t = i / pointsCount;
      const angle = t * Math.PI * 2 * turns;
      const y = (0.5 - t) * height;

      // Variable radius creating dramatic sweeping wide turns
      const currentRadius =
        baseRadius * (1.0 + 0.4 * Math.sin(t * Math.PI * 2.2));

      // Central backbone position
      const cx = Math.cos(angle) * currentRadius;
      const cz = Math.sin(angle) * currentRadius * 0.85;

      // Tangent & Normal vectors for ribbon width
      const nextAngle = (t + 0.01) * Math.PI * 2 * turns;
      const nx = Math.cos(nextAngle) * currentRadius;
      const nz = Math.sin(nextAngle) * currentRadius * 0.85;
      const tx = nx - cx;
      const tz = nz - cz;
      const len = Math.sqrt(tx * tx + tz * tz) || 1;
      const normX = -tz / len;
      const normZ = tx / len;

      // Ribbon width expands in middle and tapers at top/bottom
      const ribbonWidth = (0.8 + 0.6 * Math.sin(t * Math.PI)) * 0.9;
      const tiltY = Math.cos(angle) * 0.3;

      // Left vertex
      vertices.push(
        cx + normX * ribbonWidth,
        y + tiltY,
        cz + normZ * ribbonWidth
      );
      uvs.push(0, t);

      // Right vertex
      vertices.push(
        cx - normX * ribbonWidth,
        y - tiltY,
        cz - normZ * ribbonWidth
      );
      uvs.push(1, t);

      // Generate splash droplets along the outer crest
      if (i % 6 === 0 && i > 10 && i < pointsCount - 10) {
        const dropDist = currentRadius + ribbonWidth + 0.2 + Math.random() * 0.4;
        const dropX = Math.cos(angle) * dropDist;
        const dropZ = Math.sin(angle) * dropDist;
        const dropR = 0.08 + Math.random() * 0.12;
        dropletPositions.push([dropX, y + (Math.random() - 0.5) * 0.4, dropZ, dropR]);
      }
    }

    for (let i = 0; i < pointsCount; i++) {
      const v0 = i * 2;
      const v1 = i * 2 + 1;
      const v2 = (i + 1) * 2;
      const v3 = (i + 1) * 2 + 1;

      // Two triangles per ribbon quad
      indices.push(v0, v1, v2);
      indices.push(v2, v1, v3);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    return { ribbonGeometry: geo, droplets: dropletPositions };
  }, []);

  useFrame((state, delta) => {
    if (!spiralGroupRef.current) return;
    // Slow, luxurious twisting stream rotation
    spiralGroupRef.current.rotation.y += delta * 0.22 * speed;
    // Subtle undulating wave
    spiralGroupRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 1.1) * 0.2;
  });

  return (
    <group
      ref={spiralGroupRef}
      position={position}
      scale={scale}
    >
      {/* Main Wide Liquid Chocolate Spiral Ribbon */}
      <mesh geometry={ribbonGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={color}
          roughness={0.06}
          metalness={0.2}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Secondary Ribbon Lip Accent */}
      <mesh
        geometry={ribbonGeometry}
        scale={[0.96, 0.98, 0.96]}
        rotation={[0, 0.15, 0]}
      >
        <meshPhysicalMaterial
          color={secondaryColor}
          roughness={0.08}
          metalness={0.25}
          clearcoat={1.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Splashing Liquid Droplets Flying Off Ribbon Crests */}
      {droplets.map((d, idx) => (
        <mesh key={idx} position={[d[0], d[1], d[2]]}>
          <sphereGeometry args={[d[3], 18, 18]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.05}
            metalness={0.25}
            clearcoat={1.0}
          />
        </mesh>
      ))}
    </group>
  );
}

// Backwards compatibility alias
export const ChocolatePouring = ({
  color,
  type,
}: {
  color?: string;
  type?: "stream" | "swirl";
}) => (
  <GrandSpiralPouring
    color={color || "#82492D"}
    scale={type === "stream" ? 0.85 : 1.0}
  />
);

// ============================================================
// 3. CASCADING CHOCO CHIPS & BROKEN COCOA SHARDS
// Matches User Reference Image 2:
// - Teardrop pointed chocolate chips (flat base, cone body, curved peak)
// - Angular fractured cocoa shards
// - Spanning the full height along a spiraling trajectory
// ============================================================
export function CascadingChocoChips({
  count = 32,
  radius = 3.2,
  height = 10.0,
  speed = 1.0,
}: {
  count?: number;
  radius?: number;
  height?: number;
  speed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate realistic teardrop choco chip geometry
  const chipGeometry = useMemo(() => {
    // Lathe profile for classic Hershey-style pointed chip
    const points: THREE.Vector2[] = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.48, 0.05),
      new THREE.Vector2(0.46, 0.22),
      new THREE.Vector2(0.36, 0.44),
      new THREE.Vector2(0.22, 0.68),
      new THREE.Vector2(0.08, 0.92),
      new THREE.Vector2(0.01, 1.08),
      new THREE.Vector2(0, 1.15),
    ];
    return new THREE.LatheGeometry(points, 24);
  }, []);

  // Generate angular chocolate shard geometry
  const shardGeometry = useMemo(() => {
    return new THREE.DodecahedronGeometry(0.38, 0);
  }, []);

  // Randomized positions cascading down the vertical helix
  const items = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const t = i / count;
      const angle = t * Math.PI * 2 * 2.5 + (Math.random() - 0.5) * 0.8;
      const y = (0.5 - t) * height + (Math.random() - 0.5) * 0.6;
      const dist = radius * (0.65 + Math.random() * 0.7);
      const isShard = i % 3 === 0;

      return {
        initialX: Math.cos(angle) * dist,
        initialY: y,
        initialZ: Math.sin(angle) * dist * 0.85,
        scale: 0.35 + Math.random() * 0.35,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 2.2,
        rotSpeedY: (Math.random() - 0.5) * 2.8,
        floatFreq: 1.2 + Math.random() * 1.5,
        floatAmp: 0.12 + Math.random() * 0.15,
        isShard,
        color:
          Math.random() > 0.6
            ? "#A56947"
            : Math.random() > 0.18
            ? "#884F32"
            : "#FFF3E2",
      };
    });
  }, [count, radius, height]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Slow overall cascade rotation
    groupRef.current.rotation.y += delta * 0.18 * speed;

    // Individual chip tumbling
    groupRef.current.children.forEach((child, i) => {
      const item = items[i];
      if (item) {
        child.rotation.x += delta * item.rotSpeedX * speed;
        child.rotation.y += delta * item.rotSpeedY * speed;
        child.position.y =
          item.initialY +
          Math.sin(state.clock.elapsedTime * item.floatFreq) * item.floatAmp;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((item, idx) => (
        <group
          key={idx}
          position={[item.initialX, item.initialY, item.initialZ]}
          rotation={[item.rotX, item.rotY, 0]}
          scale={item.scale}
        >
          {item.isShard ? (
            <mesh geometry={shardGeometry} castShadow>
              <meshPhysicalMaterial
                color={item.color}
                roughness={0.28}
                metalness={0.15}
                clearcoat={0.8}
              />
            </mesh>
          ) : (
            <mesh geometry={chipGeometry} castShadow>
              <meshPhysicalMaterial
                color={item.color}
                roughness={0.18}
                metalness={0.2}
                clearcoat={0.95}
                clearcoatRoughness={0.1}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// Backwards compatibility alias
export const ChocoChipsGroup = ({
  count = 18,
  radius = 2.4,
}: {
  count?: number;
  radius?: number;
}) => <CascadingChocoChips count={count} radius={radius} />;
