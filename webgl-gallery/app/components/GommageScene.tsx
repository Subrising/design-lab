"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";

// ─── Config ────────────────────────────────────────────────────
const WORDS = ["GOMMAGE", "DISSOLVE", "PETALS", "DUST"];
const CANVAS_W = 1024;
const CANVAS_H = 256;
const SAMPLE_GAP = 2;
const MAX_DUST = 8000;
const MAX_PETALS = 400;
const DUST_LIFE = 4.0;
const PETAL_LIFE = 6.0;
const BASE_COLOR = new THREE.Color(0xeccfa3);
const DISSOLVED_COLOR = new THREE.Color(0x5e5e5e);

// ─── Perlin Noise (2D) ────────────────────────────────────────
function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function lerp(a: number, b: number, t: number) {
  return a + t * (b - a);
}
function grad(hash: number, x: number, y: number) {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

const PERM = new Uint8Array(512);
{
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
}

function perlin2D(x: number, y: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);
  const aa = PERM[PERM[X] + Y];
  const ab = PERM[PERM[X] + Y + 1];
  const ba = PERM[PERM[X + 1] + Y];
  const bb = PERM[PERM[X + 1] + Y + 1];
  return lerp(
    lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
    lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
    v
  );
}

// ─── Generate Perlin noise texture for dissolve shader ─────────
function createPerlinTexture(size = 256): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  const scale = 4.0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x / size) * scale;
      const ny = (y / size) * scale;
      const n = (perlin2D(nx, ny) + 1) * 0.5;
      const boosted = Math.pow(n, 2);
      const val = Math.floor(boosted * 255);
      const i = (y * size + x) * 4;
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

// ─── Sample text into positions ────────────────────────────────
function sampleText(
  text: string,
  aspect = 4
): { positions: Float32Array; uvs: Float32Array; count: number } {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let fontSize = 200;
  ctx.font = `900 ${fontSize}px "Arial Black", Arial, sans-serif`;
  while (ctx.measureText(text).width > CANVAS_W * 0.85 && fontSize > 20) {
    fontSize -= 4;
    ctx.font = `900 ${fontSize}px "Arial Black", Arial, sans-serif`;
  }
  ctx.fillText(text, CANVAS_W / 2, CANVAS_H / 2);

  const imageData = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
  const pts: number[] = [];
  const uvsArr: number[] = [];

  for (let y = 0; y < CANVAS_H; y += SAMPLE_GAP) {
    for (let x = 0; x < CANVAS_W; x += SAMPLE_GAP) {
      if (imageData.data[(y * CANVAS_W + x) * 4 + 3] > 128) {
        const nx = (x / CANVAS_W - 0.5) * aspect;
        const ny = -(y / CANVAS_H - 0.5) * 2;
        pts.push(nx, ny, 0);
        uvsArr.push(x / CANVAS_W, y / CANVAS_H);
      }
    }
  }

  return {
    positions: new Float32Array(pts),
    uvs: new Float32Array(uvsArr),
    count: pts.length / 3,
  };
}

// ─── Text dissolve shaders ────────────────────────────────────
const textVertexShader = /* glsl */ `
  attribute vec2 aUv;
  varying vec2 vUv;
  varying vec2 vGlobalUv;

  void main() {
    vUv = aUv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 3.0 * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    // Global UV for noise sampling
    vGlobalUv = vec2(
      position.x * 0.15 + 0.5,
      position.y * 0.3 + 0.5
    );
  }
`;

const textFragmentShader = /* glsl */ `
  uniform float uProgress;
  uniform sampler2D uPerlinTex;
  uniform vec3 uBaseColor;
  uniform vec3 uDissolvedColor;
  uniform float uRemapMin;
  uniform float uRemapMax;

  varying vec2 vUv;
  varying vec2 vGlobalUv;

  void main() {
    // Circular point shape
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;

    // MSDF-style dissolve using Perlin noise
    float noise = texture2D(uPerlinTex, vGlobalUv).r;
    float remapped = clamp((noise - uRemapMin) / (uRemapMax - uRemapMin), 0.0, 1.0);
    float dissolve = step(uProgress, remapped);
    if (dissolve < 0.5) discard;

    // Color transition from warm gold to gray as dissolve progresses
    float desatProgress = smoothstep(0.0, 0.8, uProgress);
    vec3 col = mix(uBaseColor, uDissolvedColor, desatProgress);

    // Edge glow near dissolve boundary
    float edgeDist = abs(remapped - uProgress);
    float edgeGlow = smoothstep(0.08, 0.0, edgeDist) * (1.0 - step(1.0, uProgress));
    col += vec3(1.0, 0.6, 0.2) * edgeGlow * 2.0;

    // Soft edge for point
    float alpha = 1.0 - smoothstep(0.35, 0.5, dist);
    gl_FragColor = vec4(col, alpha * dissolve);
  }
`;

// ─── Dust particle shaders ────────────────────────────────────
const dustVertexShader = /* glsl */ `
  attribute vec3 aSpawnPos;
  attribute vec4 aBirthLifeSeedScale;

  uniform float uTime;
  uniform float uWindStrength;
  uniform vec3 uWindDirection;
  uniform float uRiseSpeed;
  uniform float uNoiseScale;
  uniform float uNoiseSpeed;
  uniform float uWobbleAmp;

  varying float vLife;
  varying float vSeed;

  // Simple noise for GPU
  float hash(float n) { return fract(sin(n) * 43758.5453); }
  float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = i.x + i.y * 57.0 + i.z * 113.0;
    return mix(
      mix(mix(hash(n), hash(n + 1.0), f.x),
          mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
      mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
          mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y),
      f.z
    );
  }

  void main() {
    float birthTime = aBirthLifeSeedScale.x;
    float lifespan = aBirthLifeSeedScale.y;
    float seed = aBirthLifeSeedScale.z;
    float baseScale = aBirthLifeSeedScale.w;

    float age = uTime - birthTime;
    float life = clamp(age / lifespan, 0.0, 1.0);
    vLife = life;
    vSeed = seed;

    // Not yet born or dead
    if (age < 0.0 || life >= 1.0) {
      gl_Position = vec4(0.0, 0.0, -99.0, 1.0);
      gl_PointSize = 0.0;
      return;
    }

    // Physics simulation
    vec3 pos = aSpawnPos;

    // Wind drift
    pos += uWindDirection * uWindStrength * age;

    // Rise
    pos.y += uRiseSpeed * age;

    // Turbulent wobble
    vec3 noiseInput = pos * uNoiseScale + uNoiseSpeed * uTime;
    pos.x += (noise3D(noiseInput) - 0.5) * uWobbleAmp * age;
    pos.y += (noise3D(noiseInput + 100.0) - 0.5) * uWobbleAmp * age * 0.5;
    pos.z += (noise3D(noiseInput + 200.0) - 0.5) * uWobbleAmp * age;

    // Scale animation: grow in, fade out
    float scaleIn = smoothstep(0.0, 0.05, life);
    float scaleOut = 1.0 - smoothstep(0.8, 1.0, life);
    float scale = baseScale * scaleIn * scaleOut;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = scale * 80.0 * (300.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const dustFragmentShader = /* glsl */ `
  varying float vLife;
  varying float vSeed;

  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;

    // Warm dust color with seed variation
    vec3 col = mix(
      vec3(0.93, 0.81, 0.64),
      vec3(0.85, 0.70, 0.50),
      vSeed
    );

    // Fade out with life
    float alpha = (1.0 - smoothstep(0.3, 0.5, dist));
    alpha *= (1.0 - smoothstep(0.7, 1.0, vLife));
    alpha *= smoothstep(0.0, 0.1, vLife);

    // Slight bloom contribution
    col *= 1.0 + (1.0 - vLife) * 0.5;

    gl_FragColor = vec4(col, alpha * 0.8);
  }
`;

// ─── Petal shaders ─────────────────────────────────────────────
const petalVertexShader = /* glsl */ `
  attribute vec3 instanceOffset;
  attribute vec4 instanceBirthLifeSeedScale;
  attribute vec3 instanceRotation;

  uniform float uTime;
  uniform float uWindStrength;
  uniform vec3 uWindDirection;
  uniform float uRiseSpeed;
  uniform float uSpinSpeed;
  uniform float uSpinAmp;
  uniform float uBendAmount;
  uniform float uBendSpeed;

  varying float vLife;
  varying vec3 vNormal;
  varying float vSeed;

  mat3 rotateX(float a) {
    float c = cos(a), s = sin(a);
    return mat3(1,0,0, 0,c,-s, 0,s,c);
  }
  mat3 rotateY(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c,0,s, 0,1,0, -s,0,c);
  }
  mat3 rotateZ(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c,-s,0, s,c,0, 0,0,1);
  }

  float hash(float n) { return fract(sin(n) * 43758.5453); }

  void main() {
    float birthTime = instanceBirthLifeSeedScale.x;
    float lifespan = instanceBirthLifeSeedScale.y;
    float seed = instanceBirthLifeSeedScale.z;
    float baseScale = instanceBirthLifeSeedScale.w;

    float age = uTime - birthTime;
    float life = clamp(age / lifespan, 0.0, 1.0);
    vLife = life;
    vSeed = seed;

    if (age < 0.0 || life >= 1.0) {
      gl_Position = vec4(0.0, 0.0, -99.0, 1.0);
      return;
    }

    // Petal bending — curve the mesh based on local Y
    vec3 bentPos = position;
    float bendFactor = sin(uTime * uBendSpeed + seed * 6.28) * uBendAmount;
    bentPos.z += bentPos.y * bentPos.y * bendFactor * 0.3;

    // Multi-axis spinning
    float spinPhase = seed * 6.28;
    float spinAngle = uTime * uSpinSpeed * uSpinAmp;
    mat3 rot = rotateX(spinAngle * 0.7 + spinPhase)
             * rotateY(spinAngle + spinPhase * 1.3)
             * rotateZ(spinAngle * 0.5 + spinPhase * 0.7);

    // Scale animation
    float scaleIn = smoothstep(0.0, 0.08, life);
    float scaleOut = 1.0 - smoothstep(0.85, 1.0, life);
    float scale = baseScale * scaleIn * scaleOut;

    vec3 localPos = rot * bentPos * scale;

    // World position with physics
    vec3 worldPos = instanceOffset;
    worldPos += uWindDirection * uWindStrength * age * 0.6;
    worldPos.y += uRiseSpeed * age * 0.4;

    // Gentle spiral
    float spiralAngle = age * (1.0 + seed) * 0.8;
    worldPos.x += sin(spiralAngle) * 0.3 * age;
    worldPos.z += cos(spiralAngle) * 0.3 * age;

    // Gravity — petals slowly fall
    worldPos.y -= 0.08 * age * age;

    localPos += worldPos;

    vNormal = normalize(normalMatrix * rot * normal);

    vec4 mvPos = modelViewMatrix * vec4(localPos, 1.0);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const petalFragmentShader = /* glsl */ `
  varying float vLife;
  varying vec3 vNormal;
  varying float vSeed;

  void main() {
    // Petal colors — soft pinks, corals, whites
    vec3 petalColors[4];
    petalColors[0] = vec3(0.96, 0.80, 0.78); // Soft pink
    petalColors[1] = vec3(0.98, 0.88, 0.85); // Light coral
    petalColors[2] = vec3(1.0, 0.95, 0.92);  // Almost white
    petalColors[3] = vec3(0.92, 0.75, 0.72); // Deep rose

    int idx = int(floor(vSeed * 4.0));
    vec3 col;
    if (idx == 0) col = petalColors[0];
    else if (idx == 1) col = petalColors[1];
    else if (idx == 2) col = petalColors[2];
    else col = petalColors[3];

    // Simple lighting
    vec3 lightDir = normalize(vec3(0.5, 1.0, 0.5));
    float diffuse = max(dot(vNormal, lightDir), 0.0) * 0.5 + 0.5;
    col *= diffuse;

    // Fade out
    float alpha = 1.0 - smoothstep(0.8, 1.0, vLife);
    alpha *= smoothstep(0.0, 0.1, vLife);

    gl_FragColor = vec4(col, alpha * 0.9);
  }
`;

// ─── Create a petal-shaped geometry ────────────────────────────
function createPetalGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.03, 0.03, 0.06, 0.08, 0.04, 0.14);
  shape.bezierCurveTo(0.02, 0.18, 0, 0.2, 0, 0.2);
  shape.bezierCurveTo(0, 0.2, -0.02, 0.18, -0.04, 0.14);
  shape.bezierCurveTo(-0.06, 0.08, -0.03, 0.03, 0, 0);

  const geo = new THREE.ShapeGeometry(shape, 8);

  // Add some Z variation for 3D curvature
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const normalizedY = y / 0.2;
    pos.setZ(i, Math.sin(normalizedY * Math.PI) * 0.015);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();

  return geo;
}

// ─── Main Component ───────────────────────────────────────────
export default function GommageScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    wordIndex: 0,
    progress: { value: 0 },
    isAnimating: false,
    mouseWorld: new THREE.Vector2(0, 0),
    dustSpawnIdx: 0,
    petalSpawnIdx: 0,
    clock: new THREE.Clock(),
  });

  const triggerGommage = useCallback(() => {
    const s = stateRef.current;
    if (s.isAnimating) return;
    s.isAnimating = true;

    // Animate progress 0 → 1
    gsap.to(s.progress, {
      value: 1,
      duration: 5,
      ease: "power2.inOut",
      onComplete: () => {
        // Hold for a moment, then reset with new word
        gsap.delayedCall(1.5, () => {
          s.wordIndex = (s.wordIndex + 1) % WORDS.length;
          s.progress.value = 0;
          s.isAnimating = false;
          s.dustSpawnIdx = 0;
          s.petalSpawnIdx = 0;
        });
      },
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current!;
    const state = stateRef.current;

    // ─── Scene setup ─────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0a0a, 1);
    container.appendChild(renderer.domElement);

    // Bloom post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.6,
      0.4,
      0.85
    );
    composer.addPass(bloomPass);

    // Perlin noise texture for dissolve
    const perlinTex = createPerlinTexture(256);

    // ─── Text particles ──────────────────────────────────
    let textPoints: THREE.Points;
    let textMaterial: THREE.ShaderMaterial;
    let textGeometry: THREE.BufferGeometry;
    let currentPositions: Float32Array;
    let currentUvs: Float32Array;
    let currentCount = 0;

    function buildText(word: string) {
      const { positions, uvs, count } = sampleText(word);
      currentPositions = positions;
      currentUvs = uvs;
      currentCount = count;

      if (textPoints) scene.remove(textPoints);
      if (textGeometry) textGeometry.dispose();

      textGeometry = new THREE.BufferGeometry();
      textGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      textGeometry.setAttribute(
        "aUv",
        new THREE.Float32BufferAttribute(uvs, 2)
      );

      textMaterial = new THREE.ShaderMaterial({
        vertexShader: textVertexShader,
        fragmentShader: textFragmentShader,
        uniforms: {
          uProgress: { value: 0 },
          uPerlinTex: { value: perlinTex },
          uBaseColor: { value: BASE_COLOR },
          uDissolvedColor: { value: DISSOLVED_COLOR },
          uRemapMin: { value: 0.0 },
          uRemapMax: { value: 1.0 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      textPoints = new THREE.Points(textGeometry, textMaterial);
      scene.add(textPoints);
    }

    buildText(WORDS[0]);

    // ─── Dust system (Points-based) ──────────────────────
    const dustGeo = new THREE.BufferGeometry();
    const dustSpawnPos = new Float32Array(MAX_DUST * 3);
    const dustBLSS = new Float32Array(MAX_DUST * 4); // birth, life, seed, scale
    dustGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(new Float32Array(MAX_DUST * 3), 3)
    );
    dustGeo.setAttribute(
      "aSpawnPos",
      new THREE.Float32BufferAttribute(dustSpawnPos, 3)
    );
    dustGeo.setAttribute(
      "aBirthLifeSeedScale",
      new THREE.Float32BufferAttribute(dustBLSS, 4)
    );

    // Initialize all dust as already dead
    for (let i = 0; i < MAX_DUST; i++) {
      dustBLSS[i * 4] = -999;
      dustBLSS[i * 4 + 1] = DUST_LIFE;
      dustBLSS[i * 4 + 2] = Math.random();
      dustBLSS[i * 4 + 3] = 0.01 + Math.random() * 0.02;
    }

    const dustMat = new THREE.ShaderMaterial({
      vertexShader: dustVertexShader,
      fragmentShader: dustFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uWindDirection: { value: new THREE.Vector3(0.3, 0.1, 0) },
        uWindStrength: { value: 0.15 },
        uRiseSpeed: { value: 0.2 },
        uNoiseScale: { value: 30.0 },
        uNoiseSpeed: { value: 0.015 },
        uWobbleAmp: { value: 0.6 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // ─── Petal system (InstancedMesh) ────────────────────
    const petalGeo = createPetalGeometry();
    const petalMat = new THREE.ShaderMaterial({
      vertexShader: petalVertexShader,
      fragmentShader: petalFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uWindDirection: { value: new THREE.Vector3(0.3, 0.1, 0) },
        uWindStrength: { value: 0.15 },
        uRiseSpeed: { value: 0.2 },
        uSpinSpeed: { value: 2.0 },
        uSpinAmp: { value: 0.45 },
        uBendAmount: { value: 2.5 },
        uBendSpeed: { value: 1.0 },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    // Use raw geometry with instance attributes for petals
    const petalInstanceGeo = petalGeo.clone();
    const petalOffsets = new Float32Array(MAX_PETALS * 3);
    const petalBLSS = new Float32Array(MAX_PETALS * 4);
    const petalRot = new Float32Array(MAX_PETALS * 3);

    for (let i = 0; i < MAX_PETALS; i++) {
      petalBLSS[i * 4] = -999;
      petalBLSS[i * 4 + 1] = PETAL_LIFE;
      petalBLSS[i * 4 + 2] = Math.random();
      petalBLSS[i * 4 + 3] = 0.8 + Math.random() * 1.5;
      petalRot[i * 3] = Math.random() * Math.PI * 2;
      petalRot[i * 3 + 1] = Math.random() * Math.PI * 2;
      petalRot[i * 3 + 2] = Math.random() * Math.PI * 2;
    }

    petalInstanceGeo.setAttribute(
      "instanceOffset",
      new THREE.InstancedBufferAttribute(petalOffsets, 3)
    );
    petalInstanceGeo.setAttribute(
      "instanceBirthLifeSeedScale",
      new THREE.InstancedBufferAttribute(petalBLSS, 4)
    );
    petalInstanceGeo.setAttribute(
      "instanceRotation",
      new THREE.InstancedBufferAttribute(petalRot, 3)
    );

    const petalMesh = new THREE.InstancedMesh(
      petalInstanceGeo,
      petalMat,
      MAX_PETALS
    );
    petalMesh.frustumCulled = false;
    scene.add(petalMesh);

    // ─── Spawn particles during dissolution ──────────────
    let lastSpawnTime = 0;
    const DUST_INTERVAL = 0.06;
    const PETAL_INTERVAL = 0.15;
    let lastPetalTime = 0;

    function spawnDustBatch(time: number) {
      if (currentCount === 0) return;
      const batchSize = 40;
      for (let b = 0; b < batchSize; b++) {
        const idx = state.dustSpawnIdx % MAX_DUST;
        state.dustSpawnIdx++;

        // Pick a random text position
        const textIdx = Math.floor(Math.random() * currentCount);
        const px = currentPositions[textIdx * 3];
        const py = currentPositions[textIdx * 3 + 1];

        dustSpawnPos[idx * 3] = px + (Math.random() - 0.5) * 0.1;
        dustSpawnPos[idx * 3 + 1] = py + (Math.random() - 0.5) * 0.1;
        dustSpawnPos[idx * 3 + 2] = (Math.random() - 0.5) * 0.2;
        dustBLSS[idx * 4] = time;
        dustBLSS[idx * 4 + 2] = Math.random();
        dustBLSS[idx * 4 + 3] = 0.005 + Math.random() * 0.015;
      }

      (
        dustGeo.attributes.aSpawnPos as THREE.BufferAttribute
      ).needsUpdate = true;
      (
        dustGeo.attributes.aBirthLifeSeedScale as THREE.BufferAttribute
      ).needsUpdate = true;
    }

    function spawnPetalBatch(time: number) {
      if (currentCount === 0) return;
      const batchSize = 3;
      for (let b = 0; b < batchSize; b++) {
        const idx = state.petalSpawnIdx % MAX_PETALS;
        state.petalSpawnIdx++;

        const textIdx = Math.floor(Math.random() * currentCount);
        const px = currentPositions[textIdx * 3];
        const py = currentPositions[textIdx * 3 + 1];

        petalOffsets[idx * 3] = px + (Math.random() - 0.5) * 0.3;
        petalOffsets[idx * 3 + 1] = py + (Math.random() - 0.5) * 0.2;
        petalOffsets[idx * 3 + 2] = (Math.random() - 0.5) * 0.3;
        petalBLSS[idx * 4] = time;
        petalBLSS[idx * 4 + 2] = Math.random();
        petalBLSS[idx * 4 + 3] = 0.6 + Math.random() * 1.2;
      }

      (
        petalInstanceGeo.attributes.instanceOffset as THREE.InstancedBufferAttribute
      ).needsUpdate = true;
      (
        petalInstanceGeo.attributes
          .instanceBirthLifeSeedScale as THREE.InstancedBufferAttribute
      ).needsUpdate = true;
    }

    // ─── Mouse interaction ───────────────────────────────
    function onMouseMove(e: MouseEvent) {
      state.mouseWorld.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    }

    function onClick() {
      triggerGommage();
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);
    window.addEventListener("touchstart", onClick, { passive: false });

    // ─── Animation loop ──────────────────────────────────
    let animId: number;
    state.clock.start();

    function animate() {
      animId = requestAnimationFrame(animate);
      const time = state.clock.getElapsedTime();
      const progress = state.progress.value;

      // Rebuild text if word changed and progress is 0
      if (
        !state.isAnimating &&
        textMaterial &&
        textMaterial.uniforms.uProgress.value > 0.9
      ) {
        // Will be reset by gsap callback
      }

      // Update text dissolve
      if (textMaterial) {
        textMaterial.uniforms.uProgress.value = progress;
      }

      // Rebuild text mesh when progress resets to 0
      if (progress === 0 && textMaterial && currentCount === 0) {
        buildText(WORDS[state.wordIndex]);
      }

      // Spawn dust and petals during dissolution
      if (progress > 0.05 && progress < 0.95) {
        if (time - lastSpawnTime > DUST_INTERVAL) {
          spawnDustBatch(time);
          lastSpawnTime = time;
        }
        if (time - lastPetalTime > PETAL_INTERVAL) {
          spawnPetalBatch(time);
          lastPetalTime = time;
        }
      }

      // Update particle uniforms
      dustMat.uniforms.uTime.value = time;
      petalMat.uniforms.uTime.value = time;

      // Mouse-reactive wind direction
      const windX = 0.3 + state.mouseWorld.x * 0.2;
      const windY = 0.1 + state.mouseWorld.y * 0.15;
      dustMat.uniforms.uWindDirection.value.set(windX, windY, 0);
      petalMat.uniforms.uWindDirection.value.set(windX, windY, 0);

      composer.render();
    }

    // Rebuild text when word changes
    const wordCheckInterval = setInterval(() => {
      if (!state.isAnimating && state.progress.value === 0) {
        buildText(WORDS[state.wordIndex]);
      }
    }, 100);

    animate();

    // ─── Resize ──────────────────────────────────────────
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(wordCheckInterval);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("touchstart", onClick);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      composer.dispose();
      textGeometry?.dispose();
      textMaterial?.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      petalGeo.dispose();
      petalMat.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [triggerGommage]);

  return <div ref={containerRef} className="fixed inset-0 w-full h-full" />;
}
