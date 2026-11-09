"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleCloud, { createCloud } from "./ParticleCloud";

export default function ChristmasTree({ speed = 1, brightness = 1, glow = 1, glowEnabled = false }: { speed?: number; brightness?: number; glow?: number; glowEnabled?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const star = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const foliage = useMemo(() => createCloud(6100, 1225, (_, rand, put) => {
    const h = rand();
    const theta = rand() * Math.PI * 2;
    const tier = Math.floor(h * 5);
    const tierBottom = tier / 5;
    const tierProgress = (h - tierBottom) * 5;
    const r = (1 - tierBottom) * 1.31 * (0.65 + (1-tierProgress)*0.33) * Math.sqrt(rand());
    const tint = new THREE.Color().setHSL(0.36 + rand() * .12, .62 + rand() * .3, .32 + rand() * .39);
    put(Math.cos(theta)*r, h*3.65-1.77, Math.sin(theta)*r, tint, 1.5+rand()*1.5);
  }), []);
  const ribbon = useMemo(() => createCloud(1250, 2501, (i, rand, put) => {
    const h = i / 1249;
    const theta = h * Math.PI * 14;
    const r = (1-h) * 1.35;
    put(Math.cos(theta)*r+(rand()-.5)*.065, h*3.65-1.77+(rand()-.5)*.05, Math.sin(theta)*r+(rand()-.5)*.065,
      new THREE.Color().setHSL(.10 + rand()*.035, 1, .62 + rand()*.25), 2.2+rand()*2.3);
  }), []);
  const decorations = useMemo(() => createCloud(320, 311, (_, rand, put) => {
    const h = rand()*.93;
    const a = rand()*Math.PI*2;
    const r = (1-h)*1.22;
    const colors = ['#ffe3a0', '#ff777f', '#d2c3ff', '#a5ffe6'];
    put(Math.cos(a)*r, h*3.65-1.77, Math.sin(a)*r, new THREE.Color(colors[Math.floor(rand()*colors.length)]), 3.2+rand()*2);
  }), []);
  const starOutline = useMemo(() => createCloud(520, 8081, (i, rand, put) => {
    const seg = i % 10;
    const nextSeg = (seg + 1) % 10;
    const t = (Math.floor(i / 10) + rand()) / (520 / 10);
    const a0 = Math.PI / 2 + seg * Math.PI / 5;
    const a1 = Math.PI / 2 + nextSeg * Math.PI / 5;
    const r0 = seg % 2 === 0 ? 0.23 : 0.10;
    const r1 = nextSeg % 2 === 0 ? 0.23 : 0.10;
    const x = THREE.MathUtils.lerp(Math.cos(a0) * r0, Math.cos(a1) * r1, t);
    const y = THREE.MathUtils.lerp(Math.sin(a0) * r0, Math.sin(a1) * r1, t);
    const z = (rand() - 0.5) * 0.03;
    const c = new THREE.Color().setHSL(0.12 + rand() * 0.03, 0.95, 0.72 + rand() * 0.12);
    put(x, y, z, c, 1.9 + rand() * 0.9);
  }), []);
  const starFill = useMemo(() => createCloud(340, 8082, (_, rand, put) => {
    const spike = Math.floor(rand() * 5);
    const side = rand() > 0.5 ? 1 : -1;
    const dir = Math.PI / 2 + spike * (Math.PI * 2 / 5) + side * (0.10 + rand() * 0.17);
    const r = Math.pow(rand(), 0.72) * 0.19;
    const x = Math.cos(dir) * r * (0.72 + rand() * 0.48);
    const y = Math.sin(dir) * r * (0.72 + rand() * 0.48);
    const z = (rand() - 0.5) * 0.028;
    const c = new THREE.Color().setHSL(0.12 + rand() * 0.02, 0.88, 0.65 + rand() * 0.18);
    put(x, y, z, c, 1.3 + rand() * 0.85);
  }), []);
  const starCore = useMemo(() => createCloud(120, 8083, (_, rand, put) => {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * 0.05;
    put(Math.cos(a) * r, Math.sin(a) * r, (rand() - 0.5) * 0.024, new THREE.Color('#fff4c6'), 1.1 + rand() * 0.7);
  }), []);

  useFrame((_, dt) => {
    elapsed.current += Math.min(dt, .05)*speed;
    if (group.current) group.current.rotation.y = elapsed.current * .21;
    if (star.current) {
      star.current.rotation.z = elapsed.current * .35;
      const bob = 1 + Math.sin(elapsed.current * 2.1) * 0.06;
      star.current.scale.setScalar(bob);
    }
  });
  return <group ref={group}>
    <ParticleCloud data={foliage} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={1.2}/>
    <ParticleCloud data={ribbon} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={1.8}/>
    <ParticleCloud data={decorations} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={1.9}/>
    <group ref={star} position={[0, 2.03, 0]}>
      <ParticleCloud data={starOutline} speed={speed} brightness={brightness * 1.08} glow={glow} glowEnabled={glowEnabled} scale={1.2} />
      <ParticleCloud data={starFill} speed={speed} brightness={brightness * 1.04} glow={glow} glowEnabled={glowEnabled} scale={1.0} />
      <ParticleCloud data={starCore} speed={speed} brightness={brightness * 1.1} glow={glow} glowEnabled={glowEnabled} scale={0.95} />
    </group>
  </group>;
}
