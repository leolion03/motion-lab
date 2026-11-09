"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleCloud, { createCloud } from "./ParticleCloud";

type Props = { speed?: number; brightness?: number; glow?: number; glowEnabled?: boolean };
// The two polygon silhouettes represent a Monarch's broad forewing and rounded hindwing.
const forewing: [number, number][] = [
  [0.05,0.20], [0.22,0.67], [0.56,1.17], [1.10,1.48], [1.63,1.56],
  [1.88,1.28], [1.80,0.90], [1.55,0.51], [0.94,0.24], [0.28,-0.04],
];
const hindwing: [number, number][] = [
  [0.08,0.08], [0.58,0.08], [1.19,-0.10], [1.51,-0.46], [1.45,-0.89],
  [1.19,-1.09], [0.78,-1.12], [0.38,-0.76], [0.12,-0.27],
];
function samplePolygon(poly: [number,number][], rand:()=>number) {
  const anchor=poly[0];
  const j=Math.floor(rand()*(poly.length-2))+1;
  const a=poly[j],b=poly[j+1];
  const s=Math.sqrt(rand()),v=rand();
  return [anchor[0]*(1-s)+s*(a[0]*(1-v)+b[0]*v),anchor[1]*(1-s)+s*(a[1]*(1-v)+b[1]*v)] as const;
}
function wingData(side:number, upper:boolean, seed:number) {
  const poly=upper?forewing:hindwing;
  const count=upper?2900:2050;
  return createCloud(count,seed,(_,rand,put)=>{
    const [xx,y]=samplePolygon(poly,rand);
    const x=side*xx;
    const z=(rand()-.5)*.055 + Math.sin(xx*Math.PI/1.95)*.065;
    // Black veins run out from the body, plus a wide dark margin.
    const angle=Math.atan2(y-(upper?.20:.04),xx+.06);
    const spokes=upper?7:6;
    const vein=Math.abs(Math.sin(angle*spokes*.5))<.085 && xx>.21;
    const edge= xx>(upper?1.55:1.27) ||
      (upper && y>1.25 && xx>.7) || (!upper && y<-.94) || rand()<.055;
    const black=edge || vein;
    const c=new THREE.Color(black?'#171923':upper?'#ff861d':'#ed6b1a');
    if(!black)c.offsetHSL((rand()-.5)*.02,0,(rand()-.5)*.13);
    put(x,y,z,c,black?1.6+rand()*.65:1.05+rand()*.8);
  });
}
function borderData(side:number,upper:boolean,seed:number){
  const poly=upper?forewing:hindwing;
  return createCloud(850,seed,(i,rand,put)=>{
    const segment=i%poly.length, a=poly[segment],b=poly[(segment+1)%poly.length];
    const t=rand();
    const x=side*(a[0]*(1-t)+b[0]*t);
    const y=a[1]*(1-t)+b[1]*t;
    put(x,y,.06,new THREE.Color('#1d1c23'),1.3+rand()*.7);
  });
}
function spots(side:number,upper:boolean,seed:number){
  return createCloud(360,seed,(i,rand,put)=>{
    // Whitish speckles near the outer black border, characteristic of monarchs.
    const band=Math.floor(rand()*(upper?5:4));
    const x=(upper?.91:.67)+band*(upper?.17:.16)+(rand()-.5)*.07;
    const y=upper ? (1.22-Math.abs(x-1.2)*.62)+(rand()-.5)*.13 :
      -(.61+Math.sin(x*2)*.22)+(rand()-.5)*.11;
    put(side*x,y,.10,new THREE.Color(rand()>.25?'#fff9eb':'#e8ddc7'),.8+rand()*.7);
  });
}
export default function Butterfly({speed=1,brightness=.8,glow=1,glowEnabled=false}:Props){
  const root=useRef<THREE.Group>(null),l=useRef<THREE.Group>(null),r=useRef<THREE.Group>(null);
  const clock=useRef(0);
  const wings=useMemo(()=>[-1,1].map(s=>({
    s, fore:wingData(s,true,5201+(s+1)),hind:wingData(s,false,5301+(s+1)),
    edgeFore:borderData(s,true,5401+(s+1)),edgeHind:borderData(s,false,5501+(s+1)),
    dotsFore:spots(s,true,5601+(s+1)),dotsHind:spots(s,false,5701+(s+1)),
  })),[]);
  const body=useMemo(()=>createCloud(720,5801,(_,rand,put)=>{
    const h=(rand()-.5)*1.65,a=rand()*Math.PI*2,rad=(.042+rand()*.03)*(1-Math.abs(h)*.28);
    put(Math.cos(a)*rad,h,Math.sin(a)*rad,new THREE.Color(h>.50?'#242323':'#302c29'),1.25+rand()*.65);
  }),[]);
  const antennae=useMemo(()=>createCloud(170,5802,(_,rand,put)=>{
    const s=rand()>.5?1:-1,t=rand();
    put(s*(.025+.28*t*t),.73+.36*t,.035+Math.sin(t*Math.PI)*.05,new THREE.Color('#eee7dd'),1+rand()*.5);
  }),[]);
  useFrame((_,dt)=>{
    clock.current+=Math.min(dt,.05)*speed;
    const flap=.14+Math.sin(clock.current*3.6)*.60;
    if(l.current)l.current.rotation.y=flap;
    if(r.current)r.current.rotation.y=-flap;
    if(root.current){root.current.rotation.y=Math.sin(clock.current*.5)*.18;root.current.position.y=Math.sin(clock.current*1.1)*.09;}
  });
  return <group ref={root} scale={.81} position={[0,-.13,0]}>
    {wings.map((w,i)=><group key={w.s} ref={i===0?l:r}>
      <ParticleCloud data={w.fore} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={1.05}/>
      <ParticleCloud data={w.hind} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={1.05}/>
      <ParticleCloud data={w.edgeFore} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={.95}/>
      <ParticleCloud data={w.edgeHind} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={.95}/>
      <ParticleCloud data={w.dotsFore} speed={speed} brightness={brightness*1.08} glow={glow} glowEnabled={glowEnabled} scale={.9}/>
      <ParticleCloud data={w.dotsHind} speed={speed} brightness={brightness*1.08} glow={glow} glowEnabled={glowEnabled} scale={.9}/>
    </group>)}
    <ParticleCloud data={body} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={1}/>
    <ParticleCloud data={antennae} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={.85}/>
  </group>;
}
