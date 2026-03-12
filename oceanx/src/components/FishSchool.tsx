"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Fish({
  offset,
  radius,
  speed,
  size,
  color,
}: {
  offset: number;
  radius: number;
  speed: number;
  size: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    if (meshRef.current) {
      meshRef.current.position.x = Math.sin(t) * radius;
      meshRef.current.position.y = Math.cos(t * 0.7) * radius * 0.3;
      meshRef.current.position.z = Math.cos(t) * radius * 0.5;

      // Face direction of movement
      const nextX = Math.sin(t + 0.01) * radius;
      const nextY = Math.cos((t + 0.01) * 0.7) * radius * 0.3;
      meshRef.current.rotation.y = Math.atan2(
        nextX - meshRef.current.position.x,
        0.01
      );
      meshRef.current.rotation.z = Math.sin(t * 8) * 0.2; // tail wag
    }
  });

  return (
    <group ref={meshRef} scale={size}>
      {/* Body */}
      <mesh>
        <coneGeometry args={[0.15, 0.6, 4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      {/* Tail */}
      <mesh position={[0, 0, 0.35]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.2, 0.15]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

export function FishSchool() {
  const groupRef = useRef<THREE.Group>(null);

  const fishData = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      offset: (i / 25) * Math.PI * 2 + Math.random() * 0.5,
      radius: 4 + Math.random() * 3,
      speed: 0.3 + Math.random() * 0.2,
      size: 0.6 + Math.random() * 0.4,
      color: ["#00f5d4", "#00bbf9", "#4488cc", "#66ccff"][i % 4],
    }));
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[2, -2, -5]}>
      {fishData.map((fish, i) => (
        <Fish key={i} {...fish} />
      ))}
    </group>
  );
}
