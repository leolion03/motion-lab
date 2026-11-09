"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleCloud, { createCloud } from "./ParticleCloud";

type Props = { speed?: number; brightness?: number; glow?: number; glowEnabled?: boolean };

function makeLeaf(seed: number, rotation: number, colorHex: string) {
  return createCloud(1450, seed, (_, rand, put) => {
    const t = rand() * Math.PI * 2;
    const r = 0.15 + Math.pow(rand(), 0.7) * 0.72;
    const x0 = 16 * Math.pow(Math.sin(t), 3);
    const y0 = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    let x = x0 / 18;
    let y = y0 / 18 + 0.18;
    const sx = x * r;
    const sy = y * r;
    const xr = sx * Math.cos(rotation) - sy * Math.sin(rotation);
    const yr = sx * Math.sin(rotation) + sy * Math.cos(rotation);
    const shade = new THREE.Color(colorHex).offsetHSL((rand() - 0.5) * 0.02, 0, (rand() - 0.5) * 0.08);
    put(xr, yr, (rand() - 0.5) * 0.08, shade, 0.92 + rand() * 0.7);
  });
}

export default function FourLeafClover({ speed = 1, brightness = 0.8, glow = 1, glowEnabled = false }: Props) {
  const root = useRef<THREE.Group>(null);
  const leftTop = useRef<THREE.Group>(null);
  const rightTop = useRef<THREE.Group>(null);
  const leftBottom = useRef<THREE.Group>(null);
  const rightBottom = useRef<THREE.Group>(null);
  const t = useRef(0);

  const leafA = useMemo(() => makeLeaf(10101, -Math.PI / 4, '#73df8f'), []);
  const leafB = useMemo(() => makeLeaf(10102, Math.PI / 4, '#62d67f'), []);
  const leafC = useMemo(() => makeLeaf(10103, -3 * Math.PI / 4, '#6bd889'), []);
  const leafD = useMemo(() => makeLeaf(10104, 3 * Math.PI / 4, '#7ae79a'), []);
  const veins = useMemo(() => createCloud(520, 10105, (_, rand, put) => {
    const quadrant = Math.floor(rand() * 4);
    const signX = quadrant % 2 === 0 ? -1 : 1;
    const signY = quadrant < 2 ? 1 : -1;
    const u = rand();
    const x = signX * (0.05 + u * 0.34);
    const y = signY * (0.05 + (1 - u) * 0.34);
    const c = new THREE.Color('#d7ffd9');
    put(x, y, (rand() - 0.5) * 0.03, c, 0.72 + rand() * 0.28);
  }), []);
  const center = useMemo(() => createCloud(180, 10106, (_, rand, put) => {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * 0.08;
    put(Math.cos(a) * r, Math.sin(a) * r, (rand() - 0.5) * 0.03, new THREE.Color('#e1ffd8'), 0.9 + rand() * 0.4);
  }), []);
  const stem = useMemo(() => createCloud(680, 10107, (_, rand, put) => {
    const u = rand();
    const x = 0.06 + Math.sin(u * Math.PI * 1.4) * 0.18 + u * 0.16;
    const y = -0.22 - u * 1.35;
    const z = (rand() - 0.5) * 0.04;
    const c = new THREE.Color(rand() > 0.45 ? '#55c46d' : '#7de08e');
    put(x, y, z, c, 0.82 + rand() * 0.5);
  }), []);
  const sparkles = useMemo(() => createCloud(180, 10108, (_, rand, put) => {
    const a = rand() * Math.PI * 2;
    const r = 1.0 + rand() * 0.45;
    put(Math.cos(a) * r, Math.sin(a) * r * 0.8, (rand() - 0.5) * 0.25, new THREE.Color('#dfffe1'), 0.65 + rand() * 0.3);
  }), []);

  useFrame((_, dt) => {
    t.current += Math.min(dt, 0.05) * speed;
    const sway = Math.sin(t.current * 1.1) * 0.08;
    if (root.current) {
      root.current.rotation.z = sway;
      root.current.rotation.y = Math.sin(t.current * 0.55) * 0.1;
      root.current.position.y = Math.sin(t.current * 0.9) * 0.05;
    }
    if (leftTop.current) leftTop.current.rotation.z = 0.04 + Math.sin(t.current * 1.5) * 0.04;
    if (rightTop.current) rightTop.current.rotation.z = -0.04 - Math.sin(t.current * 1.5 + 0.8) * 0.04;
    if (leftBottom.current) leftBottom.current.rotation.z = 0.03 + Math.sin(t.current * 1.4 + 1.2) * 0.035;
    if (rightBottom.current) rightBottom.current.rotation.z = -0.03 - Math.sin(t.current * 1.4 + 0.4) * 0.035;
  });

  return <group ref={root}>
    <group ref={leftTop} position={[-0.18, 0.22, 0]}><ParticleCloud data={leafA} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={0.96} /></group>
    <group ref={rightTop} position={[0.18, 0.22, 0]}><ParticleCloud data={leafB} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={0.96} /></group>
    <group ref={leftBottom} position={[-0.18, -0.12, 0]}><ParticleCloud data={leafC} speed={speed} brightness={brightness * 0.98} glow={glow} glowEnabled={glowEnabled} scale={0.96} /></group>
    <group ref={rightBottom} position={[0.18, -0.12, 0]}><ParticleCloud data={leafD} speed={speed} brightness={brightness * 1.02} glow={glow} glowEnabled={glowEnabled} scale={0.96} /></group>
    <ParticleCloud data={veins} speed={speed} brightness={brightness * 1.05} glow={glow} glowEnabled={glowEnabled} scale={0.72} />
    <ParticleCloud data={center} speed={speed} brightness={brightness * 1.08} glow={glow} glowEnabled={glowEnabled} scale={0.78} />
    <ParticleCloud data={stem} speed={speed} brightness={brightness * 0.95} glow={glow} glowEnabled={glowEnabled} scale={0.86} />
    <ParticleCloud data={sparkles} speed={speed} brightness={brightness * 0.88} glow={glow} glowEnabled={glowEnabled} scale={0.65} />
  </group>;
}
