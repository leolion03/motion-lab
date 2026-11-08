"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SpiralGalaxy() {
  const group = useRef<THREE.Group>(null);
  const { positions, colors } = useMemo(() => {
    const n=6000, positions=new Float32Array(n*3),colors=new Float32Array(n*3);
    const inner=new THREE.Color("#ffb0e0"),outer=new THREE.Color("#6378ff");
    for(let i=0;i<n;i++){
      const radius=Math.pow(Math.random(),.72)*2.25;
      const arm=i%4;
      const angle=arm*Math.PI/2+radius*2.55+(Math.random()-.5)*(.12+radius*.3);
      positions[i*3]=Math.cos(angle)*radius;
      positions[i*3+1]=(Math.random()-.5)*(.13+radius*.12);
      positions[i*3+2]=Math.sin(angle)*radius;
      const c=inner.clone().lerp(outer,radius/2.25);
      colors[i*3]=c.r;colors[i*3+1]=c.g;colors[i*3+2]=c.b;
    }
    return {positions,colors};
  },[]);
  useFrame((_,delta)=>{if(group.current)group.current.rotation.y+=delta*.09;});
  return <group rotation={[.3,0,.1]} ref={group}>
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions,3]}/>
        <bufferAttribute attach="attributes-color" args={[colors,3]}/>
      </bufferGeometry>
      <pointsMaterial size={.024} vertexColors transparent opacity={.95} depthWrite={false} blending={THREE.AdditiveBlending}/>
    </points>
  </group>;
}
