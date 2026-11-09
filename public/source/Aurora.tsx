"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleCloud, { createCloud } from "./ParticleCloud";

type Props = { speed?: number; brightness?: number; glow?: number; glowEnabled?: boolean };

function makeCurtain(seed: number, xScale: number, zBase: number, hueBase: number, density = 3600) {
  return createCloud(density, seed, (_, rand, put) => {
    const x = (rand() - 0.5) * xScale;
    const u = rand();
    const vertical = -0.98 + u * 3.15;
    const foldA = Math.sin(x * 1.45 + zBase * 2.0) * 0.28;
    const foldB = Math.sin(x * 3.15 + u * 7.0 + zBase) * 0.12;
    const veil = Math.cos(x * 0.75 + u * 4.8 + zBase) * 0.18;
    const z = zBase + foldA + foldB + (rand() - 0.5) * 0.08;
    const y = vertical + veil;
    const hue = hueBase + Math.sin(x * 0.4 + u * 4.0) * 0.03 + rand() * 0.02;
    const sat = 0.72 + rand() * 0.18;
    const light = 0.33 + (1 - u) * 0.22 + rand() * 0.16;
    put(x + Math.sin(u * 5.0 + x) * 0.08, y, z, new THREE.Color().setHSL(hue, sat, light), 0.95 + rand() * 0.95);
  });
}

export default function Aurora({ speed = 1, brightness = 0.8, glow = 1, glowEnabled = false }: Props) {
  const root = useRef<THREE.Group>(null);
  const layers = useRef<Array<THREE.Group | null>>([]);
  const t = useRef(0);

  const back = useMemo(() => makeCurtain(6101, 5.6, -0.7, 0.39, 3000), []);
  const mid = useMemo(() => makeCurtain(6102, 5.2, -0.1, 0.47, 3400), []);
  const front = useMemo(() => makeCurtain(6103, 5.0, 0.55, 0.58, 3200), []);
  const glowBands = useMemo(() => createCloud(900, 6104, (_, rand, put) => {
    const x = (rand() - 0.5) * 5.2;
    const y = -0.15 + rand() * 2.25;
    const z = Math.sin(x * 1.4) * 0.22 + (rand() - 0.5) * 0.06;
    const c = new THREE.Color().setHSL(0.45 + rand() * 0.16, 0.82, 0.6 + rand() * 0.18);
    put(x, y, z, c, 0.82 + rand() * 0.78);
  }), []);
  const stars = useMemo(() => createCloud(950, 6105, (_, rand, put) => {
    put((rand() - 0.5) * 6.2, 0.9 + rand() * 2.2, (rand() - 0.5) * 2.5 - 1.4, new THREE.Color('#d3e8ff'), 0.78 + rand() * 0.72);
  }), []);

  useFrame((_, dt) => {
    t.current += Math.min(dt, 0.05) * speed;
    if (root.current) {
      root.current.rotation.y = Math.sin(t.current * 0.22) * 0.16;
      root.current.position.x = Math.sin(t.current * 0.34) * 0.1;
    }
    layers.current.forEach((layer, idx) => {
      if (!layer) return;
      layer.position.x = Math.sin(t.current * (0.35 + idx * 0.08) + idx) * (0.08 + idx * 0.03);
      layer.position.y = Math.sin(t.current * (0.22 + idx * 0.05) + idx * 0.9) * 0.03;
      layer.rotation.z = Math.sin(t.current * (0.18 + idx * 0.03) + idx) * 0.04;
    });
  });

  return <group ref={root}>
    <group ref={(el) => { layers.current[0] = el; }}>
      <ParticleCloud data={back} speed={speed} brightness={brightness * 0.92} glow={glow} glowEnabled={glowEnabled} scale={0.92} />
    </group>
    <group ref={(el) => { layers.current[1] = el; }}>
      <ParticleCloud data={mid} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={0.98} />
    </group>
    <group ref={(el) => { layers.current[2] = el; }}>
      <ParticleCloud data={front} speed={speed} brightness={brightness * 1.05} glow={glow} glowEnabled={glowEnabled} scale={1.0} />
    </group>
    <ParticleCloud data={glowBands} speed={speed} brightness={brightness * 1.08} glow={glow} glowEnabled={glowEnabled} scale={0.85} />
    <ParticleCloud data={stars} speed={speed} brightness={brightness * 0.86} glow={glow} glowEnabled={glowEnabled} scale={0.7} />
  </group>;
}
