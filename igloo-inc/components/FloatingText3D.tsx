"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  text: string;
  position: [number, number, number];
  scale: number;
  color: string;
  index: number;
  scrollProgress: number;
}

// SDF-inspired text rendering using a canvas texture with distance field blur
function createTextTexture(text: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  const size = 512;
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d")!;

  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // SDF-like glow layers (multiple passes with decreasing opacity and increasing blur)
  const layers = [
    { blur: 20, alpha: 0.15 },
    { blur: 12, alpha: 0.25 },
    { blur: 6, alpha: 0.4 },
    { blur: 2, alpha: 0.7 },
    { blur: 0, alpha: 1.0 },
  ];

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `bold ${size / 6}px "Helvetica Neue", Arial, sans-serif`;
  ctx.letterSpacing = "0.3em";

  for (const layer of layers) {
    ctx.save();
    ctx.filter = layer.blur > 0 ? `blur(${layer.blur}px)` : "none";
    ctx.globalAlpha = layer.alpha;
    ctx.fillStyle = color;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function FloatingText3D({
  text,
  position,
  scale,
  color,
  index,
  scrollProgress,
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => createTextTexture(text, color), [text, color]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Gentle floating
    meshRef.current.position.y =
      position[1] + Math.sin(t * 0.5 + index * 1.5) * 0.3;
    meshRef.current.position.x =
      position[0] + Math.cos(t * 0.3 + index * 2) * 0.15;

    // Face roughly toward camera
    meshRef.current.rotation.y = Math.sin(t * 0.2 + index) * 0.1;
    meshRef.current.rotation.x = Math.cos(t * 0.15 + index) * 0.05;

    // Fade based on scroll proximity to this section
    const sectionCenter = index / 4;
    const dist = Math.abs(scrollProgress - sectionCenter);
    const opacity = Math.max(0, 1 - dist * 3);
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = opacity;

    // Scale pulse
    const s = scale * (0.9 + Math.sin(t * 0.8 + index * 3) * 0.1);
    meshRef.current.scale.set(s * 3, s * 1.5, 1);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[2, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
