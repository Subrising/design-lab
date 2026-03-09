"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import ImageTube from "./ImageTube";
import Effects from "./Effects";

interface SceneProps {
  scrollProgress: number;
}

export default function Scene({ scrollProgress }: SceneProps) {
  return (
    <Canvas
      camera={{ fov: 65, near: 0.1, far: 100, position: [0, 0, 0] }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#050508"]} />
      <fog attach="fog" args={["#050508", 8, 25]} />

      <Suspense fallback={null}>
        <ImageTube scrollProgress={scrollProgress} />
      </Suspense>

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#6366f1" />

      <Effects />
    </Canvas>
  );
}
