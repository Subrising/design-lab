"use client";

import { useState } from "react";
import AsciiScene from "./components/AsciiScene";
import ControlPanel from "./components/ControlPanel";

export default function Home() {
  const [cellSize, setCellSize] = useState(10);
  const [distortionStrength, setDistortionStrength] = useState(1.0);
  const [sceneMode, setSceneMode] = useState<"spheres" | "torus" | "terrain">("torus");
  const [colorMode, setColorMode] = useState<"green" | "cyan" | "rainbow">("green");

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#050505]">
      <AsciiScene
        cellSize={cellSize}
        distortionStrength={distortionStrength}
        sceneMode={sceneMode}
        colorMode={colorMode}
      />

      {/* Title overlay */}
      <div className="fixed top-6 left-8 z-50 select-none">
        <h1 className="text-green text-sm tracking-[0.3em] font-light">
          ASCII_DITHERING
        </h1>
        <p className="text-muted text-[10px] tracking-[0.15em] mt-1">
          WEBGL FRAGMENT SHADER // REAL-TIME CONVERSION
        </p>
      </div>

      {/* Character set display */}
      <div className="fixed top-6 right-8 z-50 select-none">
        <p className="text-green/40 text-[10px] tracking-[0.3em] font-mono">
          CHARSET
        </p>
        <p className="text-green text-xs tracking-[0.5em] mt-1 font-mono">
          {" .,:;+*?%S#@"}
        </p>
      </div>

      {/* FPS / info */}
      <div className="fixed bottom-6 right-8 z-50 select-none">
        <p className="text-muted text-[9px] tracking-[0.15em]">
          MOVE MOUSE TO DISTORT
        </p>
      </div>

      <ControlPanel
        cellSize={cellSize}
        onCellSizeChange={setCellSize}
        distortionStrength={distortionStrength}
        onDistortionChange={setDistortionStrength}
        sceneMode={sceneMode}
        onSceneModeChange={setSceneMode}
        colorMode={colorMode}
        onColorModeChange={setColorMode}
      />
    </main>
  );
}
