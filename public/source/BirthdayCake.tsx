"use client";
import { useMemo,useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleCloud,{createCloud} from "./ParticleCloud";

type Props={speed?:number;brightness?:number;glow?:number;glowEnabled?:boolean};
export default function BirthdayCake({speed=1,brightness=.8,glow=1,glowEnabled=false}:Props){
 const root=useRef<THREE.Group>(null),flames=useRef<THREE.Group>(null),clock=useRef(0);
 const cake=useMemo(()=>createCloud(6900,9301,(_,rand,put)=>{
  const top=rand()>.48;const rMax=top?.83:1.32;
  const base=top?-.12:-1.0;const height=top?.78:.9;
  const wall=rand()>.23;
  const theta=rand()*Math.PI*2;
  const r=wall?rMax*(.97+rand()*.03):Math.sqrt(rand())*rMax;
  const h=wall?rand()*height:height;
  const color=top?new THREE.Color().setHSL(.94+rand()*.045,.70,.65+rand()*.22):new THREE.Color().setHSL(.08+rand()*.04,.65,.52+rand()*.24);
  put(Math.cos(theta)*r,base+h,Math.sin(theta)*r,color,1.15+rand()*1.15);
 }),[]);
 const icing=useMemo(()=>createCloud(2200,9302,(_,rand,put)=>{
  const top=rand()>.50;const radius=top?.84:1.33;
  const y=top?.66:-.10;
  const angle=rand()*Math.PI*2;
  const edge=rand()>.24;
  const r=edge?radius*(.97+rand()*.04):Math.sqrt(rand())*radius;
  const drip=edge?Math.pow(rand(),5)*(top?.30:.22):rand()*.03;
  put(Math.cos(angle)*r,y-drip,Math.sin(angle)*r,new THREE.Color(rand()>.13?'#fff0e1':'#ffd8e2'),1.1+rand()*.95);
 }),[]);
 const candles=useMemo(()=>createCloud(480,9303,(i,rand,put)=>{
  const k=i%5,angle=k*Math.PI*2/5,rr=.49;
  const y=.68+rand()*.40;
  put(Math.cos(angle)*rr+(rand()-.5)*.04,y,Math.sin(angle)*rr+(rand()-.5)*.04,
   new THREE.Color(['#ff8d8d','#8bcaff','#ffe18c','#ae9dff','#9be8cc'][k]),1.2+rand()*.85);
 }),[]);
 const fire=useMemo(()=>createCloud(500,9304,(i,rand,put)=>{
  const k=i%5,a=k*Math.PI*2/5;const u=rand();
  put(Math.cos(a)*.49+(rand()-.5)*.06,1.08+u*.33,Math.sin(a)*.49+(rand()-.5)*.06,
   new THREE.Color(u>.65?'#fff0a2':'#ffae57'),1.25+rand()*.95);
 }),[]);
 const confetti=useMemo(()=>createCloud(800,9305,(_,rand,put)=>{
  const a=rand()*Math.PI*2,r=1.5+rand()*.75;
  put(Math.cos(a)*r,(rand()-.5)*2.7,Math.sin(a)*r,new THREE.Color().setHSL(rand(),.78,.67),.8+rand()*.8);
 }),[]);
 useFrame((_,dt)=>{
  clock.current+=Math.min(dt,.05)*speed;
  if(root.current)root.current.rotation.y=clock.current*.18;
  if(flames.current){flames.current.scale.y=1+Math.sin(clock.current*9)*.085;flames.current.position.x=Math.sin(clock.current*7)*.015;}
 });
 return <group ref={root} position={[0,-.12,0]}>
  <ParticleCloud data={cake} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={1.07}/>
  <ParticleCloud data={icing} speed={speed} brightness={brightness*1.02} glow={glow} glowEnabled={glowEnabled} scale={1.05}/>
  <ParticleCloud data={candles} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={1}/>
  <group ref={flames}><ParticleCloud data={fire} speed={speed} brightness={brightness*1.15} glow={glow} glowEnabled={glowEnabled} scale={1.12}/></group>
  <ParticleCloud data={confetti} speed={speed} brightness={brightness*.9} glow={glow} glowEnabled={glowEnabled} scale={.8}/>
 </group>;
}
