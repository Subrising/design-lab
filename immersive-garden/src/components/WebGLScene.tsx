"use client";

import { Canvas } from "@react-three/fiber";
import ScrollCamera from "./ScrollCamera";
import Environment from "./Environment";
import Particles from "./Particles";
import PostProcessing from "./PostProcessing";

interface WebGLSceneProps {
  scrollProgress: React.MutableRefObject<number>;
}

export default function WebGLScene({ scrollProgress }: WebGLSceneProps) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 2, 20], fov: 55, near: 0.1, far: 100 }}
        style={{ background: "#050a15" }}
      >
        <ScrollCamera scrollProgress={scrollProgress} />
        <Environment scrollProgress={scrollProgress} />
        <Particles scrollProgress={scrollProgress} />
        <PostProcessing scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
