"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleCloud, { createCloud } from "./ParticleCloud";

type Props = {
  speed?: number;
  brightness?: number;
  glow?: number;
  glowEnabled?: boolean;
};

// ===== Editable appearance settings =====
const SETTINGS = {
  leafSize: 0.55,         // Scale of each heart (0.40-0.70 recommended)
  leafOffset: 0.54,       // Distance from center toward each leaf's rounded lobes
  leafFillCount: 1850,   // Particles inside EACH leaf
  leafEdgeCount: 440,    // Particles along EACH heart outline
  veinCount: 120,        // Particles along EACH leaf vein
  leafDepth: 0.045,      // Gentle 3D thickness of leaf particles
  pointSize: 0.90,       // Passed to ParticleCloud.scale; not a CSS pixel value
  swayAmount: 0.055,     // Overall side-to-side angular motion (radians)
  swaySpeed: 0.92,       // Overall sway frequency
  leafFlutter: 0.027,    // Individual leaf angular motion (radians)
  showSparkles: true,
};

const LEAF_COLORS = ["#5bd77c", "#77e698", "#45c76e", "#8aeba6"];
const TAU = Math.PI * 2;

// Standard mathematical heart curve. The tip points DOWN, toward the clover center.
function heartXY(t: number): [number, number] {
  const x = (16 * Math.sin(t) ** 3) / 18;
  const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 18;
  return [x, y];
}

// Polygon containment ensures particles actually fill a heart instead of a warped ring.
function insidePolygon(x: number, y: number, polygon: [number, number][]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function makeHeartLeaf(seed: number, hex: string) {
  const outline = Array.from({ length: 180 }, (_, i) => heartXY((i / 180) * TAU));
  const base = new THREE.Color(hex);

  const fill = createCloud(SETTINGS.leafFillCount, seed, (_, rand, put) => {
    let x = 0;
    let y = 0;
    // Rejection sampling within the heart's bounding rectangle.
    do {
      x = (rand() * 2 - 1) * 0.9;
      y = rand() * 1.7 - 1.0;
    } while (!insidePolygon(x, y, outline));
    const tint = base.clone().offsetHSL((rand() - 0.5) * 0.025, 0, (rand() - 0.5) * 0.12);
    put(
      x * SETTINGS.leafSize,
      SETTINGS.leafOffset + y * SETTINGS.leafSize,
      (rand() - 0.5) * SETTINGS.leafDepth,
      tint,
      1.0 + rand() * 0.65
    );
  });

  const edge = createCloud(SETTINGS.leafEdgeCount, seed + 1, (i, rand, put) => {
    const [x, y] = heartXY(((i + rand() * 0.3) / SETTINGS.leafEdgeCount) * TAU);
    put(
      x * SETTINGS.leafSize,
      SETTINGS.leafOffset + y * SETTINGS.leafSize,
      0.025,
      base.clone().lerp(new THREE.Color("#deffe3"), 0.33 + rand() * 0.2),
      1.25 + rand() * 0.45
    );
  });

  const vein = createCloud(SETTINGS.veinCount, seed + 2, (_, rand, put) => {
    const u = rand();
    const y = 0.055 + u * 0.54;
    const x = Math.sin(u * Math.PI) * (rand() - 0.5) * 0.035;
    put(x, y, 0.035, new THREE.Color("#d8ffdd"), 0.75 + rand() * 0.3);
  });

  return { fill, edge, vein };
}

export default function FourLeafClover({
  speed = 1,
  brightness = 0.8,
  glow = 1,
  glowEnabled = false,
}: Props) {
  const root = useRef<THREE.Group>(null);
  const leaves = useRef<(THREE.Group | null)[]>([]);
  const elapsed = useRef(0);

  const leafData = useMemo(
    () => LEAF_COLORS.map((color, i) => makeHeartLeaf(10101 + i * 10, color)),
    []
  );

  const center = useMemo(() => createCloud(220, 10201, (_, rand, put) => {
    const a = rand() * TAU;
    const r = Math.sqrt(rand()) * 0.065;
    put(Math.cos(a) * r, Math.sin(a) * r, 0.045, new THREE.Color("#e5ffe1"), 0.9 + rand() * 0.45);
  }), []);

  const stem = useMemo(() => createCloud(850, 10202, (_, rand, put) => {
    const u = rand();
    const x = 0.03 + 0.12 * Math.sin(u * Math.PI) + 0.12 * u;
    const y = -0.08 - u * 1.27;
    put(x + (rand() - 0.5) * 0.025, y, (rand() - 0.5) * 0.035,
      new THREE.Color(rand() > 0.5 ? "#4abf69" : "#80e29b"), 0.9 + rand() * 0.5);
  }), []);

  const sparkles = useMemo(() => createCloud(200, 10203, (_, rand, put) => {
    const a = rand() * TAU;
    const r = 1.12 + rand() * 0.3;
    put(Math.cos(a) * r, Math.sin(a) * r, (rand() - 0.5) * 0.2,
      new THREE.Color("#c9ffdc"), 0.7 + rand() * 0.35);
  }), []);

  useFrame((_, dt) => {
    elapsed.current += Math.min(dt, 0.05) * speed;
    const t = elapsed.current;
    if (root.current) {
      root.current.rotation.z = Math.sin(t * SETTINGS.swaySpeed) * SETTINGS.swayAmount;
      root.current.rotation.y = Math.sin(t * 0.45) * 0.10;
      root.current.position.y = Math.sin(t * 0.8) * 0.045;
    }
    leaves.current.forEach((leaf, i) => {
      if (leaf) leaf.rotation.z = (i * Math.PI) / 2 + Math.sin(t * 1.35 + i * 1.3) * SETTINGS.leafFlutter;
    });
  });

  return <group ref={root}>
    {leafData.map((data, i) => (
      <group key={i} ref={(el) => { leaves.current[i] = el; }} rotation={[0, 0, (i * Math.PI) / 2]}>
        <ParticleCloud data={data.fill} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={SETTINGS.pointSize} />
        <ParticleCloud data={data.edge} speed={speed} brightness={brightness * 1.05} glow={glow} glowEnabled={glowEnabled} scale={SETTINGS.pointSize} />
        <ParticleCloud data={data.vein} speed={speed} brightness={brightness * 0.9} glow={glow} glowEnabled={glowEnabled} scale={0.75} />
      </group>
    ))}
    <ParticleCloud data={center} speed={speed} brightness={brightness * 1.05} glow={glow} glowEnabled={glowEnabled} scale={0.82} />
    <ParticleCloud data={stem} speed={speed} brightness={brightness * 0.94} glow={glow} glowEnabled={glowEnabled} scale={0.82} />
    {SETTINGS.showSparkles && <ParticleCloud data={sparkles} speed={speed} brightness={brightness * 0.78} glow={glow} glowEnabled={glowEnabled} scale={0.7} />}
  </group>;
}
