"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 500;

const particleVertexShader = `
  attribute float aSize;
  attribute float aLife;
  attribute vec3 aColor;

  varying float vLife;
  varying vec3 vColor;

  void main() {
    vLife = aLife;
    vColor = aColor;

    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (200.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const particleFragmentShader = `
  varying float vLife;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);

    // Soft circle
    float alpha = smoothstep(0.5, 0.1, d) * vLife;

    // Glow
    float glow = exp(-d * 4.0) * vLife * 0.5;

    vec3 col = vColor + glow;

    gl_FragColor = vec4(col, alpha);
  }
`;

export function Particles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, sizes, lives, colors, velocities, maxLives } =
    useMemo(() => {
      const positions = new Float32Array(PARTICLE_COUNT * 3);
      const sizes = new Float32Array(PARTICLE_COUNT);
      const lives = new Float32Array(PARTICLE_COUNT);
      const colors = new Float32Array(PARTICLE_COUNT * 3);
      const velocities = new Float32Array(PARTICLE_COUNT * 3);
      const maxLives = new Float32Array(PARTICLE_COUNT);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;

        // Spread around origin
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = Math.random() * 15;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;

        sizes[i] = 0.5 + Math.random() * 2;

        const life = Math.random();
        lives[i] = life;
        maxLives[i] = 3 + Math.random() * 5;

        // Random color — blues, greens, purples
        const hue = 0.4 + Math.random() * 0.4;
        const c = new THREE.Color().setHSL(hue, 0.7, 0.5);
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;

        velocities[i3] = (Math.random() - 0.5) * 0.5;
        velocities[i3 + 1] = 0.2 + Math.random() * 0.5;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.5;
      }

      return { positions, sizes, lives, colors, velocities, maxLives };
    }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame(({ camera, clock }) => {
    if (!pointsRef.current) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const geo = pointsRef.current.geometry;
    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
    const lifeAttr = geo.getAttribute("aLife") as THREE.BufferAttribute;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Decrement life
      lives[i] -= dt / maxLives[i];

      if (lives[i] <= 0) {
        // Respawn near camera
        positions[i3] = camera.position.x + (Math.random() - 0.5) * 80;
        positions[i3 + 1] = Math.random() * 15;
        positions[i3 + 2] = camera.position.z + (Math.random() - 0.5) * 80;
        lives[i] = 1.0;

        velocities[i3] = (Math.random() - 0.5) * 0.5;
        velocities[i3 + 1] = 0.2 + Math.random() * 0.5;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.5;
      }

      // Move
      positions[i3] += velocities[i3] * dt;
      positions[i3 + 1] += velocities[i3 + 1] * dt;
      positions[i3 + 2] += velocities[i3 + 2] * dt;

      // Slight floating motion
      positions[i3 + 1] +=
        Math.sin(clock.elapsedTime + i * 0.1) * 0.01;
    }

    posAttr.needsUpdate = true;
    lifeAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aLife"
          count={PARTICLE_COUNT}
          array={lives}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aColor"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
    </points>
  );
}
