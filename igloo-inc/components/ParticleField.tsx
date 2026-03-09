"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  count: number;
  scrollProgress: number;
}

export default function ParticleField({ count, scrollProgress }: Props) {
  const pointsRef = useRef<THREE.Points>(null);
  const geoRef = useRef<THREE.BufferGeometry>(null);

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color("#6ee7b7"),
      new THREE.Color("#818cf8"),
      new THREE.Color("#f472b6"),
      new THREE.Color("#fbbf24"),
      new THREE.Color("#34d399"),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 30 - 5;

      velocities[i3] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.002;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    return { positions, velocities, colors };
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posAttr.array[i3] += velocities[i3];
      posAttr.array[i3 + 1] += velocities[i3 + 1];
      posAttr.array[i3 + 2] += velocities[i3 + 2];

      // Gentle swirl
      posAttr.array[i3] += Math.sin(t * 0.1 + i * 0.01) * 0.001;
      posAttr.array[i3 + 1] += Math.cos(t * 0.1 + i * 0.01) * 0.001;
    }

    posAttr.needsUpdate = true;

    // Rotate the whole particle system slowly on scroll
    pointsRef.current.rotation.y = scrollProgress * Math.PI * 0.5;
    pointsRef.current.rotation.x = scrollProgress * Math.PI * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
