"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ParticleWave({ speed = 1 }: { speed?: number }) {
  const points=useRef<THREE.Points>(null);
  const animTime=useRef(0);
  const initial=useMemo(()=>{
    const cols=90,rows=40,arr=new Float32Array(cols*rows*3);
    for(let z=0;z<rows;z++)for(let x=0;x<cols;x++){
      const i=(z*cols+x)*3;
      arr[i]=(x/(cols-1)-.5)*5.5;
      arr[i+1]=0;
      arr[i+2]=(z/(rows-1)-.5)*3.6;
    }
    return arr;
  },[]);
  useFrame((_,delta)=>{
    animTime.current += delta * speed;
    if(!points.current)return;
    const arr=points.current.geometry.attributes.position.array as Float32Array;
    const t=animTime.current;
    for(let i=0;i<arr.length;i+=3){
      const x=initial[i],z=initial[i+2];
      arr[i+1]=Math.sin(x*2.4+t*1.1)*.24+Math.cos(z*3-t*.85)*.23;
    }
    points.current.geometry.attributes.position.needsUpdate=true;
  });
  return <group rotation={[-.32,0,0]}>
    <points ref={points}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[initial.slice(),3]}/></bufferGeometry>
      <pointsMaterial color="#69dfff" size={.026} transparent opacity={.9} depthWrite={false} blending={THREE.AdditiveBlending}/>
    </points>
  </group>;
}
