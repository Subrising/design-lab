"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GalleryItem, SPACING } from "@/lib/gallery-data";

// ─── Vertex Shader ───────────────────────────────────────────────────────────
// Scroll velocity drives sinusoidal wave displacement in Z and X.
// The plane is subdivided (32×32) so the wave has enough geometry to deform.
const vertexShader = /* glsl */ `
  uniform float uVelocity;
  uniform float uTime;

  varying vec2 vUv;
  varying float vVelocity;

  void main() {
    vUv = uv;
    vVelocity = uVelocity;

    vec3 pos = position;
    float amp = uVelocity * 0.22;
    float t   = uTime * 2.8;

    // Primary wave: arches the full height of the plane
    pos.z += sin(uv.y * 3.14159 + t) * amp;
    // Secondary wave: horizontal ripple at half amplitude
    pos.z += cos(uv.x * 6.28318 + t * 0.65) * amp * 0.45;
    // Lateral drift: more pronounced near the top edge
    pos.x += sin(uv.y * 3.14159 + t * 0.9) * amp * 0.28 * uv.y;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// ─── Fragment Shader ──────────────────────────────────────────────────────────
// Procedural photographic texture using layered fBm noise.
// Three palette colours (shadows → midtones → highlights) blend through the noise field.
// Vignette + film grain + velocity chromatic edge glow.
const fragmentShader = /* glsl */ `
  uniform vec3  uColor1;     // shadow / dark tones
  uniform vec3  uColor2;     // midtones
  uniform vec3  uColor3;     // highlights / accent colour
  uniform float uTime;
  uniform float uProximity;  // 0 = far plane, 1 = nearest plane

  varying vec2  vUv;
  varying float vVelocity;

  // ── Noise helpers ──────────────────────────────────────────────────────────
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),               hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // 6-octave fractal Brownian motion
  float fbm(vec2 p) {
    float v = 0.0, amp = 0.5;
    for (int i = 0; i < 6; i++) {
      v   += amp * noise(p);
      p    = p * 2.07 + vec2(1.7, 9.2);
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    // ── UV distortion from scroll velocity ──────────────────────────────────
    vec2 uv = vUv;
    // Barrel-stretch the UVs slightly — faster scrolling = more stretch
    uv.y += vVelocity * sin(uv.x * 3.14159) * 0.045;
    uv.x += vVelocity * sin(uv.y * 3.14159) * 0.018;

    // ── Layered noise texture ────────────────────────────────────────────────
    // Large scale: determines the basic tonal regions
    float n1 = fbm(uv * 1.9 + uTime * 0.025);
    // Mid scale: adds mid-frequency structure
    float n2 = fbm(uv * 4.8 - uTime * 0.018 + vec2(3.1, 7.2));
    // Fine scale: creates grain and micro-detail driven by coarser layers
    float n3 = fbm(uv * 13.0 + vec2(n1 * 2.1, n2 * 2.1));

    // ── Colour composition ───────────────────────────────────────────────────
    vec3 col = uColor1;
    // Broad tonal gradient: shadows → midtones
    col = mix(col, uColor2, smoothstep(0.25, 0.72, n1));
    // Sparse accent highlights where noise is locally high
    col = mix(col, uColor3, pow(max(0.0, n2 * n3 - 0.28), 1.6) * 0.62);
    // Subtle micro-contrast from fine grain layer
    col += (n3 - 0.5) * 0.055;

    // ── Vignette ─────────────────────────────────────────────────────────────
    // Darkens toward the frame edges, bright at centre
    vec2  centred  = uv - 0.5;
    float vignette = 1.0 - dot(centred, centred) * 1.7;
    vignette = clamp(pow(vignette, 0.38), 0.0, 1.0);
    col = mix(uColor1 * 0.12, col, vignette);

    // ── Film grain ────────────────────────────────────────────────────────────
    float grain = (hash(uv * 1400.0 + fract(uTime * 0.08)) - 0.5) * 0.02;
    col += grain;

    // ── Proximity fade ────────────────────────────────────────────────────────
    // Distant planes are barely visible — creates a sense of depth tunnel
    col = mix(uColor1 * 0.04, col, uProximity);

    // ── Velocity chromatic edge glow ──────────────────────────────────────────
    // Fast scrolling bleeds the accent colour onto the frame perimeter
    float edgeGlow = (1.0 - vignette) * pow(vVelocity, 1.8) * 0.38;
    col += uColor3 * edgeGlow;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────

interface ImagePlaneProps {
  item: GalleryItem;
  index: number;
  scrollRef: React.MutableRefObject<{ current: number; velocity: number }>;
}

export function ImagePlane({ item, index, scrollRef }: ImagePlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uColor1:    { value: new THREE.Color(...item.col1) },
      uColor2:    { value: new THREE.Color(...item.col2) },
      uColor3:    { value: new THREE.Color(...item.col3) },
      uTime:      { value: 0 },
      uVelocity:  { value: 0 },
      uProximity: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item.id]
  );

  useFrame(({ clock, camera }) => {
    const mat = (meshRef.current?.material as THREE.ShaderMaterial) ?? null;
    if (!mat) return;
    const u = mat.uniforms;

    u.uTime.value = clock.elapsedTime;

    // Normalise velocity into 0-1 range, decay it smoothly
    const targetVel = Math.min(Math.abs(scrollRef.current.velocity) * 0.28, 1.0);
    u.uVelocity.value += (targetVel - u.uVelocity.value) * 0.12;

    // Proximity: 1 when camera is right at this plane, falls off with distance
    const planeZ       = -index * SPACING;
    const dist         = Math.abs(camera.position.z - planeZ);
    const targetProx   = Math.max(0, 1.0 - dist / (SPACING * 1.8));
    u.uProximity.value += (targetProx - u.uProximity.value) * 0.07;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -index * SPACING]}>
      {/* 32×32 subdivision gives 1024 vertices for the wave to deform */}
      <planeGeometry args={[3.0, 1.7, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
