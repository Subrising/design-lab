"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const gridVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const gridFragmentShader = `
  uniform float uTime;
  uniform vec3 uCameraPos;

  varying vec2 vUv;
  varying vec3 vWorldPos;

  float grid(vec2 p, float spacing, float thickness) {
    vec2 g = abs(fract(p / spacing - 0.5) - 0.5) * spacing;
    float d = min(g.x, g.y);
    return 1.0 - smoothstep(0.0, thickness, d);
  }

  void main() {
    vec2 worldXZ = vWorldPos.xz;

    // Multi-scale grid
    float g1 = grid(worldXZ, 2.0, 0.03) * 0.3;
    float g2 = grid(worldXZ, 10.0, 0.05) * 0.5;
    float g3 = grid(worldXZ, 50.0, 0.08) * 0.7;

    float g = max(max(g1, g2), g3);

    // Distance fade
    float dist = length(vWorldPos.xz - uCameraPos.xz);
    float fade = 1.0 - smoothstep(20.0, 100.0, dist);

    // Pulsing glow
    float pulse = sin(uTime * 0.5) * 0.1 + 0.9;

    vec3 gridColor = mix(
      vec3(0.05, 0.15, 0.3),
      vec3(0.1, 0.4, 0.8),
      g
    ) * pulse;

    float alpha = g * fade * 0.8;

    gl_FragColor = vec4(gridColor, alpha);
  }
`;

// Floating crystal pillars
function Pillars() {
  const groupRef = useRef<THREE.Group>(null);
  const pillars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 80;
      arr.push({
        x: Math.cos(angle) * dist,
        z: Math.sin(angle) * dist,
        height: 2 + Math.random() * 12,
        width: 0.3 + Math.random() * 0.8,
        speed: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        color: new THREE.Color().setHSL(
          0.5 + Math.random() * 0.3,
          0.6,
          0.15 + Math.random() * 0.15
        ),
        emissive: new THREE.Color().setHSL(
          0.5 + Math.random() * 0.3,
          0.8,
          0.1
        ),
      });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const p = pillars[i];
      child.position.y =
        p.height * 0.5 + Math.sin(t * p.speed + p.phase) * 1.5;
    });
  });

  return (
    <group ref={groupRef}>
      {pillars.map((p, i) => (
        <mesh key={i} position={[p.x, p.height * 0.5, p.z]}>
          <boxGeometry args={[p.width, p.height, p.width]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.emissive}
            emissiveIntensity={1.5}
            roughness={0.3}
            metalness={0.8}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

export function Environment() {
  const gridRef = useRef<THREE.Mesh>(null);

  const gridMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: gridVertexShader,
        fragmentShader: gridFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uCameraPos: { value: new THREE.Vector3() },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  );

  useFrame(({ clock, camera }) => {
    gridMaterial.uniforms.uTime.value = clock.getElapsedTime();
    gridMaterial.uniforms.uCameraPos.value.copy(camera.position);

    // Move grid to follow camera
    if (gridRef.current) {
      gridRef.current.position.x =
        Math.floor(camera.position.x / 10) * 10;
      gridRef.current.position.z =
        Math.floor(camera.position.z / 10) * 10;
    }
  });

  return (
    <group>
      {/* Infinite ground grid */}
      <mesh
        ref={gridRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        material={gridMaterial}
      >
        <planeGeometry args={[300, 300, 1, 1]} />
      </mesh>

      {/* Pillars */}
      <Pillars />
    </group>
  );
}
