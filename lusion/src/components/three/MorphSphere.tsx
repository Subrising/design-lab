"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMouse } from "@/hooks/useMouse";

import { morphVertex as vertexShader, morphFragment as fragmentShader } from "@/shaders";

interface MorphSphereProps {
  morphProgress: number;
}

export default function MorphSphere({ morphProgress }: MorphSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useMouse();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorphProgress: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uMorphProgress.value = morphProgress;
    material.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);

    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
