"use client";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import type { Work } from "@/lib/works";

const Heart = dynamic(() => import("@/scenes/ParticleHeart"), { ssr: false });
const Tree = dynamic(() => import("@/scenes/ChristmasTree"), { ssr: false });
const Galaxy = dynamic(() => import("@/scenes/SpiralGalaxy"), { ssr: false });
const Wave = dynamic(() => import("@/scenes/ParticleWave"), { ssr: false });

export default function SceneCanvas({ slug, large = false }: { slug: Work["slug"]; large?: boolean }) {
  return <div className={`scene scene-${slug}`} aria-label={`${slug} animated particle artwork`}>
    <Canvas dpr={[1, 1.6]} camera={{position: [0, 0, slug === "particle-wave" ? 7 : slug === "spiral-galaxy" ? 6 : 5.5], fov: large ? 44 : 52}} gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}>
      <Suspense fallback={null}>
        <ambientLight intensity={.7}/>
        {slug === "particle-heart" && <Heart />}
        {slug === "christmas-tree" && <Tree />}
        {slug === "spiral-galaxy" && <Galaxy />}
        {slug === "particle-wave" && <Wave />}
      </Suspense>
    </Canvas>
    <div className="scene-grain" />
  </div>;
}
