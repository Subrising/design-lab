"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { CausticPlane } from "./CausticPlane";
import { FloatingParticles } from "./FloatingParticles";
import { JellyfishGroup } from "./JellyfishGroup";
import { FishSchool } from "./FishSchool";
import { CoralReef } from "./CoralReef";
import { GodRays } from "./GodRays";

export function UnderwaterScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.15} color="#0a3d5c" />
          <directionalLight
            position={[5, 10, 5]}
            intensity={0.3}
            color="#4488cc"
          />
          <pointLight position={[-3, 2, 4]} intensity={0.5} color="#00f5d4" distance={15} />
          <pointLight position={[4, -1, 3]} intensity={0.3} color="#9b5de5" distance={12} />

          <fog attach="fog" args={["#020b1a", 5, 30]} />

          <CausticPlane />
          <FloatingParticles count={500} />
          <JellyfishGroup />
          <FishSchool />
          <CoralReef />
          <GodRays />
        </Suspense>
      </Canvas>
    </div>
  );
}
