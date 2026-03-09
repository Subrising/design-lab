"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

const WORDS = ["DESTROY", "CREATE", "BREAK", "BUILD", "CHAOS", "ORDER"];
const PARTICLE_SIZE = 0.04;
const SAMPLE_GAP = 3; // pixel gap between samples — lower = more particles
const CANVAS_W = 512;
const CANVAS_H = 256;
const MAX_PARTICLES = 20000;
const SPRING = 0.03;
const DAMPING = 0.88;
const EXPLOSION_FORCE = 0.6;

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  tx: number; // target x
  ty: number; // target y
  tz: number; // target z
  life: number;
}

/** Sample text pixels from an offscreen canvas, return normalized 3D positions */
function sampleText(text: string): Array<[number, number]> {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Auto-size font to fit canvas width
  let fontSize = 160;
  ctx.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`;
  while (ctx.measureText(text).width > CANVAS_W * 0.85 && fontSize > 20) {
    fontSize -= 4;
    ctx.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`;
  }

  ctx.fillText(text, CANVAS_W / 2, CANVAS_H / 2);

  const imageData = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
  const points: Array<[number, number]> = [];

  for (let y = 0; y < CANVAS_H; y += SAMPLE_GAP) {
    for (let x = 0; x < CANVAS_W; x += SAMPLE_GAP) {
      const alpha = imageData.data[(y * CANVAS_W + x) * 4 + 3];
      if (alpha > 128) {
        // Normalize to [-aspect, aspect] x [-1, 1] centered at origin
        const nx = ((x / CANVAS_W) - 0.5) * 4;
        const ny = -((y / CANVAS_H) - 0.5) * 2;
        points.push([nx, ny]);
      }
    }
  }

  return points;
}

export default function ParticleText() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;

    // --- Three.js setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0a0a, 1);
    container.appendChild(renderer.domElement);

    // --- Instanced mesh ---
    const geometry = new THREE.SphereGeometry(PARTICLE_SIZE, 6, 6);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.InstancedMesh(geometry, material, MAX_PARTICLES);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Per-instance color
    const colorArray = new Float32Array(MAX_PARTICLES * 3);
    mesh.instanceColor = new THREE.InstancedBufferAttribute(colorArray, 3);
    mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);

    scene.add(mesh);

    // --- Particle state (flat arrays for perf — "compute shader" style) ---
    const particles: Particle[] = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 4,
        z: (Math.random() - 0.5) * 2,
        vx: 0, vy: 0, vz: 0,
        tx: 0, ty: 0, tz: 0,
        life: 0,
      });
    }

    let activeCount = 0;
    let wordIndex = 0;
    let isExploding = false;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    // Palette
    const palette = [
      new THREE.Color(0xff3366),
      new THREE.Color(0x33ccff),
      new THREE.Color(0xffcc00),
      new THREE.Color(0x66ff99),
      new THREE.Color(0xff6633),
      new THREE.Color(0xcc66ff),
    ];

    /** Assign text positions to particles */
    function formText(text: string) {
      const points = sampleText(text);
      activeCount = Math.min(points.length, MAX_PARTICLES);
      mesh.count = activeCount;

      const paletteColor = palette[wordIndex % palette.length];

      for (let i = 0; i < activeCount; i++) {
        const [px, py] = points[i];
        const p = particles[i];
        p.tx = px;
        p.ty = py;
        p.tz = (Math.random() - 0.5) * 0.15;
        p.life = 1;

        // Slight color variation per particle
        const variation = 0.85 + Math.random() * 0.3;
        color.copy(paletteColor).multiplyScalar(variation);
        colorArray[i * 3] = color.r;
        colorArray[i * 3 + 1] = color.g;
        colorArray[i * 3 + 2] = color.b;
      }

      // Hide unused particles
      for (let i = activeCount; i < MAX_PARTICLES; i++) {
        particles[i].life = 0;
      }

      mesh.instanceColor!.needsUpdate = true;
    }

    /** Explode all particles outward from a world-space click point */
    function explode(clickX: number, clickY: number) {
      if (isExploding) return;
      isExploding = true;

      for (let i = 0; i < activeCount; i++) {
        const p = particles[i];
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
        const force = EXPLOSION_FORCE / dist;

        p.vx += (dx / dist) * force * (0.8 + Math.random() * 0.4);
        p.vy += (dy / dist) * force * (0.8 + Math.random() * 0.4);
        p.vz += (Math.random() - 0.5) * EXPLOSION_FORCE * 0.8;
      }

      // After explosion settles, form next word
      gsap.delayedCall(1.2, () => {
        wordIndex = (wordIndex + 1) % WORDS.length;
        formText(WORDS[wordIndex]);
        isExploding = false;
      });
    }

    /** Hover repulsion — gentle push away from cursor */
    let mouseWorldX = 0;
    let mouseWorldY = 0;

    function onMouseMove(e: MouseEvent) {
      const ndcX = (e.clientX / window.innerWidth) * 2 - 1;
      const ndcY = -(e.clientY / window.innerHeight) * 2 + 1;
      // Unproject to z=0 plane
      const vec = new THREE.Vector3(ndcX, ndcY, 0.5);
      vec.unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const t = -camera.position.z / dir.z;
      mouseWorldX = camera.position.x + dir.x * t;
      mouseWorldY = camera.position.y + dir.y * t;
    }

    function onClick(e: MouseEvent) {
      const ndcX = (e.clientX / window.innerWidth) * 2 - 1;
      const ndcY = -(e.clientY / window.innerHeight) * 2 + 1;
      const vec = new THREE.Vector3(ndcX, ndcY, 0.5);
      vec.unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const t = -camera.position.z / dir.z;
      const wx = camera.position.x + dir.x * t;
      const wy = camera.position.y + dir.y * t;
      explode(wx, wy);
    }

    /** Physics update — spring-damper toward target positions */
    function simulate() {
      const hoverRadius = 0.5;
      const hoverForce = 0.015;

      for (let i = 0; i < activeCount; i++) {
        const p = particles[i];

        // Spring toward target
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const dz = p.tz - p.z;

        p.vx += dx * SPRING;
        p.vy += dy * SPRING;
        p.vz += dz * SPRING;

        // Hover repulsion
        const hx = p.x - mouseWorldX;
        const hy = p.y - mouseWorldY;
        const hDist = Math.sqrt(hx * hx + hy * hy);
        if (hDist < hoverRadius) {
          const pushStrength = (1 - hDist / hoverRadius) * hoverForce;
          p.vx += (hx / (hDist + 0.001)) * pushStrength;
          p.vy += (hy / (hDist + 0.001)) * pushStrength;
          p.vz += (Math.random() - 0.5) * pushStrength * 0.3;
        }

        // Damping
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.vz *= DAMPING;

        // Integrate
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Update instance matrix
        dummy.position.set(p.x, p.y, p.z);
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy + p.vz * p.vz);
        const scale = 1 + speed * 8; // Stretch when moving fast
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
    }

    // --- Initial text ---
    // Scatter particles randomly first, then form text
    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles[i].x = (Math.random() - 0.5) * 10;
      particles[i].y = (Math.random() - 0.5) * 6;
      particles[i].z = (Math.random() - 0.5) * 4;
    }
    formText(WORDS[0]);

    // --- Animate ---
    let animId: number;
    function animate() {
      animId = requestAnimationFrame(animate);
      simulate();
      renderer.render(scene, camera);
    }
    animate();

    // --- Events ---
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onResize);

    // Touch support
    function onTouch(e: TouchEvent) {
      e.preventDefault();
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch) return;
      const ndcX = (touch.clientX / window.innerWidth) * 2 - 1;
      const ndcY = -(touch.clientY / window.innerHeight) * 2 + 1;
      const vec = new THREE.Vector3(ndcX, ndcY, 0.5);
      vec.unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const t = -camera.position.z / dir.z;
      explode(camera.position.x + dir.x * t, camera.position.y + dir.y * t);
    }
    window.addEventListener("touchstart", onTouch, { passive: false });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("touchstart", onTouch);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
