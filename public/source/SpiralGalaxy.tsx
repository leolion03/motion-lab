"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleCloud, { createCloud } from "./ParticleCloud";

export default function SpiralGalaxy({ speed = 1, brightness = 1, glow = 1, glowEnabled = false }: { speed?: number; brightness?: number; glow?: number; glowEnabled?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const arms = useMemo(() => createCloud(9500, 301, (i, rand, put) => {
    const radius = Math.pow(rand(), .72) * 2.15;
    const arm = i % 4;
    const spread = (rand()-.5) * (.16 + radius * .27);
    const angle = arm * Math.PI / 2 + radius * 2.6 + spread;
    const y = (rand()-.5) * (.14 + .12 * (2.15-radius));
    const c = new THREE.Color('#ffe6d2').lerp(new THREE.Color('#8f6aff'), Math.min(1, radius / 2.15));
    if (rand() > .72) c.lerp(new THREE.Color('#66c7ff'), rand()*.62);
    put(Math.cos(angle) * radius, y, Math.sin(angle) * radius, c, 1.2 + rand() * 2.2);
  }), []);
  const core = useMemo(() => createCloud(900, 445, (_, rand, put) => {
    const a = rand()*Math.PI*2;
    const r = Math.pow(rand(), 1.85)*.45;
    put(Math.cos(a)*r, (rand()-.5)*.25, Math.sin(a)*r, new THREE.Color('#ffe7cf'), 1.8+rand()*3.1);
  }), []);
  useFrame((_, dt) => {
    elapsed.current += Math.min(dt,.05) * speed;
    if (group.current) group.current.rotation.y = elapsed.current * .10;
  });
  return <group ref={group} rotation={[.24, 0, .12]}>
    <ParticleCloud data={arms} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={1.25}/>
    <ParticleCloud data={core} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={1.8}/>
  </group>;
}
