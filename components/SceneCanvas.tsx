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

const JellyfishScene = dynamic(() => import("@/scenes/Jellyfish"), { ssr: false });

const BloomingFlowerScene = dynamic(() => import("@/scenes/BloomingFlower"), { ssr: false });

const ButterflyScene = dynamic(() => import("@/scenes/Butterfly"), { ssr: false });

const FountainScene = dynamic(() => import("@/scenes/Fountain"), { ssr: false });

const BirthdayCakeScene = dynamic(() => import("@/scenes/BirthdayCake"), { ssr: false });

const SaturnScene = dynamic(() => import("@/scenes/Saturn"), { ssr: false });

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
  slug, large = false, interactive = false, paused = false, speed = 1, brightness = 0.8, glow = 1, glowEnabled = false, resetSignal = 0,
}: {
  slug: Work["slug"];
  large?: boolean;
  interactive?: boolean;
  paused?: boolean;
  speed?: number;
  brightness?: number;
  glow?: number;
  glowEnabled?: boolean;
  resetSignal?: number;
}) {
  const effectiveSpeed = paused ? 0 : speed;
  return <div className={`scene scene-${slug} ${interactive ? "scene-interactive" : "scene-preview"}`} role="img" aria-label={`${slug.replaceAll("-", " ")} animated particle artwork`}>
    <Canvas
      dpr={[1, 1.65]}
      camera={{ position: [0, 0, slug === "particle-wave" || slug === "fountain" ? 7 : slug === "spiral-galaxy" ? 6 : 5.5], fov: 52 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} />
        {slug === "particle-heart" && <Heart speed={effectiveSpeed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} />}
        {slug === "christmas-tree" && <Tree speed={effectiveSpeed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} />}
        {slug === "spiral-galaxy" && <Galaxy speed={effectiveSpeed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} />}
        {slug === "particle-wave" && <Wave speed={effectiveSpeed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} />}
        {slug === "jellyfish" && <JellyfishScene speed={effectiveSpeed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} />}
        {slug === "blooming-flower" && <BloomingFlowerScene speed={effectiveSpeed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} />}
        {slug === "butterfly" && <ButterflyScene speed={effectiveSpeed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} />}
        {slug === "fountain" && <FountainScene speed={effectiveSpeed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} />}
        {slug === "birthday-cake" && <BirthdayCakeScene speed={effectiveSpeed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} />}
        {slug === "saturn" && <SaturnScene speed={effectiveSpeed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} />}
        {interactive && <CameraControls resetSignal={resetSignal} />}
      </Suspense>
    </Canvas>
    <div className="scene-grain" />
  </div>;
}
