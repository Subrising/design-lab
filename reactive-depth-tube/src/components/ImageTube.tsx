"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import TubePanel from "./TubePanel";

interface ImageTubeProps {
  scrollProgress: number;
}

const PANEL_COUNT = 36;
const TUBE_RADIUS = 3.5;
const TUBE_LENGTH = 40;
const PANELS_AROUND = 6;
const PANELS_DEEP = Math.ceil(PANEL_COUNT / PANELS_AROUND);
const PANEL_SPACING = TUBE_LENGTH / PANELS_DEEP;

// Curated color palette for procedural panels
const PALETTES = [
  ["#1a1a2e", "#16213e", "#0f3460", "#533483"],
  ["#2d132c", "#801336", "#c72c41", "#ee4540"],
  ["#0a1628", "#1e3a5f", "#4b86b4", "#adcbe3"],
  ["#1b1b2f", "#162447", "#1f4068", "#e43f5a"],
  ["#0d0d0d", "#1a1a2e", "#e94560", "#533483"],
  ["#1c1c3c", "#3b185f", "#a12568", "#fec89a"],
];

export default function ImageTube({ scrollProgress }: ImageTubeProps) {
  const groupRef = useRef<THREE.Group>(null);

  const panels = useMemo(() => {
    const items: {
      position: [number, number, number];
      rotation: [number, number, number];
      palette: string[];
      index: number;
    }[] = [];

    for (let i = 0; i < PANEL_COUNT; i++) {
      const ring = Math.floor(i / PANELS_AROUND);
      const slot = i % PANELS_AROUND;
      const angle = (slot / PANELS_AROUND) * Math.PI * 2;

      const x = Math.cos(angle) * TUBE_RADIUS;
      const z = Math.sin(angle) * TUBE_RADIUS;
      const y = -ring * PANEL_SPACING;

      items.push({
        position: [x, y, z],
        rotation: [0, -angle + Math.PI, 0],
        palette: PALETTES[i % PALETTES.length],
        index: i,
      });
    }
    return items;
  }, []);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    // Scroll drives camera forward through the tube
    const targetY = scrollProgress * TUBE_LENGTH * 0.85;
    groupRef.current.position.y +=
      (targetY - groupRef.current.position.y) * Math.min(delta * 3, 1);

    // Gentle rotation of the whole tube
    groupRef.current.rotation.y += delta * 0.03;
  });

  return (
    <group ref={groupRef}>
      {panels.map((panel, i) => (
        <TubePanel
          key={i}
          position={panel.position}
          rotation={panel.rotation}
          palette={panel.palette}
          index={panel.index}
          scrollProgress={scrollProgress}
          totalPanels={PANEL_COUNT}
        />
      ))}

      {/* Inner glow ring lights along the tube */}
      {Array.from({ length: 8 }).map((_, i) => (
        <pointLight
          key={`light-${i}`}
          position={[0, -i * (TUBE_LENGTH / 8), 0]}
          intensity={0.4}
          distance={8}
          color={i % 2 === 0 ? "#6366f1" : "#8b5cf6"}
        />
      ))}
    </group>
  );
}
