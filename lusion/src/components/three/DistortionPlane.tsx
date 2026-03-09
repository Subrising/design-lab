"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMouse } from "@/hooks/useMouse";
import { useScrollProgress } from "@/hooks/useScrollProgress";

import { distortionVertex as vertexShader, distortionFragment as fragmentShader } from "@/shaders";

export default function DistortionPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useMouse();
  const scrollProgress = useScrollProgress();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 1.0 },
      uScrollProgress: { value: 0 },
      uColor1: { value: new THREE.Color(0x0a0118) },
      uColor2: { value: new THREE.Color(0x1a0a3e) },
      uColor3: { value: new THREE.Color(0x2d1b69) },
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
    <mesh ref={meshRef} position={[0, 0, -1]} scale={[8, 6, 1]}>
      <planeGeometry args={[1, 1, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
