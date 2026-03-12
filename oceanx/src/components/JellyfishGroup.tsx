"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { jellyfishVertexShader, jellyfishFragmentShader } from "@/shaders/caustics";

function Jellyfish({
  position,
  color,
  glowColor,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  glowColor: string;
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const initialY = position[1];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
    }
    if (groupRef.current) {
      groupRef.current.position.y = initialY + Math.sin(t * 0.3 + position[0]) * 1.5;
      groupRef.current.position.x = position[0] + Math.sin(t * 0.2 + position[2]) * 0.5;
      groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.1;
    }
  });

  const uniforms = {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
    uGlowColor: { value: new THREE.Color(glowColor) },
  };

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Bell / dome */}
      <mesh>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={jellyfishVertexShader}
          fragmentShader={jellyfishFragmentShader}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Inner glow */}
      <mesh scale={0.7}>
        <sphereGeometry args={[1, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Tentacles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = 0.6;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, -0.3, Math.sin(angle) * r]}
          >
            <cylinderGeometry args={[0.02, 0.01, 2.5, 4]} />
            <meshBasicMaterial
              color={glowColor}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}

      {/* Point light for bioluminescence */}
      <pointLight color={glowColor} intensity={0.8} distance={5} />
    </group>
  );
}

export function JellyfishGroup() {
  return (
    <group>
      <Jellyfish
        position={[-5, 3, -4]}
        color="#1a0040"
        glowColor="#9b5de5"
        scale={0.8}
      />
      <Jellyfish
        position={[3, 1, -6]}
        color="#002040"
        glowColor="#00bbf9"
        scale={1.2}
      />
      <Jellyfish
        position={[-2, -1, -3]}
        color="#200030"
        glowColor="#f15bb5"
        scale={0.6}
      />
      <Jellyfish
        position={[6, 4, -8]}
        color="#001a33"
        glowColor="#00f5d4"
        scale={0.5}
      />
    </group>
  );
}
