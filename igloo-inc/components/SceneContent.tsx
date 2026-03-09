"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import FloatingGeometry from "./FloatingGeometry";
import FloatingText3D from "./FloatingText3D";
import ParticleField from "./ParticleField";

interface Props {
  scrollProgress: number;
  activeSection: number;
}

// Camera path keyframes for each section
const CAMERA_POSITIONS: [number, number, number][] = [
  [0, 0, 8],
  [3, 2, 6],
  [-2, -1, 5],
  [0, 3, 7],
  [0, 0, 4],
];

const CAMERA_TARGETS: [number, number, number][] = [
  [0, 0, 0],
  [1, 0, -2],
  [-1, -1, -3],
  [0, 1, -1],
  [0, 0, -2],
];

export default function SceneContent({ scrollProgress }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Interpolate camera along the scroll path
  useFrame(() => {
    const totalSections = CAMERA_POSITIONS.length;
    const sectionFloat = scrollProgress * (totalSections - 1);
    const sectionIndex = Math.floor(sectionFloat);
    const sectionFrac = sectionFloat - sectionIndex;

    const i0 = Math.min(sectionIndex, totalSections - 1);
    const i1 = Math.min(sectionIndex + 1, totalSections - 1);

    // Smooth interpolation
    const t = sectionFrac * sectionFrac * (3 - 2 * sectionFrac); // smoothstep

    const pos = new THREE.Vector3().lerpVectors(
      new THREE.Vector3(...CAMERA_POSITIONS[i0]),
      new THREE.Vector3(...CAMERA_POSITIONS[i1]),
      t
    );
    const target = new THREE.Vector3().lerpVectors(
      new THREE.Vector3(...CAMERA_TARGETS[i0]),
      new THREE.Vector3(...CAMERA_TARGETS[i1]),
      t
    );

    camera.position.lerp(pos, 0.08);
    camera.lookAt(target);
  });

  // Section-specific text content
  const textSections = useMemo(
    () => [
      { text: "DESIGN", position: [0, 2, -3] as [number, number, number], scale: 0.8, color: "#6ee7b7" },
      { text: "BUILD", position: [4, 1, -5] as [number, number, number], scale: 0.6, color: "#93c5fd" },
      { text: "SHIP", position: [-3, -2, -4] as [number, number, number], scale: 0.7, color: "#c4b5fd" },
      { text: "SCALE", position: [1, 4, -6] as [number, number, number], scale: 0.5, color: "#fca5a5" },
      { text: "GROW", position: [0, 0, -8] as [number, number, number], scale: 0.9, color: "#fde68a" },
    ],
    []
  );

  return (
    <group ref={groupRef}>
      {/* Ambient scene lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#6ee7b7" />
      <pointLight position={[-5, -3, 3]} intensity={0.5} color="#818cf8" />
      <pointLight position={[0, -5, -5]} intensity={0.3} color="#f472b6" />

      {/* Floating procedural geometries */}
      <FloatingGeometry
        type="icosahedron"
        position={[-3, 1, -2]}
        color="#6ee7b7"
        speed={0.3}
        size={0.8}
        scrollProgress={scrollProgress}
      />
      <FloatingGeometry
        type="torus"
        position={[3, -1, -3]}
        color="#818cf8"
        speed={0.2}
        size={0.6}
        scrollProgress={scrollProgress}
      />
      <FloatingGeometry
        type="icosahedron"
        position={[1, 3, -5]}
        color="#f472b6"
        speed={0.4}
        size={0.5}
        scrollProgress={scrollProgress}
      />
      <FloatingGeometry
        type="torus"
        position={[-2, -2, -4]}
        color="#fbbf24"
        speed={0.25}
        size={0.7}
        scrollProgress={scrollProgress}
      />
      <FloatingGeometry
        type="icosahedron"
        position={[4, 2, -6]}
        color="#34d399"
        speed={0.35}
        size={0.4}
        scrollProgress={scrollProgress}
      />
      <FloatingGeometry
        type="torus"
        position={[-4, 0, -1]}
        color="#a78bfa"
        speed={0.15}
        size={0.9}
        scrollProgress={scrollProgress}
      />
      <FloatingGeometry
        type="octahedron"
        position={[0, -3, -3]}
        color="#fb923c"
        speed={0.28}
        size={0.6}
        scrollProgress={scrollProgress}
      />
      <FloatingGeometry
        type="dodecahedron"
        position={[2, 0, -7]}
        color="#2dd4bf"
        speed={0.32}
        size={0.55}
        scrollProgress={scrollProgress}
      />

      {/* 3D Floating text labels */}
      {textSections.map((section, i) => (
        <FloatingText3D
          key={section.text}
          text={section.text}
          position={section.position}
          scale={section.scale}
          color={section.color}
          index={i}
          scrollProgress={scrollProgress}
        />
      ))}

      {/* Background particle field */}
      <ParticleField count={2000} scrollProgress={scrollProgress} />
    </group>
  );
}
