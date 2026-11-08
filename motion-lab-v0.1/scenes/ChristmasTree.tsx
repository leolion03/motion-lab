"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ChristmasTree() {
  const group = useRef<THREE.Group>(null);
  const { foliage, ribbon, ornaments } = useMemo(() => {
    const foliage = new Float32Array(3700 * 3);
    for (let i = 0; i < 3700; i++) {
      const h = Math.random();
      const angle = Math.random() * Math.PI * 2;
      const r = (1-h) * (0.3 + .7*Math.sqrt(Math.random())) * 1.45;
      foliage[i*3] = Math.cos(angle)*r;
      foliage[i*3+1] = h*3.5-1.7;
      foliage[i*3+2] = Math.sin(angle)*r;
    }
    const ribbon = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      const h = i/599;
      const a = h * Math.PI * 12;
      const r = (1-h)*1.35;
      ribbon[i*3]=Math.cos(a)*r;
      ribbon[i*3+1]=h*3.5-1.7;
      ribbon[i*3+2]=Math.sin(a)*r;
    }
    const ornaments = new Float32Array(220 * 3);
    for (let i=0;i<220;i++) {
      const h=Math.random()*.92;
      const a=Math.random()*Math.PI*2;
      const r=(1-h)*1.38;
      ornaments[i*3]=Math.cos(a)*r;
      ornaments[i*3+1]=h*3.5-1.7;
      ornaments[i*3+2]=Math.sin(a)*r;
    }
    return {foliage,ribbon,ornaments};
  }, []);
  useFrame((_,delta)=>{ if(group.current) group.current.rotation.y+=delta*.22; });
  return <group ref={group}>
    <points>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[foliage,3]}/></bufferGeometry>
      <pointsMaterial color="#55e7ae" size={.025} transparent opacity={.9} depthWrite={false} blending={THREE.AdditiveBlending}/>
    </points>
    <points>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[ribbon,3]}/></bufferGeometry>
      <pointsMaterial color="#ffd27b" size={.042} transparent depthWrite={false} blending={THREE.AdditiveBlending}/>
    </points>
    <points>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[ornaments,3]}/></bufferGeometry>
      <pointsMaterial color="#fff3bf" size={.052} transparent depthWrite={false} blending={THREE.AdditiveBlending}/>
    </points>
    <mesh position={[0,1.86,0]}><octahedronGeometry args={[.16,0]}/><meshBasicMaterial color="#ffdb87"/></mesh>
  </group>;
}
