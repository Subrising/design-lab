"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMouse } from "@/hooks/useMouse";

import { fluidVertex as vertexShader, transitionFragment as fragmentShader } from "@/shaders";

interface TransitionOverlayProps {
  progress: number;
}

export default function TransitionOverlay({ progress }: TransitionOverlayProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useMouse();

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uProgress.value = progress;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
  });

  if (progress <= 0) return null;

  return (
    <mesh ref={meshRef} position={[0, 0, 1]} renderOrder={999}>
      <planeGeometry args={[12, 8, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthTest={false}
      />
    </mesh>
  );
}
