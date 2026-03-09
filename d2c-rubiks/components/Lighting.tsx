"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Lighting() {
  const spotRef = useRef<THREE.SpotLight>(null);
  const spot2Ref = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (spotRef.current) {
      spotRef.current.position.x = Math.sin(t * 0.3) * 8;
      spotRef.current.position.z = Math.cos(t * 0.3) * 8;
    }
    if (spot2Ref.current) {
      spot2Ref.current.position.x = Math.cos(t * 0.2) * 6;
      spot2Ref.current.position.y = Math.sin(t * 0.15) * 3 + 7;
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} color="#1a1a2e" />
      <spotLight
        ref={spotRef}
        position={[5, 8, 5]}
        intensity={80}
        angle={0.6}
        penumbra={0.8}
        color="#ffffff"
        castShadow
      />
      <spotLight
        ref={spot2Ref}
        position={[-5, 7, -3]}
        intensity={40}
        angle={0.5}
        penumbra={1}
        color="#4466ff"
      />
      <pointLight position={[0, -5, 0]} intensity={10} color="#ff4400" />
      <pointLight position={[0, 0, 8]} intensity={15} color="#ffffff" />
    </>
  );
}
