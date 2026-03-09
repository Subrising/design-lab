"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
import ParticleCloud from "./ParticleCloud";
import type { Song } from "@/data/generateChartData";

interface SceneProps {
  songs: Song[];
  currentDecade: number;
  isTransitioning: boolean;
  onHoverSong: (song: Song | null, position?: { x: number; y: number }) => void;
  onClickSong: (song: Song) => void;
}

export default function Scene({
  songs,
  currentDecade,
  isTransitioning,
  onHoverSong,
  onClickSong,
}: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 2, 18], fov: 60, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{ background: "#0a0a0f" }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#0a0a0f"]} />

      {/* Subtle ambient lighting */}
      <ambientLight intensity={0.1} />

      {/* Orbit controls with constraints */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={40}
        maxPolarAngle={Math.PI * 0.85}
        minPolarAngle={Math.PI * 0.15}
        autoRotate
        autoRotateSpeed={0.3}
        dampingFactor={0.05}
        enableDamping
      />

      {/* Particle system */}
      <ParticleCloud
        songs={songs}
        currentDecade={currentDecade}
        isTransitioning={isTransitioning}
        onHoverSong={onHoverSong}
        onClickSong={onClickSong}
      />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette offset={0.3} darkness={0.7} />
      </EffectComposer>
    </Canvas>
  );
}
