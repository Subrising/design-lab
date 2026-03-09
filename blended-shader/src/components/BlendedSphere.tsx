"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "@/shaders/blendMaterial";

interface BlendedSphereProps {
  mouseRef: React.RefObject<{ x: number; y: number } | null>;
}

export default function BlendedSphere({ mouseRef }: BlendedSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMetallic: { value: 1.0 },
      uGlass: { value: 0.0 },
      uOrganic: { value: 0.0 },
      uLightPos: { value: new THREE.Vector3(5, 5, 5) },
      uTransitionSpeed: { value: 2.0 },
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;

    const mouse = mouseRef.current;
    if (mouse) {
      uniforms.uMouse.value.set(mouse.x, mouse.y);

      // Map mouse position to material blend weights using triangular blending:
      // Top-left = metallic, top-right = glass, bottom-center = organic
      const mx = mouse.x; // -1 to 1
      const my = mouse.y; // -1 to 1

      // Smooth triangular barycentric-ish blend
      const metalTarget = Math.max(0, (-mx * 0.5 + my * 0.5 + 0.5));
      const glassTarget = Math.max(0, (mx * 0.5 + my * 0.5 + 0.5));
      const organicTarget = Math.max(0, (-my * 0.8 + 0.4));

      // Smooth interpolation
      const lerp = 0.04;
      uniforms.uMetallic.value += (metalTarget - uniforms.uMetallic.value) * lerp;
      uniforms.uGlass.value += (glassTarget - uniforms.uGlass.value) * lerp;
      uniforms.uOrganic.value += (organicTarget - uniforms.uOrganic.value) * lerp;
    }

    // Gentle orbit for the light
    uniforms.uLightPos.value.set(
      Math.sin(t * 0.5) * 6,
      Math.cos(t * 0.3) * 4 + 3,
      Math.cos(t * 0.5) * 6
    );

    // Slow rotation
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.8, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
