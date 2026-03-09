"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function WireframeOrb({
  position,
  scale,
  speed,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const time = useRef(Math.random() * 100);

  useFrame((state) => {
    if (!ref.current) return;
    time.current = state.clock.elapsedTime * speed;

    ref.current.rotation.x = time.current * 0.3;
    ref.current.rotation.y = time.current * 0.2;
    ref.current.position.y =
      position[1] + Math.sin(time.current * 0.5) * 0.3;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#1a3a6a"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

function GlowRing({
  position,
  scale,
  speed,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.rotation.x = t * 0.5;
    ref.current.rotation.z = t * 0.3;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[1, 0.02, 16, 64]} />
      <meshBasicMaterial color="#2a4a8a" transparent opacity={0.2} />
    </mesh>
  );
}

export default function FloatingGeometry() {
  const items = useMemo(
    () => [
      { type: "orb" as const, pos: [-6, 2, -4] as [number, number, number], scale: 1.5, speed: 0.3 },
      { type: "orb" as const, pos: [7, -1, -6] as [number, number, number], scale: 2.0, speed: 0.2 },
      { type: "orb" as const, pos: [3, 4, -8] as [number, number, number], scale: 1.0, speed: 0.4 },
      { type: "ring" as const, pos: [-4, -3, -5] as [number, number, number], scale: 2.0, speed: 0.15 },
      { type: "ring" as const, pos: [5, 3, -7] as [number, number, number], scale: 1.5, speed: 0.25 },
      { type: "ring" as const, pos: [0, -2, -3] as [number, number, number], scale: 3.0, speed: 0.1 },
    ],
    []
  );

  return (
    <group>
      {items.map((item, i) =>
        item.type === "orb" ? (
          <WireframeOrb
            key={i}
            position={item.pos}
            scale={item.scale}
            speed={item.speed}
          />
        ) : (
          <GlowRing
            key={i}
            position={item.pos}
            scale={item.scale}
            speed={item.speed}
          />
        )
      )}
    </group>
  );
}
