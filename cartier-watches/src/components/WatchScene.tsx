"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const GOLD = 0xc9a96e;
const GOLD_LIGHT = 0xd4b97a;
const DARK_METAL = 0x2a2a2a;
const SILVER = 0xc0c0c0;
const CREAM = 0xf5e6c8;

function createWatch(scene: THREE.Scene) {
  const watchGroup = new THREE.Group();

  // === CASE (main body) ===
  const caseGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.45, 64);
  const caseMat = new THREE.MeshStandardMaterial({
    color: GOLD,
    metalness: 0.95,
    roughness: 0.15,
  });
  const caseMesh = new THREE.Mesh(caseGeo, caseMat);
  watchGroup.add(caseMesh);

  // === BEZEL (raised ring) ===
  const bezelGeo = new THREE.TorusGeometry(1.6, 0.08, 16, 64);
  const bezelMat = new THREE.MeshStandardMaterial({
    color: GOLD_LIGHT,
    metalness: 1.0,
    roughness: 0.1,
  });
  const bezelTop = new THREE.Mesh(bezelGeo, bezelMat);
  bezelTop.position.y = 0.22;
  bezelTop.rotation.x = Math.PI / 2;
  watchGroup.add(bezelTop);

  const bezelBottom = bezelTop.clone();
  bezelBottom.position.y = -0.22;
  watchGroup.add(bezelBottom);

  // === DIAL (face) ===
  const dialGeo = new THREE.CylinderGeometry(1.48, 1.48, 0.02, 64);
  const dialMat = new THREE.MeshStandardMaterial({
    color: CREAM,
    metalness: 0.1,
    roughness: 0.6,
  });
  const dial = new THREE.Mesh(dialGeo, dialMat);
  dial.position.y = 0.24;
  watchGroup.add(dial);

  // === HOUR MARKERS (roman numeral style — small bars) ===
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const isCardinal = i % 3 === 0;
    const markerGeo = new THREE.BoxGeometry(
      isCardinal ? 0.08 : 0.04,
      0.01,
      isCardinal ? 0.22 : 0.14
    );
    const markerMat = new THREE.MeshStandardMaterial({
      color: DARK_METAL,
      metalness: 0.8,
      roughness: 0.3,
    });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    const radius = 1.25;
    marker.position.set(
      Math.sin(angle) * radius,
      0.255,
      Math.cos(angle) * radius
    );
    marker.rotation.y = -angle;
    watchGroup.add(marker);
  }

  // === HANDS ===
  const handMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    metalness: 0.9,
    roughness: 0.2,
  });

  // Hour hand
  const hourGeo = new THREE.BoxGeometry(0.06, 0.015, 0.7);
  const hourHand = new THREE.Mesh(hourGeo, handMat);
  hourHand.position.set(0, 0.27, 0.3);
  hourHand.name = "hourHand";
  watchGroup.add(hourHand);

  // Minute hand
  const minuteGeo = new THREE.BoxGeometry(0.04, 0.015, 1.0);
  const minuteHand = new THREE.Mesh(minuteGeo, handMat);
  minuteHand.position.set(0.15, 0.27, 0.35);
  minuteHand.rotation.y = Math.PI / 6;
  minuteHand.name = "minuteHand";
  watchGroup.add(minuteHand);

  // Center pin
  const pinGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16);
  const pinMat = new THREE.MeshStandardMaterial({
    color: GOLD,
    metalness: 1.0,
    roughness: 0.05,
  });
  const pin = new THREE.Mesh(pinGeo, pinMat);
  pin.position.y = 0.28;
  watchGroup.add(pin);

  // === CROWN (winding knob) ===
  const crownGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.3, 8);
  const crownMat = new THREE.MeshStandardMaterial({
    color: GOLD,
    metalness: 0.95,
    roughness: 0.2,
  });
  const crown = new THREE.Mesh(crownGeo, crownMat);
  crown.position.set(1.8, 0, 0);
  crown.rotation.z = Math.PI / 2;
  watchGroup.add(crown);

  // Crown cabochon (blue jewel)
  const cabochonGeo = new THREE.SphereGeometry(0.06, 16, 16);
  const cabochonMat = new THREE.MeshStandardMaterial({
    color: 0x1a3a6e,
    metalness: 0.3,
    roughness: 0.1,
    emissive: 0x0a1a3e,
    emissiveIntensity: 0.5,
  });
  const cabochon = new THREE.Mesh(cabochonGeo, cabochonMat);
  cabochon.position.set(1.96, 0, 0);
  watchGroup.add(cabochon);

  // === LUGS (attachment points for strap) ===
  const lugGeo = new THREE.BoxGeometry(0.35, 0.4, 0.5);
  const lugMat = new THREE.MeshStandardMaterial({
    color: GOLD,
    metalness: 0.95,
    roughness: 0.15,
  });

  const lugPositions = [
    [0.8, 0, 1.75],
    [-0.8, 0, 1.75],
    [0.8, 0, -1.75],
    [-0.8, 0, -1.75],
  ];

  lugPositions.forEach(([x, y, z]) => {
    const lug = new THREE.Mesh(lugGeo, lugMat);
    lug.position.set(x, y, z);
    watchGroup.add(lug);
  });

  // === BRACELET LINKS ===
  const linkMat = new THREE.MeshStandardMaterial({
    color: GOLD,
    metalness: 0.9,
    roughness: 0.2,
  });

  for (let i = 0; i < 6; i++) {
    const linkGeo = new THREE.BoxGeometry(1.4, 0.35, 0.35);
    const link = new THREE.Mesh(linkGeo, linkMat);
    link.position.set(0, 0, 2.15 + i * 0.4);
    watchGroup.add(link);

    const link2 = link.clone();
    link2.position.z = -(2.15 + i * 0.4);
    watchGroup.add(link2);
  }

  // === CASE BACK (visible from behind) ===
  const backGeo = new THREE.CylinderGeometry(1.55, 1.55, 0.05, 64);
  const backMat = new THREE.MeshStandardMaterial({
    color: SILVER,
    metalness: 0.95,
    roughness: 0.1,
  });
  const back = new THREE.Mesh(backGeo, backMat);
  back.position.y = -0.24;
  watchGroup.add(back);

  // Position the whole watch
  watchGroup.rotation.x = -Math.PI / 6;
  watchGroup.name = "watch";

  scene.add(watchGroup);
  return watchGroup;
}

function setupLighting(scene: THREE.Scene) {
  // Ambient base
  const ambient = new THREE.AmbientLight(0xffffff, 0.15);
  scene.add(ambient);

  // Key light — warm gold from upper right
  const keyLight = new THREE.DirectionalLight(0xffeedd, 1.8);
  keyLight.position.set(5, 8, 3);
  keyLight.castShadow = true;
  scene.add(keyLight);

  // Fill light — cool from left
  const fillLight = new THREE.DirectionalLight(0xaabbcc, 0.4);
  fillLight.position.set(-4, 2, -2);
  scene.add(fillLight);

  // Rim light — bright from behind for edge definition
  const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
  rimLight.position.set(0, 3, -8);
  scene.add(rimLight);

  // Gold accent spot from below
  const accentSpot = new THREE.SpotLight(GOLD, 2.0, 15, Math.PI / 4, 0.5);
  accentSpot.position.set(0, -5, 2);
  accentSpot.target.position.set(0, 0, 0);
  scene.add(accentSpot);
  scene.add(accentSpot.target);

  // Subtle point lights for sparkle
  const sparkle1 = new THREE.PointLight(0xffeedd, 0.6, 10);
  sparkle1.position.set(3, 2, 4);
  scene.add(sparkle1);

  const sparkle2 = new THREE.PointLight(GOLD, 0.4, 8);
  sparkle2.position.set(-3, 1, 3);
  scene.add(sparkle2);
}

// Camera keyframes for scroll positions (0-1 normalized)
const CAMERA_KEYFRAMES = [
  { pos: [0, 2, 7], look: [0, 0, 0], rotation: 0 },       // Hero: front-on, slightly above
  { pos: [-5, 1, 4], look: [0, 0, 0], rotation: Math.PI * 0.3 },  // Craft: side angle
  { pos: [0, 5, 3], look: [0, 0, 0], rotation: Math.PI * 0.7 },   // Detail: top-down
  { pos: [3, -1, 5], look: [0, 0, 0], rotation: Math.PI * 1.2 },  // Movement: low angle
  { pos: [0, 1, 8], look: [0, 0, 0], rotation: Math.PI * 2 },     // Finale: pull back
];

export function WatchScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    watch: THREE.Group;
    lenis: Lenis | null;
    animationId: number;
    mouse: { x: number; y: number };
    scrollProgress: { value: number };
  } | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (sceneRef.current) {
      sceneRef.current.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneRef.current.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // === RENDERER ===
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setClearColor(0x0a0a0a, 1);

    // === SCENE ===
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.03);

    // === CAMERA ===
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 2, 7);
    camera.lookAt(0, 0, 0);

    // === ENVIRONMENT (simple gradient bg) ===
    const envGeo = new THREE.SphereGeometry(30, 32, 32);
    const envMat = new THREE.MeshBasicMaterial({
      color: 0x0a0a0a,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(envGeo, envMat));

    // Floating particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      size: 0.015,
      color: GOLD,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // === WATCH MODEL ===
    const watch = createWatch(scene);

    // === LIGHTING ===
    setupLighting(scene);

    // === LENIS SMOOTH SCROLL ===
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Connect Lenis → GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // === STATE ===
    const scrollProgress = { value: 0 };
    sceneRef.current = {
      scene,
      camera,
      renderer,
      watch,
      lenis,
      animationId: 0,
      mouse: { x: 0, y: 0 },
      scrollProgress,
    };

    // === SCROLL-DRIVEN CAMERA ANIMATION ===
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
      onUpdate: (self) => {
        scrollProgress.value = self.progress;
      },
    });

    // === RENDER LOOP ===
    const clock = new THREE.Clock();

    function animate() {
      const state = sceneRef.current;
      if (!state) return;

      const elapsed = clock.getElapsedTime();
      const progress = state.scrollProgress.value;

      // Interpolate between camera keyframes
      const totalSegments = CAMERA_KEYFRAMES.length - 1;
      const rawSegment = progress * totalSegments;
      const segmentIndex = Math.min(
        Math.floor(rawSegment),
        totalSegments - 1
      );
      const segmentProgress = rawSegment - segmentIndex;

      const from = CAMERA_KEYFRAMES[segmentIndex];
      const to = CAMERA_KEYFRAMES[segmentIndex + 1];

      // Smooth easing between keyframes
      const t = segmentProgress * segmentProgress * (3 - 2 * segmentProgress); // smoothstep

      const camX =
        from.pos[0] + (to.pos[0] - from.pos[0]) * t +
        state.mouse.x * 0.3;
      const camY =
        from.pos[1] + (to.pos[1] - from.pos[1]) * t +
        state.mouse.y * 0.2;
      const camZ = from.pos[2] + (to.pos[2] - from.pos[2]) * t;

      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, 0, 0);

      // Rotate watch based on scroll + time
      const targetRotY =
        from.rotation + (to.rotation - from.rotation) * t;
      watch.rotation.y = targetRotY + Math.sin(elapsed * 0.3) * 0.05;
      watch.rotation.x = -Math.PI / 6 + Math.sin(elapsed * 0.2) * 0.02;

      // Gentle floating motion
      watch.position.y = Math.sin(elapsed * 0.5) * 0.08;

      // Rotate particles slowly
      particles.rotation.y = elapsed * 0.02;
      particles.rotation.x = Math.sin(elapsed * 0.1) * 0.05;

      renderer.render(scene, camera);
      state.animationId = requestAnimationFrame(animate);
    }

    animate();

    // === MOUSE ===
    window.addEventListener("mousemove", handleMouseMove);

    // === RESIZE ===
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.lenis?.destroy();
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
      renderer.dispose();
      scene.clear();
    };
  }, [handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
}
