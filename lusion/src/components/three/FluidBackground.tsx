"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMouse } from "@/hooks/useMouse";
import { useScrollProgress } from "@/hooks/useScrollProgress";

import { fluidVertex as vertexShader, fluidFragment as fragmentShader } from "@/shaders";

export default function FluidBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useMouse();
  const scrollProgress = useScrollProgress();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1920, 1080) },
      uScrollProgress: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
    material.uniforms.uScrollProgress.value = scrollProgress.current;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <planeGeometry args={[12, 8, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
