"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleCloud,{createCloud,makeRandom} from "./ParticleCloud";

type Props={speed?:number;brightness?:number;glow?:number;glowEnabled?:boolean};
const COUNT=5300;
export default function Fountain({speed=1,brightness=.8,glow=1,glowEnabled=false}:Props){
 const clock=useRef(0),root=useRef<THREE.Group>(null);
 const data=useMemo(()=>createCloud(COUNT,9201,(_,rand,put)=>{
  put(0,-1.15,0,new THREE.Color().setHSL(.52+rand()*.06,.75,.56+rand()*.3),1.1+rand()*1.3);
 }),[]);
 const params=useMemo(()=>{
  const rnd=makeRandom(9202);return Array.from({length:COUNT},(_,i)=>({
   angle:rnd()*Math.PI*2,
   seed:rnd(),
   rate:.42+rnd()*.42,
   height:1.55+rnd()*.85,
   radius: .7+rnd()*.68,
   layer:i%5,
  }));
 },[]);
 const basin=useMemo(()=>createCloud(1600,9203,(_,rand,put)=>{
  const a=rand()*Math.PI*2;
  const r=rand()>.55?1.72+(rand()-.5)*.07:Math.sqrt(rand())*1.72;
  const y=-1.36+(rand()-.5)*.025;
  put(Math.cos(a)*r,y,Math.sin(a)*r,new THREE.Color(rand()>.22?'#4ec1d8':'#c1f5ff'),1.05+rand());
 }),[]);
 useFrame((_,dt)=>{
  if(speed<=0)return;
  clock.current+=Math.min(dt,.05)*speed;
  for(let i=0;i<COUNT;i++){
    const p=params[i];const life=(clock.current*p.rate+p.seed)%1;
    const rim=p.layer===0?0:p.layer===1?.30:p.layer===2?.48:p.layer===3?.73:1;
    const launchHeight=p.height*(1-rim*.17);
    const a=p.angle;
    const spread=(.04+rim*.36)*life+p.radius*rim*life*life*.68;
    const vertical=-1.19+launchHeight*4*life*(1-life);
    const idx=i*3;
    data.positions[idx]=Math.cos(a)*spread;
    data.positions[idx+1]=vertical;
    data.positions[idx+2]=Math.sin(a)*spread;
  }
  if(root.current)root.current.rotation.y=Math.sin(clock.current*.2)*.10;
 });
 return <group ref={root}>
  <ParticleCloud data={data} dynamic speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={.91}/>
  <ParticleCloud data={basin} speed={speed} brightness={brightness*.75} glow={glow} glowEnabled={glowEnabled} scale={.8}/>
 </group>;
}
