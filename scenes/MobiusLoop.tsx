"use client";
// Motion Lab — Mobius Loop v1.0.0
// Dependencies: react, three, @react-three/fiber; dev: @types/three.
// Usage: import MobiusLoop from './MobiusLoop'; render <MobiusLoop /> outside any Canvas.
// Concept: cyan-to-lilac grains weave around a single twisted ribbon.
// Move mouse or drag horizontally to tilt; release to settle. Page vertical scroll remains enabled.
// Ranges: count 300–12000 (default 2600); size 0.005–0.035 world units (0.012);
// speed 0–2 (0.35); flutter 0–0.2 world units (0.045); interaction 0–1 (0.55).
// mobile=true caps count at 1600 and DPR at 1; default desktop DPR capped at 1.5.
// Glow is off by default. The shared ParticleCloud shader handles brightness and glow.
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleCloud from "./ParticleCloud";

type Props = { count?: number; size?: number; speed?: number; flutter?: number;
  interaction?: number; mobile?: boolean; reducedMotion?: boolean; embedded?: boolean; label?: string; brightness?: number; glow?: number; glowEnabled?: boolean };
const clamp = THREE.MathUtils.clamp;
function Ribbon({ count, size, speed, flutter, interaction, reduced, target, brightness, glow, glowEnabled }: {
  count: number; size: number; speed: number; flutter: number; interaction: number;
  reduced: boolean; target: React.RefObject<number>;
  brightness: number; glow: number; glowEnabled: boolean;
}) {
  const points = useRef<THREE.Group>(null);
  const time = useRef(0);
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count).fill(1.8);
    const phases = new Float32Array(count);
    const uv = new Float32Array(count * 2);
    let seed = 8127;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    const a = new THREE.Color('#75d7ef'), b = new THREE.Color('#c7a3eb');
    for (let i = 0; i < count; i++) {
      uv[2*i] = random() * Math.PI * 2;
      uv[2*i+1] = (random() - 0.5) * 0.85;
      const color = a.clone().lerp(b, (Math.sin(uv[2*i]) + 1) / 2);
      phases[i] = uv[2*i];
      color.toArray(colors, 3*i);
    }
    return { positions, colors, sizes, phases, uv };
  }, [count]);
  useFrame((_, delta) => {
    time.current += reduced ? 0 : Math.min(delta, 0.05) * speed;
    for (let i=0; i<count; i++) {
      const u = data.uv[2*i] + time.current;
      const v = data.uv[2*i+1];
      const r = 1.15 + v * Math.cos(u/2);
      data.positions[3*i] = r * Math.cos(u);
      data.positions[3*i+1] = v * Math.sin(u/2);
      data.positions[3*i+2] = r * Math.sin(u) + (reduced ? 0 : flutter * Math.sin(u*5 + time.current*2));
    }
    if (points.current) {
      points.current.rotation.x = reduced ? 0.7 : THREE.MathUtils.damp(points.current.rotation.x, 0.7 + target.current * interaction, 5, Math.min(delta,0.05));
    }
  });
  return <group ref={points} rotation={[0.7, 0, 0]}>
    <ParticleCloud data={data} dynamic speed={reduced ? 0 : speed} scale={size / 0.012}
      brightness={brightness} glow={glow} glowEnabled={glowEnabled} />
  </group>;
}
export default function MobiusLoop({ count=2600, size=0.012, speed=0.35,
  flutter=0.045, interaction=0.55, mobile=false, reducedMotion, embedded=false, label="Mobius Loop: a twisted cyan and lilac particle ribbon.", brightness=0.8, glow=1, glowEnabled=false }: Props) {
  const [systemReduced, setSystemReduced] = useState(true);
  const target = useRef(0);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduced(query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const reduced = reducedMotion ?? systemReduced;
  return <div role="img" aria-label={label}
    style={{ width:'100%', height:embedded ? '100%' : 'min(70vh, 560px)', minHeight:embedded ? 0 : 280, touchAction:'pan-y' }}
    onPointerMove={e => {
      if (!interaction) return;
      if (e.pointerType !== 'mouse' && e.buttons === 0) return;
      const box = e.currentTarget.getBoundingClientRect();
      target.current = clamp((e.clientX-box.left)/box.width*2-1,-1,1);
    }}
    onPointerDown={e => { if (interaction) e.currentTarget.setPointerCapture(e.pointerId); }}
    onPointerUp={() => { target.current=0; }}
    onPointerCancel={() => { target.current=0; }}
    onLostPointerCapture={() => { target.current=0; }}
    onPointerLeave={() => { target.current=0; }}>
    <Canvas dpr={mobile ? 1 : [1,1.5]} camera={{position:[0,0,5.5], fov:45}}
      gl={{antialias:false, alpha:true}}>
      <Ribbon count={Math.min(mobile ? 1600 : 12000, Math.floor(clamp(count,300,12000)))}
        size={clamp(size,0.005,0.035)} speed={clamp(speed,0,2)}
        flutter={clamp(flutter,0,0.2)} interaction={clamp(interaction,0,1)}
        reduced={reduced} target={target} brightness={brightness} glow={glow} glowEnabled={glowEnabled} />
    </Canvas>
  </div>;
}
