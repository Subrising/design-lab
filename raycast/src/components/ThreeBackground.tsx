"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FloatingParticles() {
  const mesh = useRef<THREE.Points>(null);
  const count = 2000;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      [1.0, 0.39, 0.39],
      [0.72, 0.43, 1.0],
      [0.34, 0.71, 0.99],
      [0.24, 0.81, 0.44],
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }

    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={mesh} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function GlowOrbs() {
  const group = useRef<THREE.Group>(null);

  const orbs = useMemo(() => {
    return [
      { pos: [-3, 2, -5] as [number, number, number], color: "#ff6363", scale: 1.5 },
      { pos: [4, -1, -6] as [number, number, number], color: "#b86eff", scale: 2 },
      { pos: [-1, -3, -4] as [number, number, number], color: "#56b4fc", scale: 1.2 },
      { pos: [2, 3, -7] as [number, number, number], color: "#3ecf71", scale: 1.8 },
    ];
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const t = state.clock.elapsedTime;
      child.position.y += Math.sin(t * 0.3 + i * 1.5) * 0.002;
      child.position.x += Math.cos(t * 0.2 + i * 2) * 0.001;
    });
  });

  return (
    <group ref={group}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.pos}>
          <sphereGeometry args={[orb.scale, 32, 32]} />
          <meshBasicMaterial
            color={orb.color}
            transparent
            opacity={0.04}
          />
        </mesh>
      ))}
    </group>
  );
}

function AmbientGrid() {
  const grid = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (!grid.current) return;
    const mat = grid.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.03 + Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const size = 20;
    const divisions = 30;
    const step = size / divisions;

    for (let i = -size / 2; i <= size / 2; i += step) {
      vertices.push(i, -5, -size / 2, i, -5, size / 2);
      vertices.push(-size / 2, -5, i, size / 2, -5, i);
    }

    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    return geo;
  }, []);

  return (
    <lineSegments ref={grid} geometry={geometry}>
      <lineBasicMaterial color="#b86eff" transparent opacity={0.04} />
    </lineSegments>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.1} />
        <FloatingParticles />
        <GlowOrbs />
        <AmbientGrid />
      </Canvas>
    </div>
  );
}
