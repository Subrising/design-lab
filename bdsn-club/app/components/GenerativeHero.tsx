'use client';

import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─── GLSL Noise Functions (Simplex + FBM) ──────────────────────────────
const noiseGLSL = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 6; i++) {
      value += amplitude * snoise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
`;

// ─── Morphing Sphere Shader Material ────────────────────────────────────
const vertexShader = /* glsl */ `
  ${noiseGLSL}

  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMorphStrength;
  uniform float uNoiseScale;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;
  varying float vNoise;

  void main() {
    vec3 pos = position;

    // Mouse influence — distance from cursor drives displacement
    float mouseInfluence = 1.0 - smoothstep(0.0, 2.0, length(uMouse - pos.xy * 0.5));

    // Multi-layered noise displacement
    float noise1 = fbm(pos * uNoiseScale + uTime * 0.3);
    float noise2 = snoise(pos * 2.0 + uTime * 0.5 + vec3(uMouse, 0.0));
    float noise3 = snoise(pos * 4.0 - uTime * 0.2);

    // Combine displacement layers
    float displacement = noise1 * 0.4 + noise2 * 0.2 * mouseInfluence + noise3 * 0.1;
    displacement *= uMorphStrength;

    // Apply displacement along normal
    vec3 newPos = pos + normal * displacement;

    // Extra mouse-driven warping
    newPos.x += sin(uMouse.x * 3.14 + uTime) * mouseInfluence * 0.15;
    newPos.y += cos(uMouse.y * 3.14 + uTime) * mouseInfluence * 0.15;

    vNormal = normalMatrix * normal;
    vPosition = (modelViewMatrix * vec4(newPos, 1.0)).xyz;
    vDisplacement = displacement;
    vNoise = noise1;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  ${noiseGLSL}

  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;
  varying float vNoise;

  void main() {
    // Fresnel rim lighting
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - abs(dot(viewDir, normalize(vNormal))), 3.0);

    // Color gradient based on noise + displacement
    vec3 color = mix(uColor1, uColor2, vNoise * 0.5 + 0.5);
    color = mix(color, uColor3, fresnel * 0.8);

    // Neon glow from displacement
    float glow = smoothstep(0.0, 0.5, abs(vDisplacement));
    color += uColor3 * glow * 0.5;

    // Scanline effect
    float scanline = sin(vPosition.y * 40.0 + uTime * 2.0) * 0.03;
    color += scanline;

    // Mouse proximity glow
    float mouseGlow = 1.0 - smoothstep(0.0, 1.5, length(uMouse - vPosition.xy * 0.3));
    color += uColor2 * mouseGlow * 0.3;

    // Edge darkening
    float edge = smoothstep(0.0, 0.3, fresnel);
    color = mix(color * 0.3, color, 1.0 - edge * 0.5);

    gl_FragColor = vec4(color, 0.95);
  }
`;

// ─── Particle Field Shader ──────────────────────────────────────────────
const particleVertexShader = /* glsl */ `
  ${noiseGLSL}

  uniform float uTime;
  uniform vec2 uMouse;

  attribute float aScale;
  attribute float aRandom;

  varying float vAlpha;
  varying float vRandom;

  void main() {
    vec3 pos = position;

    // Noise-driven particle movement
    float n = snoise(pos * 0.5 + uTime * 0.1);
    pos.x += sin(uTime * 0.3 + aRandom * 6.28) * 0.3 * n;
    pos.y += cos(uTime * 0.2 + aRandom * 6.28) * 0.3 * n;
    pos.z += snoise(pos * 0.3 + uTime * 0.15) * 0.5;

    // Mouse attraction
    vec2 toMouse = uMouse - pos.xy * 0.3;
    float mouseDist = length(toMouse);
    float attraction = smoothstep(3.0, 0.0, mouseDist) * 0.5;
    pos.xy += normalize(toMouse + 0.001) * attraction;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);

    vAlpha = smoothstep(8.0, 2.0, -mvPos.z) * (0.3 + 0.7 * aRandom);
    vRandom = aRandom;

    gl_PointSize = aScale * (300.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const particleFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;

  varying float vAlpha;
  varying float vRandom;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;

    // Pulsing glow
    alpha *= 0.7 + 0.3 * sin(uTime * 2.0 + vRandom * 6.28);

    gl_FragColor = vec4(uColor, alpha);
  }
`;

// ─── MorphSphere Component ──────────────────────────────────────────────
function MorphSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMorphStrength: { value: 0.6 },
      uNoiseScale: { value: 0.8 },
      uColor1: { value: new THREE.Color('#0a0a0a') },
      uColor2: { value: new THREE.Color('#a855f7') },
      uColor3: { value: new THREE.Color('#3b82f6') },
    }),
    []
  );

  const { viewport } = useThree();

  const handlePointerMove = useCallback(
    (e: { point: THREE.Vector3 }) => {
      if (materialRef.current) {
        materialRef.current.uniforms.uMouse.value.set(
          (e.point.x / viewport.width) * 2,
          (e.point.y / viewport.height) * 2
        );
      }
    },
    [viewport]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

      // Smooth mouse tracking from global pointer
      const mouse = state.pointer;
      const target = new THREE.Vector2(mouse.x, mouse.y);
      materialRef.current.uniforms.uMouse.value.lerp(target, 0.05);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x += 0.001;
    }
  });

  return (
    <mesh ref={meshRef} onPointerMove={handlePointerMove}>
      <icosahedronGeometry args={[2, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Particle Field Component ───────────────────────────────────────────
function ParticleField({ count = 3000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, scales, randoms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    const rnd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 5;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      scl[i] = Math.random() * 3 + 1;
      rnd[i] = Math.random();
    }

    return { positions: pos, scales: scl, randoms: rnd };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor: { value: new THREE.Color('#a855f7') },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      const mouse = state.pointer;
      materialRef.current.uniforms.uMouse.value.lerp(
        new THREE.Vector2(mouse.x * 3, mouse.y * 3),
        0.03
      );
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Background Grid Lines ──────────────────────────────────────────────
function GridLines() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const gridVertexShader = /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const gridFragmentShader = /* glsl */ `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv * 20.0;

      // Grid lines
      float gridX = smoothstep(0.95, 1.0, fract(uv.x));
      float gridY = smoothstep(0.95, 1.0, fract(uv.y));
      float grid = max(gridX, gridY);

      // Mouse proximity glow
      float mouseDist = length(uMouse - (vUv - 0.5) * 2.0);
      float mouseGlow = smoothstep(1.0, 0.0, mouseDist) * 0.5;

      // Pulse
      float pulse = sin(uTime * 0.5) * 0.5 + 0.5;

      vec3 color = vec3(0.4, 0.2, 0.8) * grid * (0.05 + mouseGlow * pulse);
      float alpha = grid * (0.08 + mouseGlow * 0.3);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uMouse.value.lerp(
        new THREE.Vector2(state.pointer.x, state.pointer.y),
        0.03
      );
    }
  });

  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[30, 30]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={gridVertexShader}
        fragmentShader={gridFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Main Scene ─────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#a855f7" />
      <pointLight position={[-5, -5, 3]} intensity={0.3} color="#3b82f6" />
      <GridLines />
      <MorphSphere />
      <ParticleField />
    </>
  );
}

// ─── Exported Canvas Component ──────────────────────────────────────────
export default function GenerativeHero() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
