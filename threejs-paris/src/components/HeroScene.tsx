"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";

function TorusKnotMesh({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * 0.3 * speed;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={ref} position={position}>
        <torusKnotGeometry args={[1, 0.35, 128, 32]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
          distort={0.2}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function IcoMesh({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * 0.15;
    ref.current.rotation.z = state.clock.elapsedTime * 0.1;
  });
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

function Particles({ count = 2000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return pos;
  }, [count]);

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#00d4ff"),
      new THREE.Color("#a855f7"),
      new THREE.Color("#ec4899"),
    ];
    for (let i = 0; i < count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    return cols;
  }, [count]);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00d4ff" />
      <pointLight position={[-5, -3, 3]} intensity={0.8} color="#a855f7" />
      <pointLight position={[0, 3, -5]} intensity={0.6} color="#ec4899" />
      <Stars radius={50} depth={50} count={1000} factor={3} saturation={0} fade speed={1} />
      <TorusKnotMesh position={[-3, 0.5, -2]} color="#00d4ff" speed={0.8} />
      <TorusKnotMesh position={[3.5, -0.5, -3]} color="#a855f7" speed={0.6} />
      <IcoMesh position={[0, 2, -4]} color="#ec4899" />
      <IcoMesh position={[-2, -2, -3]} color="#00d4ff" />
      <Particles count={3000} />
    </>
  );
}

export default function HeroScene() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Scene />
        </Canvas>
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f]" />
      {/* Content */}
      <div className="relative z-[2] flex h-full flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium tracking-widest text-cyan-400 uppercase">
          Paris 2025
        </div>
        <h1 className="neon-text mb-6 text-6xl font-black tracking-tight text-white md:text-8xl lg:text-9xl">
          Three.js
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Conference
          </span>
        </h1>
        <p className="mb-8 max-w-xl text-lg text-slate-400 md:text-xl">
          The premier WebGL & creative coding event. Join 500+ developers pushing the boundaries of 3D on the web.
        </p>
        <div className="flex gap-4">
          <button className="rounded-full bg-cyan-500 px-8 py-3 font-semibold text-black transition-all hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]">
            Get Tickets
          </button>
          <button className="neon-border rounded-full px-8 py-3 font-semibold text-cyan-400 transition-all hover:bg-cyan-500/10">
            Watch Talks
          </button>
        </div>
        <div className="mt-12 flex items-center gap-8 text-sm text-slate-500">
          <span>June 14-15, 2025</span>
          <span className="h-1 w-1 rounded-full bg-cyan-500" />
          <span>La Gaite Lyrique, Paris</span>
          <span className="h-1 w-1 rounded-full bg-cyan-500" />
          <span>500+ Attendees</span>
        </div>
      </div>
    </section>
  );
}
