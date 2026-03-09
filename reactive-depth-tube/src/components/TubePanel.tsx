"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TubePanelProps {
  position: [number, number, number];
  rotation: [number, number, number];
  palette: string[];
  index: number;
  scrollProgress: number;
  totalPanels: number;
}

// Generate a procedural texture using canvas
function createPanelTexture(
  palette: string[],
  index: number,
  width = 512,
  height = 512
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, palette[0]);
  grad.addColorStop(1, palette[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Geometric shapes
  const seed = index * 137.5;

  // Large circle
  ctx.beginPath();
  const cx = width * (0.3 + Math.sin(seed) * 0.2);
  const cy = height * (0.4 + Math.cos(seed * 1.3) * 0.2);
  const r = 60 + Math.sin(seed * 0.7) * 40;
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = palette[2] + "80";
  ctx.fill();

  // Rectangles
  for (let i = 0; i < 3; i++) {
    const rx = width * (0.1 + Math.sin(seed + i * 2.1) * 0.35);
    const ry = height * (0.2 + Math.cos(seed + i * 1.7) * 0.3);
    const rw = 30 + Math.sin(seed + i) * 50;
    const rh = 20 + Math.cos(seed + i * 0.8) * 40;
    ctx.fillStyle = palette[(i + 2) % palette.length] + "60";
    ctx.fillRect(rx, ry, rw, rh);
  }

  // Lines
  ctx.strokeStyle = palette[3] + "40";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(
      Math.sin(seed + i * 1.1) * width,
      Math.cos(seed + i * 0.9) * height
    );
    ctx.lineTo(
      width * (0.5 + Math.cos(seed + i * 2.3) * 0.5),
      height * (0.5 + Math.sin(seed + i * 1.8) * 0.5)
    );
    ctx.stroke();
  }

  // Typography element
  ctx.font = `bold ${40 + (index % 4) * 12}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.textAlign = "center";
  ctx.fillText(String(index + 1).padStart(2, "0"), width * 0.5, height * 0.85);

  // Border
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 2;
  ctx.strokeRect(8, 8, width - 16, height - 16);

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 4;
  return tex;
}

// Custom vertex shader for UV distortion
const vertexShader = `
  varying vec2 vUv;
  varying float vDepth;
  uniform float uTime;
  uniform float uScroll;

  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mvPosition.z;

    vec3 pos = position;
    float wave = sin(pos.y * 3.0 + uTime * 0.5 + uScroll * 6.2831) * 0.015;
    pos.x += wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vDepth;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uDistortion;

  vec2 barrelDistortion(vec2 coord, float amt) {
    vec2 cc = coord - 0.5;
    float dist = dot(cc, cc);
    return coord + cc * dist * amt;
  }

  void main() {
    float distAmt = uDistortion * (0.2 + sin(uTime * 0.3) * 0.08);
    vec2 distUv = barrelDistortion(vUv, distAmt);

    float chromaOffset = 0.002 * (1.0 + uDistortion * 0.3);
    float cr = texture2D(uTexture, distUv + vec2(chromaOffset, 0.0)).r;
    float cg = texture2D(uTexture, distUv).g;
    float cb = texture2D(uTexture, distUv - vec2(chromaOffset, 0.0)).b;

    vec3 color = vec3(cr, cg, cb);

    float vignetteX = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x);
    float vignetteY = smoothstep(0.0, 0.04, vUv.y) * smoothstep(1.0, 0.96, vUv.y);
    float vignette = vignetteX * vignetteY;

    float depthFade = smoothstep(18.0, 2.0, vDepth);
    color *= vignette * depthFade;

    // Warm grading
    color = mix(color, color * vec3(1.08, 0.97, 0.92), 0.25);

    gl_FragColor = vec4(color, vignette * depthFade);
  }
`;

export default function TubePanel({
  position,
  rotation,
  palette,
  index,
  scrollProgress,
  totalPanels,
}: TubePanelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const texture = useMemo(
    () => createPanelTexture(palette, index),
    [palette, index]
  );

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uDistortion: { value: 0.3 },
    }),
    [texture]
  );

  useFrame((state) => {
    if (!materialRef.current || !meshRef.current) return;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uScroll.value = scrollProgress;

    // Panels gently pulse based on proximity to camera scroll position
    const panelDepth = index / totalPanels;
    const proximity = 1 - Math.abs(scrollProgress - panelDepth) * 3;
    const scale = 1 + Math.max(0, proximity) * 0.08;
    meshRef.current.scale.setScalar(scale);

    // Increase distortion when actively scrolling through
    materialRef.current.uniforms.uDistortion.value =
      0.2 + Math.max(0, proximity) * 0.4;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[2.2, 2.2, 16, 16]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
