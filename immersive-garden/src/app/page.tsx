"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import ScrollSections from "@/components/ScrollSections";
import ProgressBar from "@/components/ProgressBar";

const WebGLScene = dynamic(() => import("@/components/WebGLScene"), {
  ssr: false,
});

export default function Home() {
  const scrollProgress = useRef(0);

  return (
    <main className="relative">
      {/* Fixed WebGL background */}
      <WebGLScene scrollProgress={scrollProgress} />

      {/* Scroll-driven HTML overlay */}
      <ScrollSections scrollProgress={scrollProgress} />

      {/* Progress indicator */}
      <ProgressBar />

      {/* Film grain overlay */}
      <div className="grain-overlay" />

      {/* Cursor glow (CSS only) */}
      <div
        className="fixed top-0 left-0 w-64 h-64 rounded-full pointer-events-none z-40 mix-blend-screen opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(100,150,255,0.4), transparent 70%)",
          transform: "translate(-50%, -50%)",
          filter: "blur(40px)",
        }}
        id="cursor-glow"
      />
    </main>
  );
}
