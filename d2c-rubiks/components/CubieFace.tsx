"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cubeVertexShader, cubeFragmentShader } from "@/lib/shaders";

interface CubieFaceProps {
  color: THREE.Color;
  position: [number, number, number];
  rotation: [number, number, number];
}

export default function CubieFace({ color, position, rotation }: CubieFaceProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uColor: { value: color },
      uTime: { value: 0 },
      uLightPosition: { value: new THREE.Vector3(5, 8, 5) },
      uGloss: { value: 0.85 },
      uFresnelPower: { value: 3.0 },
    }),
    [color]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[0.85, 0.85]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={cubeVertexShader}
        fragmentShader={cubeFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
