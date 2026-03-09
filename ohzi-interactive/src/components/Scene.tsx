"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import ParticleField from "./ParticleField";
import CursorShaderPlane from "./CursorShaderPlane";
import FloatingGeometry from "./FloatingGeometry";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export default function Scene() {
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio, 2));
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <color attach="background" args={["#020208"]} />
        <fog attach="fog" args={["#020208", 8, 30]} />

        <Suspense fallback={null}>
          <CursorShaderPlane />
          <ParticleField />
          <FloatingGeometry />
        </Suspense>

        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.002, 0.002)}
            radialModulation={true}
            modulationOffset={0.5}
          />
          <Vignette
            blendFunction={BlendFunction.NORMAL}
            darkness={0.7}
            offset={0.3}
          />
          <Noise
            blendFunction={BlendFunction.SOFT_LIGHT}
            opacity={0.15}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
