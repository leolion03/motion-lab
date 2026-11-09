"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleCloud, { createCloud } from "./ParticleCloud";

type Props = { speed?: number; brightness?: number; glow?: number; glowEnabled?: boolean };

export default function Jellyfish({speed=1,brightness=0.8,glow=1,glowEnabled=false}:Props){
  const group=useRef<THREE.Group>(null); const t=useRef(0);
  const bell=useMemo(()=>createCloud(4600,3101,(_,rand,put)=>{
    const theta=rand()*Math.PI*2, a=rand()*Math.PI*.53;
    const r=1.12*Math.sin(a), y=.60+1.05*Math.cos(a)-.53;
    const c=new THREE.Color().setHSL(.72+rand()*.12,.72,.53+rand()*.22);
    put(Math.cos(theta)*r,y,Math.sin(theta)*r,c,1.4+rand()*1.35);
  }),[]);
  const tentacles=useMemo(()=>createCloud(4100,3102,(i,rand,put)=>{
    const strand=Math.floor(i/205), q=(i%205)/204, a=strand*Math.PI*2/20;
    const r=.21+(strand%4)*.19; const curl=q*q*.30;
    put(Math.cos(a)*r +Math.sin(q*14+strand)*(.07+curl),.57-q*(2.1+(strand%5)*.11),Math.sin(a)*r+Math.cos(q*13+strand)*(.07+curl),
      new THREE.Color().setHSL(.49+q*.20+rand()*.06,.70,.49+rand()*.21),1.1+rand()*1.0);
  }),[]);
  useFrame((_,dt)=>{t.current+=Math.min(dt,.05)*speed;if(group.current){group.current.rotation.y=t.current*.19;group.current.position.y=Math.sin(t.current*1.2)*.12;group.current.scale.setScalar(1+Math.sin(t.current*1.3)*.018);}});
  return <group ref={group}><ParticleCloud data={bell} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={1.05}/><ParticleCloud data={tentacles} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={.92}/></group>;
}
