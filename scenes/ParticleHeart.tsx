"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleCloud, { createCloud } from "./ParticleCloud";

export default function ParticleHeart({ speed = 1, brightness = 1, glow = 1, glowEnabled = false }: { speed?: number; brightness?: number; glow?: number; glowEnabled?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const cloud = useMemo(() => createCloud(7500, 1302, (_, random, put) => {
    const t = random() * Math.PI * 2;
    const fill = Math.sqrt(random());
    const x = (16 * Math.sin(t) ** 3) * 0.092 * fill;
    const y = (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * 0.092 * fill;
    const z = (random() - 0.5) * (0.18 + 1.32 * Math.sqrt(1 - fill * fill));
    const color = new THREE.Color().setHSL(0.91 + random() * 0.05, 0.85, 0.52 + random() * 0.35);
    put(x, y + 0.12, z, color, random() > 0.95 ? 3.3 : 1.4 + random() * 1.3);
  }), []);
  const aura = useMemo(() => createCloud(450, 19, (_, rand, put) => {
    const t = rand() * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3 * 0.098;
    const y = (13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t)) * 0.098;
    put(x + (rand()-.5)*.12, y + .12 +(rand()-.5)*.12, (rand()-.5)*.27,
      new THREE.Color('#ffd6ee'), 2.1 + rand() * 2.8);
  }), []);
  useFrame((_, delta) => {
    elapsed.current += Math.min(delta, 0.05) * speed;
    if (group.current) {
      group.current.rotation.y = elapsed.current * 0.27;
      group.current.rotation.z = Math.sin(elapsed.current * 0.52) * 0.04;
      const pulse = 1 + Math.sin(elapsed.current * 2.2) * 0.022;
      group.current.scale.setScalar(pulse);
    }
  });
  return <group ref={group}>
    <ParticleCloud data={cloud} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={1.3}/>
    <ParticleCloud data={aura} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={1.7}/>
  </group>;
}
