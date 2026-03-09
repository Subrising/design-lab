"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import ParticleEngine from "./ParticleEngine";
import InstancedShapes from "./InstancedShapes";

interface SceneProps {
  scrollProgress: number;
  activeSection: number;
}

export default function Scene({ scrollProgress, activeSection }: SceneProps) {
  const [explosion, setExplosion] = useState(0);
  const prevSection = useRef(activeSection);
  const explosionTimer = useRef<number | null>(null);

  // Trigger explosion on section change
  useEffect(() => {
    if (activeSection !== prevSection.current) {
      prevSection.current = activeSection;
      setExplosion(1);

      if (explosionTimer.current) {
        cancelAnimationFrame(explosionTimer.current);
      }

      let start = performance.now();
      const decay = (now: number) => {
        const elapsed = (now - start) / 1000;
        const value = Math.max(0, 1 - elapsed * 1.2);
        setExplosion(value);
        if (value > 0) {
          explosionTimer.current = requestAnimationFrame(decay);
        }
      };
      explosionTimer.current = requestAnimationFrame(decay);
    }
  }, [activeSection]);

  return (
    <div className="particle-canvas" style={{ pointerEvents: "auto" }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 2]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#0a0a0a"]} />
          <fog attach="fog" args={["#0a0a0a", 8, 20]} />

          <ParticleEngine
            targetIndex={activeSection}
            explosion={explosion}
          />

          <InstancedShapes scrollProgress={scrollProgress} />

          <ambientLight intensity={0.2} />
          <pointLight position={[5, 5, 5]} intensity={0.5} color="#00ffaa" />
          <pointLight position={[-5, -5, 3]} intensity={0.3} color="#0066ff" />
        </Suspense>
      </Canvas>
    </div>
  );
}
