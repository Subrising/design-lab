"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { causticVertexShader, causticFragmentShader } from "@/shaders/caustics";

export function CausticPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[40, 40, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={causticVertexShader}
        fragmentShader={causticFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#00bbf9") },
          uIntensity: { value: 1.2 },
        }}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}
