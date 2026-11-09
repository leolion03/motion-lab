"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleCloud,{createCloud} from "./ParticleCloud";

type Props={speed?:number;brightness?:number;glow?:number;glowEnabled?:boolean};
function bloom(seed:number,hue:number){
 const petals=createCloud(4900,seed,(i,rand,put)=>{
  const petal=Math.floor(i/700),u=rand(),v=rand()*2-1;
  const a=petal*Math.PI*2/7+.09;
  const along=.12+u*.8,side=Math.sin(Math.PI*u)*v*.31;
  const x=Math.cos(a)*along-Math.sin(a)*side;
  const z=Math.sin(a)*along+Math.cos(a)*side;
  const y=.12+Math.sin(u*Math.PI)*.34-u*.27+Math.abs(v)*.11;
  const tint=new THREE.Color().setHSL(hue+(rand()-.5)*.035,.62+rand()*.18,.50+rand()*.29);
  put(x,y,z,tint,1.1+rand()*1.1);
 });
 const pollen=createCloud(630,seed+1,(_,rand,put)=>{
  const t=rand()*Math.PI*2,r=Math.sqrt(rand())*.17;
  put(Math.cos(t)*r,.22+rand()*.18,Math.sin(t)*r,new THREE.Color().setHSL(.12+rand()*.04,.91,.59+rand()*.25),1.2+rand()*1.0);
 });
 return {petals,pollen};
}
export default function BloomingFlower({speed=1,brightness=.8,glow=1,glowEnabled=false}:Props){
 const root=useRef<THREE.Group>(null),a=useRef<THREE.Group>(null),b=useRef<THREE.Group>(null),clock=useRef(0);
 const blooms=useMemo(()=>[bloom(4101,.92),bloom(4201,.78)],[]);
 const stems=useMemo(()=>createCloud(1100,4301,(i,rand,put)=>{
  const side=i<550?-1:1,u=rand();const sign=side;
  const x=sign*(.47+.14*Math.sin(u*2.2));
  const y=-1.8+u*1.8;
  const z=(rand()-.5)*.055;
  put(x,y,z,new THREE.Color('#5cc58e'),1.1+rand()*.9);
 }),[]);
 const leaves=useMemo(()=>createCloud(1350,4302,(i,rand,put)=>{
  const side=i<675?-1:1,u=rand(),v=rand()*2-1;
  const x=side*(.48+.28*u),y=-1.35+u*.45+v*.06,z=Math.sin(u*Math.PI)*v*.23;
  put(x,y,z,new THREE.Color(rand()>.5?'#58c99c':'#339c78'),1+rand());
 }),[]);
 useFrame((_,dt)=>{
  clock.current+=Math.min(dt,.05)*speed;
  if(root.current)root.current.rotation.y=Math.sin(clock.current*.45)*.15;
  if(a.current)a.current.rotation.z=Math.sin(clock.current*.74)*.055;
  if(b.current)b.current.rotation.z=-Math.sin(clock.current*.69+.8)*.055;
 });
 return <group ref={root} position={[0,.08,0]}>
  <ParticleCloud data={stems} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={.9}/>
  <ParticleCloud data={leaves} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={.9}/>
  {blooms.map((flower,i)=><group key={i} ref={i===0?a:b} position={[i===0?-.52:.52,i===0?.05:.25,0]} scale={.8}>
   <ParticleCloud data={flower.petals} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={1.08}/>
   <ParticleCloud data={flower.pollen} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={.95}/>
  </group>)}
 </group>;
}
