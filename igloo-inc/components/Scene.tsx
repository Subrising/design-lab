"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import SceneContent from "./SceneContent";

interface SceneProps {
  scrollProgress: number;
  activeSection: number;
}

export default function Scene({ scrollProgress, activeSection }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "#000" }}
    >
      <Suspense fallback={null}>
        <SceneContent
          scrollProgress={scrollProgress}
          activeSection={activeSection}
        />
      </Suspense>
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.5}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
