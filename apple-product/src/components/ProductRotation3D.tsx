"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function createPhoneModel(): THREE.Group {
  const phone = new THREE.Group();

  // Phone body
  const bodyGeom = new THREE.BoxGeometry(2.4, 5, 0.3, 4, 8, 2);
  // Round the edges
  const positions = bodyGeom.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < positions.count; i++) {
    v.fromBufferAttribute(positions, i);
    const rx = 0.15;
    const ry = 0.25;
    const rz = 0.08;

    // Round X edges
    if (Math.abs(v.x) > 1.2 - rx) {
      const sign = Math.sign(v.x);
      const excess = Math.abs(v.x) - (1.2 - rx);
      if (excess > 0) {
        const angle = Math.asin(Math.min(excess / rx, 1));
        v.x = sign * (1.2 - rx + Math.sin(angle) * rx);
        if (Math.abs(v.z) > 0.1) {
          v.z = Math.sign(v.z) * (0.15 - (1 - Math.cos(angle)) * rz);
        }
      }
    }
    // Round Y edges
    if (Math.abs(v.y) > 2.5 - ry) {
      const sign = Math.sign(v.y);
      const excess = Math.abs(v.y) - (2.5 - ry);
      if (excess > 0) {
        const angle = Math.asin(Math.min(excess / ry, 1));
        v.y = sign * (2.5 - ry + Math.sin(angle) * ry);
        if (Math.abs(v.z) > 0.1) {
          v.z = Math.sign(v.z) * (0.15 - (1 - Math.cos(angle)) * rz);
        }
      }
    }
    positions.setXYZ(i, v.x, v.y, v.z);
  }
  bodyGeom.computeVertexNormals();

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#1a1a2e"),
    metalness: 0.95,
    roughness: 0.15,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    reflectivity: 1,
  });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  phone.add(body);

  // Screen
  const screenGeom = new THREE.PlaneGeometry(2.1, 4.5);
  const screenMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#0a0a1a"),
    metalness: 0.1,
    roughness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    emissive: new THREE.Color("#0a1030"),
    emissiveIntensity: 0.3,
  });
  const screen = new THREE.Mesh(screenGeom, screenMat);
  screen.position.z = 0.16;
  phone.add(screen);

  // Dynamic Island
  const diGeom = new THREE.PlaneGeometry(0.8, 0.18);
  const diMat = new THREE.MeshBasicMaterial({ color: "#000000" });
  const di = new THREE.Mesh(diGeom, diMat);
  di.position.set(0, 1.95, 0.17);
  phone.add(di);

  // Camera island
  const camIslandGeom = new THREE.BoxGeometry(0.9, 0.9, 0.1, 2, 2, 1);
  const camIslandMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#111118"),
    metalness: 0.8,
    roughness: 0.2,
    clearcoat: 0.5,
  });
  const camIsland = new THREE.Mesh(camIslandGeom, camIslandMat);
  camIsland.position.set(-0.55, 1.5, -0.2);
  phone.add(camIsland);

  // Camera lenses
  const lensPositions = [
    [-0.75, 1.7, -0.26],
    [-0.35, 1.7, -0.26],
    [-0.55, 1.3, -0.26],
  ];
  for (const [lx, ly, lz] of lensPositions) {
    const lensGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 16);
    const lensMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#050510"),
      metalness: 0.5,
      roughness: 0.05,
      clearcoat: 1,
    });
    const lens = new THREE.Mesh(lensGeom, lensMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(lx, ly, lz);
    phone.add(lens);

    // Lens ring
    const ringGeom = new THREE.TorusGeometry(0.13, 0.015, 8, 24);
    const ringMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#2a2a3e"),
      metalness: 1,
      roughness: 0.1,
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.position.set(lx, ly, lz - 0.01);
    phone.add(ring);
  }

  // Side button
  const btnGeom = new THREE.BoxGeometry(0.04, 0.5, 0.06);
  const btnMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#2a2a3e"),
    metalness: 0.95,
    roughness: 0.2,
  });
  const sideBtn = new THREE.Mesh(btnGeom, btnMat);
  sideBtn.position.set(1.22, 0.5, 0);
  phone.add(sideBtn);

  return phone;
}

export default function ProductRotation3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const mount = mountRef.current;
    if (!container || !mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x4466ff, 0.6);
    fillLight.position.set(-5, 0, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x0071e3, 0.8);
    rimLight.position.set(0, -3, -5);
    scene.add(rimLight);

    const topLight = new THREE.PointLight(0xffffff, 0.5, 20);
    topLight.position.set(0, 8, 2);
    scene.add(topLight);

    // Phone model
    const phone = createPhoneModel();
    phone.rotation.x = 0.1;
    phone.rotation.y = -0.5;
    scene.add(phone);

    // ScrollTrigger animation
    const rotationState = { y: -0.5, x: 0.1, zoom: 10 };

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;

        // Multi-phase rotation
        if (p < 0.25) {
          // Front view to side
          const t = p / 0.25;
          rotationState.y = -0.5 + t * 2;
          rotationState.x = 0.1 - t * 0.1;
          rotationState.zoom = 10 - t * 2;
        } else if (p < 0.5) {
          // Side to back
          const t = (p - 0.25) / 0.25;
          rotationState.y = 1.5 + t * 1.5;
          rotationState.x = 0 + t * 0.15;
          rotationState.zoom = 8 - t * 0.5;
        } else if (p < 0.75) {
          // Back spin
          const t = (p - 0.5) / 0.25;
          rotationState.y = 3 + t * 2;
          rotationState.x = 0.15 - t * 0.25;
          rotationState.zoom = 7.5 + t * 1;
        } else {
          // Return to front
          const t = (p - 0.75) / 0.25;
          rotationState.y = 5 + t * 1.28;
          rotationState.x = -0.1 + t * 0.2;
          rotationState.zoom = 8.5 + t * 1.5;
        }

        phone.rotation.y = rotationState.y;
        phone.rotation.x = rotationState.x;
        camera.position.z = rotationState.zoom;

        // Animate light color based on progress
        const hue = 220 + p * 60;
        rimLight.color.setHSL(hue / 360, 0.8, 0.5);
        rimLight.intensity = 0.8 + Math.sin(p * Math.PI * 2) * 0.3;
      },
    });

    // Render loop
    let animId: number;
    function animate() {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    function onResize() {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      trigger.kill();
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ height: "500vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Labels that fade in/out based on rotation phase */}
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          <div className="text-center">
            <h2
              className="font-display tracking-tight text-white/90"
              style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 700, lineHeight: 1.05 }}
            >
              Titanium Design
            </h2>
            <p
              className="text-[#86868b] mt-4 max-w-lg mx-auto"
              style={{ fontSize: "clamp(16px, 2vw, 21px)" }}
            >
              Forged from aerospace-grade titanium. Incredibly strong. Remarkably light.
            </p>
          </div>
        </div>

        <div ref={mountRef} className="w-full h-full" />
      </div>
    </div>
  );
}
