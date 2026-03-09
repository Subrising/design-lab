"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { environmentVertex, environmentFragment } from "@/shaders";

interface EnvironmentProps {
  scrollProgress: React.MutableRefObject<number>;
}

// Terrain mesh with scroll-reactive shader
function Terrain({ scrollProgress }: EnvironmentProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScrollProgress: { value: 0 },
      uColor1: { value: new THREE.Color("#0a1628") },
      uColor2: { value: new THREE.Color("#1a0a2e") },
      uColor3: { value: new THREE.Color("#0d2137") },
      uFogNear: { value: 10.0 },
      uFogFar: { value: 50.0 },
      uFogColor: { value: new THREE.Color("#050a15") },
    }),
    []
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uScrollProgress.value = scrollProgress.current;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI * 0.3, 0, 0]} position={[0, -4, -10]}>
      <planeGeometry args={[120, 120, 200, 200]} />
      <shaderMaterial
        vertexShader={environmentVertex}
        fragmentShader={environmentFragment}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Floating geometric structures along the camera path
function FloatingStructures({ scrollProgress }: EnvironmentProps) {
  const groupRef = useRef<THREE.Group>(null);

  const structures = useMemo(() => {
    const items: {
      position: [number, number, number];
      rotation: [number, number, number];
      scale: number;
      geometry: "box" | "octahedron" | "torus" | "icosahedron";
      color: string;
    }[] = [];

    const geometries: ("box" | "octahedron" | "torus" | "icosahedron")[] = [
      "box",
      "octahedron",
      "torus",
      "icosahedron",
    ];
    const colors = ["#2a4a7f", "#4a2a7f", "#2a7f5f", "#7f4a2a", "#5f2a7f", "#2a6f7f"];

    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 4 + Math.random() * 12;
      const z = -30 + i * 1.5 + Math.random() * 2;
      items.push({
        position: [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.5 + 2, z],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.3 + Math.random() * 1.2,
        geometry: geometries[Math.floor(Math.random() * geometries.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return items;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      child.rotation.x += 0.002 * (i % 2 === 0 ? 1 : -1);
      child.rotation.y += 0.003 * (i % 3 === 0 ? 1 : -1);
      child.position.y += Math.sin(t * 0.5 + i) * 0.002;
    });
  });

  const getGeometry = (type: string) => {
    switch (type) {
      case "box":
        return <boxGeometry args={[1, 1, 1]} />;
      case "octahedron":
        return <octahedronGeometry args={[1, 0]} />;
      case "torus":
        return <torusGeometry args={[1, 0.3, 8, 16]} />;
      case "icosahedron":
        return <icosahedronGeometry args={[1, 0]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <group ref={groupRef}>
      {structures.map((s, i) => (
        <mesh key={i} position={s.position} rotation={s.rotation} scale={s.scale}>
          {getGeometry(s.geometry)}
          <meshStandardMaterial
            color={s.color}
            roughness={0.3}
            metalness={0.7}
            transparent
            opacity={0.7}
            wireframe={i % 3 === 0}
          />
        </mesh>
      ))}
    </group>
  );
}

// Volumetric light shafts
function LightShafts({ scrollProgress }: EnvironmentProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = 0.03 + Math.sin(t * 0.3 + i * 1.5) * 0.02;
    });
  });

  const shafts = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        Math.sin(i * 0.8) * 8,
        6 + i * 0.5,
        -5 - i * 5,
      ] as [number, number, number],
      rotation: [0, 0, (i * 0.3 - 0.6)] as [number, number, number],
      scale: [0.3, 20, 0.3] as [number, number, number],
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {shafts.map((s, i) => (
        <mesh key={i} position={s.position} rotation={s.rotation} scale={s.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#4488ff"
            transparent
            opacity={0.04}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Environment({ scrollProgress }: EnvironmentProps) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 10, 5]} intensity={0.4} color="#6688cc" />
      <pointLight position={[-5, 5, -10]} intensity={0.3} color="#aa44ff" distance={30} />
      <pointLight position={[3, 3, -20]} intensity={0.3} color="#44aaff" distance={25} />
      <fog attach="fog" args={["#050a15", 15, 55]} />
      <Terrain scrollProgress={scrollProgress} />
      <FloatingStructures scrollProgress={scrollProgress} />
      <LightShafts scrollProgress={scrollProgress} />
    </>
  );
}
