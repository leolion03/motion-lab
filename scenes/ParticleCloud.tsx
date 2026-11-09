"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type CloudData = {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  phases: Float32Array;
};

const vertex = `
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
varying vec3 vColor;
varying float vTwinkle;
uniform float uTime;
uniform float uScale;
uniform float uPixelRatio;
uniform float uBrightness;
void main(){
  vColor = aColor;
  vTwinkle = 0.76 + 0.24 * sin(uTime * 1.7 + aPhase);
  vec4 viewPos = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewPos;
  // Stable, fine-grained screen-space specks in both gallery and detail canvases.
  // No viewport-height multiplication: full-screen works do not become large discs.
  float perspective = clamp(5.5 / max(2.5, -viewPos.z), 0.65, 1.45);
  float diameter = aSize * uScale * 0.62 * perspective;
  gl_PointSize = clamp(diameter, 0.8, 4.2) * uPixelRatio;
}
`;
const fragment = `
varying vec3 vColor;
varying float vTwinkle;
uniform float uBrightness;
uniform float uGlowEnabled;
uniform float uGlowIntensity;
void main(){
  float radius = length(gl_PointCoord - vec2(0.5));
  // The tiny opaque-ish center stays the SAME diameter with Glow on or off.
  float core = 1.0 - smoothstep(0.12, 0.30, radius);
  // Glow adds a faint edge inside the existing point sprite, not bigger geometry.
  float halo = (1.0 - smoothstep(0.20, 0.49, radius)) * 0.30 * uGlowIntensity;
  float alpha = clamp(core * 0.87 + uGlowEnabled * halo * (1.0 - core), 0.0, 1.0);
  if (alpha < 0.015) discard;
  float light = uBrightness * (0.91 + 0.09 * vTwinkle);
  gl_FragColor = vec4(vColor * light, clamp(alpha, 0.0, 1.0));
}
`;

export function makeRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function createCloud(count: number, seed: number, fill: (i: number, rand: () => number, put: (x: number, y: number, z: number, color: THREE.Color, size: number) => void) => void): CloudData {
  const rand = makeRandom(seed);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    fill(i, rand, (x, y, z, c, size) => {
      positions.set([x, y, z], i * 3);
      colors.set([c.r, c.g, c.b], i * 3);
      sizes[i] = size;
    });
    phases[i] = rand() * Math.PI * 2;
  }
  return { positions, colors, sizes, phases };
}

export default function ParticleCloud({
  data, speed = 1, scale = 1, brightness = 0.8, glow = 1, glowEnabled = false, dynamic = false,
}: {
  data: CloudData;
  speed?: number;
  scale?: number;
  brightness?: number;
  glow?: number;
  glowEnabled?: boolean;
  dynamic?: boolean;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useRef<THREE.BufferGeometry>(null);
  // Keep the uniform object stable; update its values once per frame.
  // Particle sprites are sized in CSS pixels and converted using devicePixelRatio.
  // This prevents large detail canvases from inflating individual particle dots.
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScale: { value: scale },
    uPixelRatio: { value: 1 },
    uBrightness: { value: brightness },
    uGlowEnabled: { value: 0 },
    uGlowIntensity: { value: glow },
  }), []);
  useFrame((state, dt) => {
    if (dynamic && geometry.current) {
      const attr = geometry.current.getAttribute("position") as THREE.BufferAttribute | undefined;
      if (attr) attr.needsUpdate = true;
    }
    const m = material.current;
    if (!m) return;
    const u = m.uniforms;
    u.uTime.value += Math.min(dt, 0.05) * speed;
    u.uScale.value = scale;
    u.uBrightness.value = brightness;
    u.uGlowEnabled.value = glowEnabled ? 1 : 0;
    u.uGlowIntensity.value = glow;
    u.uPixelRatio.value = state.gl.getPixelRatio();
  });
  return <points frustumCulled={false}>
    <bufferGeometry ref={geometry}>
      <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
      <bufferAttribute attach="attributes-aColor" args={[data.colors, 3]} />
      <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
      <bufferAttribute attach="attributes-aPhase" args={[data.phases, 1]} />
    </bufferGeometry>
    <shaderMaterial ref={material} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms}
      transparent depthWrite={false} blending={glowEnabled ? THREE.AdditiveBlending : THREE.NormalBlending} toneMapped={false} />
  </points>;
}
