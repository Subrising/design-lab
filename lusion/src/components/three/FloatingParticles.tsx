"use client";
import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMouse } from "@/hooks/useMouse";
import { useScrollProgress } from "@/hooks/useScrollProgress";

import { particlesVertex as vertexShader, particlesFragment as fragmentShader } from "@/shaders";

const PARTICLE_COUNT = 2000;

export default function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const { mouse } = useMouse();
  const scrollProgress = useScrollProgress();

  const { positions, scales, phases } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const scales = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.5) * 5;

      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);

      scales[i] = Math.random() * 0.8 + 0.2;
      phases[i] = Math.random();
    }

    return { positions, scales, phases };
  }, []);

  useEffect(() => {
    if (!geometryRef.current) return;
    geometryRef.current.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometryRef.current.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geometryRef.current.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  }, [positions, scales, phases]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uPixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
      uScrollProgress: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (!pointsRef.current) return;
    const material = pointsRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
    material.uniforms.uScrollProgress.value = scrollProgress.current;

    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef} />
      <shaderMaterial
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
