"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ParticleHeart() {
  const group = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    const n = 4200;
    const data = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const t = Math.random() * Math.PI * 2;
      const u = Math.sqrt(Math.random());
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
      const depth = (Math.random() - .5) * 2.8 * Math.sin(Math.PI * u);
      data[i*3] = x * u * .095;
      data[i*3+1] = y * u * .095 + .1;
      data[i*3+2] = depth;
    }
    return data;
  }, []);
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * .24;
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * .3) * .06;
    }
  });
  return <group ref={group}>
    <points>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#ff5d9d" size={.026} sizeAttenuation transparent opacity={.94} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
    <pointLight color="#fb4c9a" intensity={4} distance={6} />
  </group>;
}
