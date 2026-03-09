"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const INSTANCE_COUNT = 200;

interface InstancedShapesProps {
  scrollProgress: number;
}

export default function InstancedShapes({ scrollProgress }: InstancedShapesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { offsets, speeds, scales } = useMemo(() => {
    const offsets = new Float32Array(INSTANCE_COUNT * 3);
    const speeds = new Float32Array(INSTANCE_COUNT);
    const scales = new Float32Array(INSTANCE_COUNT);

    for (let i = 0; i < INSTANCE_COUNT; i++) {
      offsets[i * 3] = (Math.random() - 0.5) * 20;
      offsets[i * 3 + 1] = (Math.random() - 0.5) * 20;
      offsets[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
      speeds[i] = 0.2 + Math.random() * 0.8;
      scales[i] = 0.02 + Math.random() * 0.06;
    }

    return { offsets, speeds, scales };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    for (let i = 0; i < INSTANCE_COUNT; i++) {
      const ox = offsets[i * 3];
      const oy = offsets[i * 3 + 1];
      const oz = offsets[i * 3 + 2];
      const speed = speeds[i];
      const scale = scales[i];

      dummy.position.set(
        ox + Math.sin(time * speed + i) * 0.5,
        oy + Math.cos(time * speed * 0.7 + i * 0.5) * 0.5 - scrollProgress * 3,
        oz
      );
      dummy.rotation.set(
        time * speed * 0.3,
        time * speed * 0.5,
        time * speed * 0.2
      );
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, INSTANCE_COUNT]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#00ffaa"
        emissive="#00ffaa"
        emissiveIntensity={0.3}
        transparent
        opacity={0.15}
        wireframe
      />
    </instancedMesh>
  );
}
