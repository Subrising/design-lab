"use client";

import { useRef, useMemo, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { particleVertexShader as vertexShader, particleFragmentShader as fragmentShader } from "../shaders";

const PARTICLE_COUNT = 15000;
const TEXT_STRINGS = ["ACTIVE", "THEORY", "CREATE", "EXPLORE"];

function getTextPositions(
  text: string,
  count: number,
  spread: number = 4
): Float32Array {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = 1024;
  canvas.height = 256;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "bold 180px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // Collect all white pixel positions
  const validPositions: [number, number][] = [];
  const step = 2; // Sample every 2 pixels for density
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const i = (y * canvas.width + x) * 4;
      if (pixels[i] > 128) {
        validPositions.push([x, y]);
      }
    }
  }

  const positions = new Float32Array(count * 3);
  const aspect = canvas.width / canvas.height;

  for (let i = 0; i < count; i++) {
    if (validPositions.length > 0) {
      const idx = Math.floor(Math.random() * validPositions.length);
      const [px, py] = validPositions[idx];

      // Map canvas coords to 3D space
      const x = ((px / canvas.width) - 0.5) * spread * aspect;
      const y = ((1 - py / canvas.height) - 0.5) * spread;
      const z = (Math.random() - 0.5) * 0.3;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    } else {
      // Fallback: random sphere distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * spread;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
  }

  return positions;
}

function getShapePositions(
  shape: "sphere" | "cube" | "torus" | "spiral",
  count: number,
  scale: number = 2.5
): Float32Array {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    let x = 0, y = 0, z = 0;

    switch (shape) {
      case "sphere": {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = Math.cbrt(Math.random()) * scale;
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
        break;
      }
      case "cube": {
        x = (Math.random() - 0.5) * scale * 2;
        y = (Math.random() - 0.5) * scale * 2;
        z = (Math.random() - 0.5) * scale * 2;
        // Bias towards surfaces
        const face = Math.floor(Math.random() * 6);
        if (face === 0) x = -scale;
        else if (face === 1) x = scale;
        else if (face === 2) y = -scale;
        else if (face === 3) y = scale;
        else if (face === 4) z = -scale;
        else z = scale;
        break;
      }
      case "torus": {
        const theta2 = Math.random() * Math.PI * 2;
        const phi2 = Math.random() * Math.PI * 2;
        const R = scale;
        const r2 = scale * 0.4;
        x = (R + r2 * Math.cos(phi2)) * Math.cos(theta2);
        y = r2 * Math.sin(phi2);
        z = (R + r2 * Math.cos(phi2)) * Math.sin(theta2);
        break;
      }
      case "spiral": {
        const t = (i / count) * Math.PI * 8;
        const r3 = (i / count) * scale;
        x = r3 * Math.cos(t);
        y = ((i / count) - 0.5) * scale * 3;
        z = r3 * Math.sin(t);
        break;
      }
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  return positions;
}

interface ParticleEngineProps {
  targetIndex: number;
  explosion: number;
}

export default function ParticleEngine({ targetIndex, explosion }: ParticleEngineProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const mouseRef = useRef(new THREE.Vector2(0, 0));

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // All target formations
  const targets = useMemo(() => {
    if (typeof document === "undefined") return [];
    return [
      ...TEXT_STRINGS.map((t) => getTextPositions(t, PARTICLE_COUNT)),
      getShapePositions("sphere", PARTICLE_COUNT),
      getShapePositions("torus", PARTICLE_COUNT),
      getShapePositions("cube", PARTICLE_COUNT),
      getShapePositions("spiral", PARTICLE_COUNT),
    ];
  }, []);

  // Initial random positions
  const { positions, sizes, randoms, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const randoms = new Float32Array(PARTICLE_COUNT);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    const accentColor = new THREE.Color("#00ffaa");
    const dimColor = new THREE.Color("#00aa77");
    const whiteColor = new THREE.Color("#ffffff");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Start in a dispersed cloud
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 6;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      sizes[i] = 1.5 + Math.random() * 3.0;
      randoms[i] = Math.random();

      // Color palette: mix of accent, dim, and some white highlights
      const colorChoice = Math.random();
      let color: THREE.Color;
      if (colorChoice < 0.5) color = accentColor;
      else if (colorChoice < 0.8) color = dimColor;
      else color = whiteColor;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, sizes, randoms, colors };
  }, []);

  // Animate target transitions
  const currentTargetRef = useRef<Float32Array | null>(null);
  const prevTargetRef = useRef<Float32Array | null>(null);
  const transitionRef = useRef(0);

  useEffect(() => {
    if (targets.length === 0) return;
    const safeIndex = targetIndex % targets.length;
    prevTargetRef.current = currentTargetRef.current;
    currentTargetRef.current = targets[safeIndex];
    transitionRef.current = 0;
  }, [targetIndex, targets]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !materialRef.current) return;

    const material = materialRef.current;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uExplosion.value = explosion;
    material.uniforms.uMouse.value.set(mouseRef.current.x * 2, mouseRef.current.y * 2);
    material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);

    // Smoothly transition target positions
    const geometry = pointsRef.current.geometry;
    const targetAttr = geometry.getAttribute("aTarget") as THREE.BufferAttribute;

    if (currentTargetRef.current) {
      transitionRef.current = Math.min(transitionRef.current + delta * 1.5, 1);
      const t = transitionRef.current;
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      if (prevTargetRef.current) {
        for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
          targetAttr.array[i] =
            prevTargetRef.current[i] * (1 - eased) +
            currentTargetRef.current[i] * eased;
        }
      } else {
        for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
          targetAttr.array[i] = currentTargetRef.current[i];
        }
      }
      targetAttr.needsUpdate = true;
    }
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uExplosion: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseRadius: { value: 0.3 },
      uPixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
    }),
    []
  );

  // Initial target positions (same as positions until first real target loads)
  const initialTargets = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aTarget"
          args={[initialTargets, 3]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          args={[randoms, 1]}
        />
        <bufferAttribute
          attach="attributes-aColor"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
