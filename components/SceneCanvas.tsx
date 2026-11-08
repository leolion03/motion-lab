"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Work } from "@/lib/works";

const Heart = dynamic(() => import("@/scenes/ParticleHeart"), { ssr: false });
const Tree = dynamic(() => import("@/scenes/ChristmasTree"), { ssr: false });
const Galaxy = dynamic(() => import("@/scenes/SpiralGalaxy"), { ssr: false });
const Wave = dynamic(() => import("@/scenes/ParticleWave"), { ssr: false });

function CameraControls({ resetSignal }: { resetSignal: number }) {
  const controls = useRef<OrbitControlsImpl>(null);
  useEffect(() => { controls.current?.reset(); }, [resetSignal]);
  return <OrbitControls
    ref={controls}
    enableDamping dampingFactor={0.07}
    enablePan={false} enableZoom
    minDistance={3.2} maxDistance={11}
    minPolarAngle={0.25} maxPolarAngle={Math.PI - 0.25}
  />;
}

export default function SceneCanvas({
  slug, large = false, interactive = false, paused = false, speed = 1, resetSignal = 0,
}: {
  slug: Work["slug"];
  large?: boolean;
  interactive?: boolean;
  paused?: boolean;
  speed?: number;
  resetSignal?: number;
}) {
  const effectiveSpeed = paused ? 0 : speed;
  return <div className={`scene scene-${slug} ${interactive ? "scene-interactive" : "scene-preview"}`} role="img" aria-label={`${slug.replaceAll("-", " ")} animated particle artwork`}>
    <Canvas
      dpr={[1, 1.65]}
      camera={{ position: [0, 0, slug === "particle-wave" ? 7 : slug === "spiral-galaxy" ? 6 : 5.5], fov: large ? 44 : 52 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} />
        {slug === "particle-heart" && <Heart speed={effectiveSpeed} />}
        {slug === "christmas-tree" && <Tree speed={effectiveSpeed} />}
        {slug === "spiral-galaxy" && <Galaxy speed={effectiveSpeed} />}
        {slug === "particle-wave" && <Wave speed={effectiveSpeed} />}
        {interactive && <CameraControls resetSignal={resetSignal} />}
      </Suspense>
    </Canvas>
    <div className="scene-grain" />
  </div>;
}
