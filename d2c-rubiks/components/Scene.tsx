"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import RubiksCube from "./RubiksCube";
import Lighting from "./Lighting";
import ParticleField from "./ParticleField";
import HeroOverlay from "./HeroOverlay";
import ScrollContent from "./ScrollContent";

function ScrollCamera() {
  const { camera } = useThree();
  const scrollRef = useRef(0);
  const targetRef = useRef({ x: 0, y: 0, z: 8 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const progress = Math.min(scrollY / (vh * 5), 1);

      // Camera pulls back and orbits slightly as user scrolls
      targetRef.current = {
        x: Math.sin(progress * Math.PI * 0.5) * 3,
        y: progress * 2,
        z: 8 + progress * 4,
      };
      scrollRef.current = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    camera.position.x += (targetRef.current.x - camera.position.x) * 0.05;
    camera.position.y += (targetRef.current.y - camera.position.y) * 0.05;
    camera.position.z += (targetRef.current.z - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function PostProcessing() {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.2;
  }, [gl]);

  return null;
}

export default function Scene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white/30 text-sm tracking-widest uppercase animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Fixed 3D Canvas */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          dpr={[1, 2]}
        >
          <color attach="background" args={["#050508"]} />
          <fog attach="fog" args={["#050508", 15, 35]} />

          <ScrollCamera />
          <PostProcessing />
          <Lighting />
          <RubiksCube />
          <ParticleField />

          <Environment preset="city" environmentIntensity={0.1} />
        </Canvas>
      </div>

      {/* Hero overlay */}
      <HeroOverlay />

      {/* Scroll content */}
      <ScrollContent />

      {/* Footer */}
      <div className="relative z-10 min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xs text-white/20 tracking-[0.3em] uppercase mb-4">
            D2C Life Science
          </p>
          <p className="text-white/10 text-xs">
            Interactive experience built with Three.js & React Three Fiber
          </p>
        </div>
      </div>
    </div>
  );
}
