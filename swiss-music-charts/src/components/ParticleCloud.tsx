"use client";

import { useRef, useMemo, useCallback, useEffect } from "react";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import {
  Song,
  GENRES,
  GENRE_COLORS_VEC3,
} from "@/data/generateChartData";
import { createParticlePool } from "@/lib/objectPool";

// Inline shaders to avoid .glsl import issues
const vertexShader = `
uniform float uTime;
uniform float uPixelRatio;
uniform float uTransitionProgress;

attribute float aSize;
attribute vec3 aColor;
attribute vec3 aTargetPosition;
attribute float aRandom;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec3 pos = mix(position, aTargetPosition, uTransitionProgress);

  float floatOffset = sin(uTime * 0.5 + aRandom * 6.28318) * 0.15;
  float floatOffset2 = cos(uTime * 0.3 + aRandom * 3.14159) * 0.1;
  pos.y += floatOffset;
  pos.x += floatOffset2;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  float sizeAttenuation = 1.0 / -viewPosition.z;
  float pulse = 1.0 + 0.15 * sin(uTime * 2.0 + aRandom * 6.28318);

  gl_PointSize = aSize * sizeAttenuation * uPixelRatio * 80.0 * pulse;
  gl_PointSize = max(gl_PointSize, 1.0);

  vColor = aColor;

  float dist = length(viewPosition.xyz);
  vAlpha = smoothstep(50.0, 5.0, dist);
}
`;

const fragmentShader = `
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv);

  if (dist > 0.5) discard;

  float core = smoothstep(0.5, 0.0, dist);
  float glow = smoothstep(0.5, 0.1, dist);

  float intensity = core * 0.6 + glow * 0.4;

  vec3 color = vColor * intensity;
  color += vec3(1.0) * pow(core, 4.0) * 0.3;

  float alpha = intensity * vAlpha;

  gl_FragColor = vec4(color, alpha);
}
`;

interface ParticleCloudProps {
  songs: Song[];
  currentDecade: number;
  isTransitioning: boolean;
  onHoverSong: (song: Song | null, position?: { x: number; y: number }) => void;
  onClickSong: (song: Song) => void;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function getSongPosition(
  song: Song,
  decade: number
): [number, number, number] {
  const rand = seededRandom(song.id * 7 + 13);

  // X: time within decade (0-10 years mapped to -10..10)
  const yearInDecade = song.year - decade;
  const x = (yearInDecade / 10) * 20 - 10 + (rand() - 0.5) * 1.5;

  // Y: chart position (top = high, bottom = low)
  const y = ((100 - song.peakPosition) / 100) * 12 - 6 + (rand() - 0.5) * 0.8;

  // Z: genre cluster (each genre gets a z-lane with some randomness)
  const genreZ = (song.genreIndex / GENRES.length) * 8 - 4;
  const z = genreZ + (rand() - 0.5) * 2;

  return [x, y, z];
}

export default function ParticleCloud({
  songs,
  currentDecade,
  isTransitioning,
  onHoverSong,
  onClickSong,
}: ParticleCloudProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();

  // Object pool for recycling particle data
  const pool = useMemo(() => createParticlePool(songs.length), [songs.length]);

  // Filter songs for current decade window (+/- 5 years for cross-fade)
  const visibleSongs = useMemo(() => {
    return songs.filter(
      (s) => s.year >= currentDecade - 2 && s.year < currentDecade + 12
    );
  }, [songs, currentDecade]);

  // Compute positions, colors, sizes for all visible particles
  const { positions, targetPositions, colors, sizes, randoms, songMap } =
    useMemo(() => {
      const count = visibleSongs.length;
      const positions = new Float32Array(count * 3);
      const targetPositions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const randoms = new Float32Array(count);
      const songMap = new Map<number, Song>();

      const rand = seededRandom(42);

      visibleSongs.forEach((song, i) => {
        const [x, y, z] = getSongPosition(song, currentDecade);
        const nextDecade = Math.min(2020, currentDecade + 10);
        const [tx, ty, tz] = getSongPosition(song, nextDecade);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        targetPositions[i * 3] = tx;
        targetPositions[i * 3 + 1] = ty;
        targetPositions[i * 3 + 2] = tz;

        const genreColor =
          GENRE_COLORS_VEC3[song.genre] || GENRE_COLORS_VEC3.Pop;
        colors[i * 3] = genreColor[0];
        colors[i * 3 + 1] = genreColor[1];
        colors[i * 3 + 2] = genreColor[2];

        // Size based on weeks on chart (more successful = bigger)
        sizes[i] = 0.3 + (song.weeksOnChart / 52) * 0.7;

        randoms[i] = rand();
        songMap.set(i, song);
      });

      return { positions, targetPositions, colors, sizes, randoms, songMap };
    }, [visibleSongs, currentDecade]);

  // Uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uTransitionProgress: { value: 0 },
    }),
    []
  );

  // Animate
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

      // Smooth transition progress
      const target = isTransitioning ? 1 : 0;
      const current = materialRef.current.uniforms.uTransitionProgress.value;
      materialRef.current.uniforms.uTransitionProgress.value +=
        (target - current) * 0.03;
    }
  });

  // Raycaster for hover detection
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useMemo(() => new THREE.Vector2(), []);

  useEffect(() => {
    if (raycaster) {
      raycaster.params.Points = { threshold: 0.5 };
    }
  }, [raycaster]);

  const handlePointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (!pointsRef.current) return;

      const intersects = event.intersections;
      if (intersects.length > 0 && intersects[0].index !== undefined) {
        const song = songMap.get(intersects[0].index);
        if (song) {
          onHoverSong(song, {
            x: event.nativeEvent.clientX,
            y: event.nativeEvent.clientY,
          });
          return;
        }
      }
      onHoverSong(null);
    },
    [songMap, onHoverSong]
  );

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      const intersects = event.intersections;
      if (intersects.length > 0 && intersects[0].index !== undefined) {
        const song = songMap.get(intersects[0].index);
        if (song) {
          onClickSong(song);
        }
      }
    },
    [songMap, onClickSong]
  );

  return (
    <points
      ref={pointsRef}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={visibleSongs.length}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aTargetPosition"
          count={visibleSongs.length}
          array={targetPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aColor"
          count={visibleSongs.length}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={visibleSongs.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={visibleSongs.length}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
