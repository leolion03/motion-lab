"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleCloud, { createCloud } from "./ParticleCloud";

export default function ParticleWave({ speed = 1, brightness = 1, glow = 1, glowEnabled = false }: { speed?: number; brightness?: number; glow?: number; glowEnabled?: boolean }) {
  const root = useRef<THREE.Group>(null);
  const t = useRef(0);
  const data = useMemo(() => createCloud(6400, 76, (i, rand, put) => {
    const cols = 100;
    const x = ((i % cols) / (cols - 1) - .5) * 5.5;
    const z = ((Math.floor(i / cols)) / 63 - .5) * 3.65;
    const c = new THREE.Color('#54cfff').lerp(new THREE.Color('#a49cff'), Math.abs(z)/2.5);
    if (rand()>.9) c.lerp(new THREE.Color('#e1fcff'), .55);
    put(x, 0, z, c, 1.25 + rand()*1.45);
  }), []);
  const initial = useMemo(() => data.positions.slice(), [data]);
  useFrame((_, delta) => {
    t.current += Math.min(delta, .05) * speed;
    const a = data.positions;
    for (let i=0; i<a.length; i+=3) {
      const x = initial[i], z = initial[i+2];
      const d = Math.sqrt(x*x + z*z);
      a[i+1] = Math.sin(x*2.1 + t.current*1.2)*.23 + Math.cos(z*3.2-t.current*.85)*.19 + Math.sin(d*3.3-t.current*1.35)*.13;
    }
    // The shared particle geometry reads from this typed array. Mark it dirty via ref below.
    if (root.current) root.current.traverse((object) => {
      if (object instanceof THREE.Points) {
        const pos = object.geometry.getAttribute('position');
        if (pos) pos.needsUpdate = true;
      }
    });
  });
  return <group ref={root} rotation={[-.28, 0, 0]}>
    <ParticleCloud data={data} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={1.3}/>
  </group>;
}
