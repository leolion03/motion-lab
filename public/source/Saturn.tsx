"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleCloud, { createCloud } from "./ParticleCloud";

type Props = { speed?: number; brightness?: number; glow?: number; glowEnabled?: boolean };

export default function Saturn({speed=1,brightness=.8,glow=1,glowEnabled=false}:Props){
  const group=useRef<THREE.Group>(null);const t=useRef(0);
  const globe=useMemo(()=>createCloud(5600,8101,(_,rand,put)=>{
    const z=rand()*2-1,a=rand()*Math.PI*2,rr=Math.sqrt(1-z*z),r=.86;
    const y=z*r;const c=new THREE.Color().setHSL(.085+Math.sin(y*17)*.025+rand()*.012,.56,.43+rand()*.22);
    put(r*rr*Math.cos(a),y,r*rr*Math.sin(a),c,1.2+rand()*1.1);
  }),[]);
  const rings=useMemo(()=>createCloud(6200,8102,(_,rand,put)=>{
    const a=rand()*Math.PI*2, r=1.15+rand()*.86;const y=(rand()-.5)*.045;
    const c=new THREE.Color().setHSL(.10+rand()*.055,.58,.48+rand()*.25);
    put(Math.cos(a)*r,y,Math.sin(a)*r,c,1.0+rand()*1.25);
  }),[]);
  useFrame((_,dt)=>{t.current+=Math.min(dt,.05)*speed;if(group.current){group.current.rotation.y=t.current*.16;}});
  return <group ref={group} rotation={[.38,0,.18]}><ParticleCloud data={globe} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={1.0}/><group rotation={[.28,0,.10]}><ParticleCloud data={rings} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={.92}/></group></group>;
}
