"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { particleVertexShader, particleFragmentShader } from "@/shaders/caustics";

export function FloatingParticles({ count = 500 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, sizes, speeds, offsets } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const sp = new Float32Array(count);
    const off = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      sz[i] = Math.random() * 3 + 0.5;
      sp[i] = Math.random() * 0.5 + 0.1;
      off[i] = Math.random() * Math.PI * 2;
    }

    return { positions: pos, sizes: sz, speeds: sp, offsets: off };
  }, [count]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          args={[speeds, 1]}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          args={[offsets, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#00f5d4") },
        }}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
