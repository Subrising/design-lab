"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import DistortionPlane from "./DistortionPlane";
import FloatingParticles from "./FloatingParticles";
import FluidBackground from "./FluidBackground";
import MorphSphere from "./MorphSphere";
import TransitionOverlay from "./TransitionOverlay";

interface SceneProps {
  activeSection: number;
  morphProgress: number;
  transitionProgress: number;
}

export default function Scene({ activeSection, morphProgress, transitionProgress }: SceneProps) {
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio, 2));
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <FluidBackground />
          <DistortionPlane />
          <FloatingParticles />
          <MorphSphere morphProgress={morphProgress} />
          <TransitionOverlay progress={transitionProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
