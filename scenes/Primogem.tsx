"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleCloud, { createCloud } from "./ParticleCloud";

// Motion Lab — 3D Nine-Point Star inside a Hollow Particle Sphere.
// Keep this filename so /animation/primogem continues to work.
type Props = {
  speed?: number;
  brightness?: number;
  glow?: number;
  glowEnabled?: boolean;
};
type Vec3 = [number, number, number];

// Change these values to customize the sculpture.
const SETTINGS = {
  starPoints: 9, // Number of outer star tips (nine-pointed star)
  starOuterRadius: 1.33, // Distance from center to the nine sharp tips
  starInnerRadius: 0.75, // Distance from center to the nine inward corners
  starDepth: 0.75, // Height of the front/back crystal facets (3D thickness)
  sphereRadius: 1.5, // Hollow sphere radius, must exceed starOuterRadius
  latitudeRings: 1, // Horizontal wire rings around the sphere
  longitudeRings: 3, // Vertical meridian rings around the sphere
  sphereParticles: 3600, // Total points distributed along the wire rings
  starFaceParticles: 6200, // Tiny points on the front and back facets
  starEdgeParticles: 1100, // Points tracing the star outline
  starRidgeParticles: 850, // Points drawing the nine 3D facet ridges
  spinSpeed: 0.23, // Base rotation speed (radians per second)
  cageSpeedMultiplier: -0.63, // Negative means cage spins opposite the star
  bobAmount: 0.065, // Vertical floating distance
  pointScale: 2, // Overall particle point size (not the model scale)
};

const TWO_PI = Math.PI * 2;

// 18 alternating outer tips and inner corners create NINE distinct spikes.
function outlineVertices(): Vec3[] {
  return Array.from({ length: SETTINGS.starPoints * 2 }, (_, i) => {
    const angle = Math.PI / 2 + (i * Math.PI) / SETTINGS.starPoints;
    const radius = i % 2 === 0 ? SETTINGS.starOuterRadius : SETTINGS.starInnerRadius;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius, 0];
  });
}

function lerp3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [
    THREE.MathUtils.lerp(a[0], b[0], t),
    THREE.MathUtils.lerp(a[1], b[1], t),
    THREE.MathUtils.lerp(a[2], b[2], t),
  ];
}

export default function Primogem({
  speed = 1,
  brightness = 0.8,
  glow = 1,
  glowEnabled = false,
}: Props) {
  const sculpture = useRef<THREE.Group>(null);
  const cage = useRef<THREE.Group>(null);
  const crystal = useRef<THREE.Group>(null);
  const elapsed = useRef(0);

  const vertices = useMemo(outlineVertices, []);

  // Each star face consists of triangular facets between the center apex and
  // two adjacent corners. Sampling those triangles gives actual 3D depth.
  const starFaces = useMemo(() => createCloud(SETTINGS.starFaceParticles, 13101, (i, random, put) => {
    const front = i % 3 !== 0;
    const center: Vec3 = [0, 0, front ? SETTINGS.starDepth : -SETTINGS.starDepth];
    const edgeIndex = Math.floor(random() * vertices.length);
    const a = vertices[edgeIndex];
    const b = vertices[(edgeIndex + 1) % vertices.length];
    // Uniform sampling inside a triangle.
    const r1 = Math.sqrt(random());
    const r2 = random();
    const w0 = 1 - r1;
    const w1 = r1 * (1 - r2);
    const w2 = r1 * r2;
    const x = center[0] * w0 + a[0] * w1 + b[0] * w2;
    const y = center[1] * w0 + a[1] * w1 + b[1] * w2;
    const z = center[2] * w0 + a[2] * w1 + b[2] * w2;
    const left = x < 0;
    const color = new THREE.Color().setHSL(
      left ? 0.88 + random() * 0.045 : 0.53 + random() * 0.055,
      0.68 + random() * 0.2,
      0.53 + (front ? 0.1 : 0) + random() * 0.18,
    );
    put(x, y, z, color, 0.95 + random() * 0.75);
  }), [vertices]);

  const starEdges = useMemo(() => createCloud(SETTINGS.starEdgeParticles, 13102, (i, random, put) => {
    const segment = i % vertices.length;
    const t = random();
    const front = i % 4 !== 0;
    const a: Vec3 = [vertices[segment][0], vertices[segment][1], front ? 0.02 : -0.02];
    const b: Vec3 = [vertices[(segment + 1) % vertices.length][0], vertices[(segment + 1) % vertices.length][1], front ? 0.02 : -0.02];
    const p = lerp3(a, b, t);
    const color = new THREE.Color(random() > 0.5 ? '#e3edff' : '#bcdcf9');
    put(...p, color, 1.2 + random() * 0.55);
  }), [vertices]);

  const starRidges = useMemo(() => createCloud(SETTINGS.starRidgeParticles, 13103, (i, random, put) => {
    const tip = (i % SETTINGS.starPoints) * 2;
    const front = i % 5 !== 0;
    const apex: Vec3 = [0, 0, front ? SETTINGS.starDepth : -SETTINGS.starDepth];
    const p = lerp3(apex, vertices[tip], random());
    const color = new THREE.Color(random() > 0.48 ? '#fff0fa' : '#bbebff');
    put(...p, color, 0.95 + random() * 0.6);
  }), [vertices]);

  // Hollow globe: only points on latitude / longitude curves. NO solid sphere mesh.
  const wireSphere = useMemo(() => createCloud(SETTINGS.sphereParticles, 13104, (i, random, put) => {
    const latPart = i % 2 === 0;
    const R = SETTINGS.sphereRadius;
    let x: number, y: number, z: number;
    if (latPart) {
      const band = Math.floor(random() * SETTINGS.latitudeRings) + 1;
      const phi = (band * Math.PI) / (SETTINGS.latitudeRings + 1);
      const theta = random() * TWO_PI;
      x = R * Math.sin(phi) * Math.cos(theta);
      y = R * Math.cos(phi);
      z = R * Math.sin(phi) * Math.sin(theta);
    } else {
      const meridian = Math.floor(random() * SETTINGS.longitudeRings);
      const theta = (meridian * Math.PI) / SETTINGS.longitudeRings;
      const phi = random() * TWO_PI;
      x = R * Math.sin(phi) * Math.cos(theta);
      y = R * Math.cos(phi);
      z = R * Math.sin(phi) * Math.sin(theta);
    }
    const color = new THREE.Color().setHSL(
      x < 0 ? 0.88 + random() * 0.05 : 0.53 + random() * 0.055,
      0.72,
      0.58 + random() * 0.20,
    );
    put(x, y, z, color, 0.85 + random() * 0.68);
  }), []);

  // A few fine star-like specks in the empty space outside the wire globe.
  const satellites = useMemo(() => createCloud(160, 13105, (_, random, put) => {
    const azimuth = random() * TWO_PI;
    const cosPolar = random() * 2 - 1;
    const polarRadius = Math.sqrt(1 - cosPolar * cosPolar);
    const radius = SETTINGS.sphereRadius + 0.13 + random() * 0.38;
    const color = new THREE.Color(random() > 0.5 ? '#b9e8ff' : '#ffd8fa');
    put(radius * polarRadius * Math.cos(azimuth), radius * cosPolar, radius * polarRadius * Math.sin(azimuth), color, 0.65 + random() * 0.4);
  }), []);

  useFrame((_, delta) => {
    elapsed.current += Math.min(delta, 0.05) * speed;
    const t = elapsed.current;
    if (sculpture.current) {
      sculpture.current.position.y = Math.sin(t * 1.15) * SETTINGS.bobAmount;
      sculpture.current.rotation.z = Math.sin(t * 0.35) * 0.05;
    }
    if (crystal.current) {
      crystal.current.rotation.y = t * SETTINGS.spinSpeed;
      crystal.current.rotation.x = 0.14 + Math.sin(t * 0.45) * 0.08;
    }
    if (cage.current) {
      cage.current.rotation.y = t * SETTINGS.spinSpeed * SETTINGS.cageSpeedMultiplier;
      cage.current.rotation.z = t * 0.065;
    }
  });

  const s = SETTINGS.pointScale;
  return (
    <group ref={sculpture}>
      <group ref={crystal}>
        <ParticleCloud data={starFaces} speed={speed} brightness={brightness} glow={glow} glowEnabled={glowEnabled} scale={s} />
        <ParticleCloud data={starEdges} speed={speed} brightness={brightness * 1.1} glow={glow} glowEnabled={glowEnabled} scale={s} />
        <ParticleCloud data={starRidges} speed={speed} brightness={brightness * 1.06} glow={glow} glowEnabled={glowEnabled} scale={s} />
      </group>
      <group ref={cage}>
        <ParticleCloud data={wireSphere} speed={speed} brightness={brightness * 0.92} glow={glow} glowEnabled={glowEnabled} scale={s} />
        <ParticleCloud data={satellites} speed={speed} brightness={brightness * 0.78} glow={glow} glowEnabled={glowEnabled} scale={s * 0.8} />
      </group>
    </group>
  );
}
