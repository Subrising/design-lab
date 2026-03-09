"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useCallback } from "react";
import BlendedSphere from "./BlendedSphere";
import BlendIndicator from "./BlendIndicator";

export default function Scene() {
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -(((e.clientY - rect.top) / rect.height) * 2 - 1),
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen"
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: "#0a0a0f" }}
      >
        <BlendedSphere mouseRef={mouseRef} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.3}
          autoRotate={false}
        />
      </Canvas>
      <BlendIndicator mouseRef={mouseRef} />
    </div>
  );
}
