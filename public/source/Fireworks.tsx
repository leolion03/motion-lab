"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleCloud, { createCloud, CloudData } from "./ParticleCloud";

type Props = { speed?: number; brightness?: number; glow?: number; glowEnabled?: boolean };

type BurstSet = { shell: CloudData; halo: CloudData; trails: CloudData; core: CloudData };

function makeBurst(seed: number, hue: number): BurstSet {
  const shell = createCloud(1200, seed, (_, rand, put) => {
    const spokes = 24;
    const spoke = Math.floor(rand() * spokes);
    const theta = (spoke / spokes) * Math.PI * 2 + (rand() - 0.5) * 0.08;
    const phi = (rand() - 0.5) * Math.PI * 0.8;
    const r = 0.24 + Math.pow(rand(), 0.62) * 0.98;
    const rr = Math.cos(phi);
    const x = Math.cos(theta) * rr * r;
    const y = Math.sin(phi) * r * 0.9;
    const z = Math.sin(theta) * rr * r;
    const c = new THREE.Color().setHSL(hue + rand() * 0.05, 0.88, 0.55 + rand() * 0.22);
    put(x, y, z, c, 1.0 + rand() * 1.0);
  });
  const halo = createCloud(520, seed + 1, (_, rand, put) => {
    const theta = rand() * Math.PI * 2;
    const phi = (rand() - 0.5) * Math.PI;
    const r = 0.95 + Math.pow(rand(), 0.75) * 0.52;
    const rr = Math.cos(phi);
    const c = new THREE.Color().setHSL(hue + 0.02 + rand() * 0.04, 0.72, 0.68 + rand() * 0.12);
    put(Math.cos(theta) * rr * r, Math.sin(phi) * r * 0.78, Math.sin(theta) * rr * r, c, 0.78 + rand() * 0.82);
  });
  const trails = createCloud(360, seed + 2, (_, rand, put) => {
    const theta = rand() * Math.PI * 2;
    const start = 0.28 + rand() * 0.56;
    const x = Math.cos(theta) * start;
    const y = -0.1 - rand() * 1.05;
    const z = Math.sin(theta) * start * 0.45;
    const c = new THREE.Color().setHSL(hue - 0.02 + rand() * 0.05, 0.84, 0.58 + rand() * 0.18);
    put(x, y, z, c, 0.72 + rand() * 0.68);
  });
  const core = createCloud(120, seed + 3, (_, rand, put) => {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * 0.12;
    const c = new THREE.Color().setHSL(hue + rand() * 0.03, 0.95, 0.8 + rand() * 0.1);
    put(Math.cos(a) * r, Math.sin(a) * r, (rand() - 0.5) * 0.1, c, 1.0 + rand() * 0.6);
  });
  return { shell, halo, trails, core };
}

const BURSTS = [
  { pos: [-1.35, 0.55, -0.12] as [number, number, number], hue: 0.07, phase: 0.0 },
  { pos: [1.15, 0.92, 0.18] as [number, number, number], hue: 0.58, phase: 1.7 },
  { pos: [-0.2, -0.62, 0.36] as [number, number, number], hue: 0.85, phase: 3.0 },
  { pos: [1.55, -0.48, -0.2] as [number, number, number], hue: 0.14, phase: 4.1 },
];

export default function Fireworks({ speed = 1, brightness = 0.8, glow = 1, glowEnabled = false }: Props) {
  const root = useRef<THREE.Group>(null);
  const burstRefs = useRef<Array<THREE.Group | null>>([]);
  const t = useRef(0);
  const bursts = useMemo(() => BURSTS.map((b, i) => ({ ...b, ...makeBurst(7100 + i * 20, b.hue) })), []);
  const stars = useMemo(() => createCloud(520, 7999, (_, rand, put) => {
    put((rand() - 0.5) * 5.8, 1.0 + rand() * 1.6, (rand() - 0.5) * 2.6 - 0.8, new THREE.Color('#cfe4ff'), 0.8 + rand() * 0.6);
  }), []);

  useFrame((_, dt) => {
    t.current += Math.min(dt, 0.05) * speed;
    if (root.current) root.current.rotation.y = Math.sin(t.current * 0.16) * 0.08;
    burstRefs.current.forEach((g, i) => {
      if (!g) return;
      const phase = bursts[i].phase;
      const pulse = (Math.sin(t.current * 1.55 + phase) + 1) * 0.5;
      const bloom = 0.82 + pulse * 0.4;
      g.scale.setScalar(bloom);
      g.rotation.z = phase * 0.15 + t.current * (0.03 + i * 0.01);
      g.position.y = bursts[i].pos[1] + Math.sin(t.current * 1.25 + phase) * 0.05;
    });
  });

  return <group ref={root}>
    <ParticleCloud data={stars} speed={speed} brightness={brightness * 0.88} glow={glow} glowEnabled={glowEnabled} scale={0.7} />
    {bursts.map((burst, i) => (
      <group
        key={i}
        ref={(el) => { burstRefs.current[i] = el; }}
        position={burst.pos}
      >
        <ParticleCloud data={burst.shell} speed={speed} brightness={brightness * 1.05} glow={glow} glowEnabled={glowEnabled} scale={0.98} />
        <ParticleCloud data={burst.halo} speed={speed} brightness={brightness * 0.95} glow={glow} glowEnabled={glowEnabled} scale={0.9} />
        <ParticleCloud data={burst.trails} speed={speed} brightness={brightness * 0.85} glow={glow} glowEnabled={glowEnabled} scale={0.8} />
        <ParticleCloud data={burst.core} speed={speed} brightness={brightness * 1.18} glow={glow} glowEnabled={glowEnabled} scale={0.9} />
      </group>
    ))}
  </group>;
}
