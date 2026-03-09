"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { particlesVertex, particlesFragment } from "@/shaders";

interface ParticlesProps {
  scrollProgress: React.MutableRefObject<number>;
  count?: number;
}

export default function Particles({ scrollProgress, count = 600 }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, scales, speeds, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    const spd = new Float32Array(count);
    const phs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
      scl[i] = 0.5 + Math.random() * 2.0;
      spd[i] = 0.2 + Math.random() * 0.8;
      phs[i] = Math.random() * Math.PI * 2;
    }

    return { positions: pos, scales: scl, speeds: spd, phases: phs };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScrollProgress: { value: 0 },
      uPixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
      uColor: { value: new THREE.Color("#88aaff") },
    }),
    []
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uScrollProgress.value = scrollProgress.current;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={particlesVertex}
        fragmentShader={particlesFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
