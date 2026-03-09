"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import vertexShader from "@/shaders/vertex.glsl";
import fragmentShader from "@/shaders/fragment.glsl";

interface GLImageProps {
  url: string;
  position: [number, number, number];
  size: [number, number];
  scrollSpeed: React.MutableRefObject<number>;
  curveStrength?: number;
  curveFrequency?: number;
  totalHeight: number;
  wheelDirection?: number;
}

export default function GLImage({
  url,
  position,
  size,
  scrollSpeed,
  curveStrength = 1,
  curveFrequency = 0.25,
  totalHeight,
  wheelDirection = 1,
}: GLImageProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useTexture(url);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uPlaneSizes: { value: new THREE.Vector2(size[0], size[1]) },
      uImageSizes: {
        value: new THREE.Vector2(
          (texture.image as HTMLImageElement)?.naturalWidth || 800,
          (texture.image as HTMLImageElement)?.naturalHeight || 1200
        ),
      },
      uScrollSpeed: { value: 0 },
      uCurveStrength: { value: curveStrength },
      uCurveFrequency: { value: curveFrequency },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [texture]
  );

  useFrame(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uScrollSpeed.value =
      scrollSpeed.current * 0.005 * wheelDirection;

    // Infinite wrap
    const y = meshRef.current.position.y;
    meshRef.current.position.y =
      ((y + totalHeight / 2) % totalHeight + totalHeight) % totalHeight -
      totalHeight / 2;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[size[0], size[1], 16, 16]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
