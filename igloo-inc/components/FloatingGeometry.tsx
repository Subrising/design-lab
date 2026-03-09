"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  type: "icosahedron" | "torus" | "octahedron" | "dodecahedron";
  position: [number, number, number];
  color: string;
  speed: number;
  size: number;
  scrollProgress: number;
}

export default function FloatingGeometry({
  type,
  position,
  color,
  speed,
  size,
  scrollProgress,
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const initialY = position[1];
  const phaseOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  const geometry = useMemo(() => {
    switch (type) {
      case "icosahedron":
        return new THREE.IcosahedronGeometry(size, 1);
      case "torus":
        return new THREE.TorusGeometry(size, size * 0.35, 16, 32);
      case "octahedron":
        return new THREE.OctahedronGeometry(size, 0);
      case "dodecahedron":
        return new THREE.DodecahedronGeometry(size, 0);
    }
  }, [type, size]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Gentle floating motion
    meshRef.current.position.y =
      initialY + Math.sin(t * speed + phaseOffset) * 0.5;
    meshRef.current.position.x =
      position[0] + Math.cos(t * speed * 0.7 + phaseOffset) * 0.2;

    // Slow rotation
    meshRef.current.rotation.x += speed * 0.008;
    meshRef.current.rotation.y += speed * 0.012;
    meshRef.current.rotation.z += speed * 0.005;

    // Parallax effect driven by scroll
    meshRef.current.position.z =
      position[2] + scrollProgress * 3 * (position[2] < -3 ? 1 : -1);

    // Pulsing emissive intensity
    if (materialRef.current) {
      materialRef.current.emissiveIntensity =
        0.3 + Math.sin(t * 2 + phaseOffset) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position} geometry={geometry}>
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.8}
        roughness={0.2}
        wireframe
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}
