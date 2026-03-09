"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";

const MAX_CUBES = 6000;
const CUBE_SIZE = 0.5;
const GROUND_SIZE = 30;
const SPAWN_HEIGHT = 12;
const INITIAL_CUBES = 80;

interface CubeBody {
  body: RAPIER.RigidBody;
  color: THREE.Color;
}

const PALETTE = [
  "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff",
  "#ff922b", "#a66cff", "#ff6b9d", "#38d9a9",
  "#ffa94d", "#74c0fc", "#e599f7", "#69db7c",
  "#f06595", "#20c997", "#fab005", "#845ef7",
];

function randomColor(): THREE.Color {
  return new THREE.Color(PALETTE[Math.floor(Math.random() * PALETTE.length)]);
}

export default function VoxelScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cubeCountRef = useRef(0);
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    world: RAPIER.World;
    mesh: THREE.InstancedMesh;
    bodies: CubeBody[];
    mouse: THREE.Vector2;
    raycaster: THREE.Raycaster;
    groundPlane: THREE.Plane;
    animId: number;
    isDragging: boolean;
    prevMouse: THREE.Vector2;
    cameraAngle: number;
    cameraPitch: number;
    cameraDistance: number;
  } | null>(null);

  const spawnCube = useCallback((x: number, y: number, z: number) => {
    const state = stateRef.current;
    if (!state || state.bodies.length >= MAX_CUBES) return;

    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(x, y, z)
      .setLinvel(
        (Math.random() - 0.5) * 2,
        Math.random() * 2,
        (Math.random() - 0.5) * 2
      )
      .setAngvel({
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 8,
      });
    const body = state.world.createRigidBody(bodyDesc);

    const half = CUBE_SIZE / 2;
    const colliderDesc = RAPIER.ColliderDesc.cuboid(half, half, half)
      .setRestitution(0.3)
      .setFriction(0.6)
      .setDensity(1.0);
    state.world.createCollider(colliderDesc, body);

    const color = randomColor();
    state.bodies.push({ body, color });
    cubeCountRef.current = state.bodies.length;
  }, []);

  const spawnCluster = useCallback((x: number, z: number, count: number) => {
    for (let i = 0; i < count; i++) {
      const ox = (Math.random() - 0.5) * 3;
      const oy = Math.random() * 4;
      const oz = (Math.random() - 0.5) * 3;
      spawnCube(x + ox, SPAWN_HEIGHT + oy, z + oz);
    }
  }, [spawnCube]);

  useEffect(() => {
    if (!containerRef.current) return;

    let disposed = false;

    async function init() {
      await RAPIER.init();
      if (disposed) return;

      const container = containerRef.current!;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);

      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#0a0a0a");
      scene.fog = new THREE.Fog("#0a0a0a", 25, 55);

      // Camera
      const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
      let cameraAngle = -0.3;
      let cameraPitch = 0.45;
      let cameraDistance = 28;

      function updateCamera() {
        camera.position.set(
          Math.sin(cameraAngle) * Math.cos(cameraPitch) * cameraDistance,
          Math.sin(cameraPitch) * cameraDistance,
          Math.cos(cameraAngle) * Math.cos(cameraPitch) * cameraDistance
        );
        camera.lookAt(0, 2, 0);
      }
      updateCamera();

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
      dirLight.position.set(10, 20, 8);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.set(2048, 2048);
      dirLight.shadow.camera.left = -20;
      dirLight.shadow.camera.right = 20;
      dirLight.shadow.camera.top = 20;
      dirLight.shadow.camera.bottom = -20;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 50;
      dirLight.shadow.bias = -0.001;
      scene.add(dirLight);

      const fillLight = new THREE.DirectionalLight(0x8899ff, 0.3);
      fillLight.position.set(-8, 10, -6);
      scene.add(fillLight);

      const rimLight = new THREE.PointLight(0xff6644, 0.5, 40);
      rimLight.position.set(-10, 8, -10);
      scene.add(rimLight);

      // Ground — grid of voxel tiles
      const groundGeo = new THREE.BoxGeometry(GROUND_SIZE, 0.3, GROUND_SIZE);
      const groundMat = new THREE.MeshStandardMaterial({
        color: "#1a1a2e",
        roughness: 0.8,
        metalness: 0.2,
      });
      const groundMesh = new THREE.Mesh(groundGeo, groundMat);
      groundMesh.position.y = -0.15;
      groundMesh.receiveShadow = true;
      scene.add(groundMesh);

      // Grid lines on ground
      const gridHelper = new THREE.GridHelper(GROUND_SIZE, 30, 0x333355, 0x222244);
      gridHelper.position.y = 0.01;
      scene.add(gridHelper);

      // Wall outlines (transparent boundaries)
      const wallHeight = 8;
      const wallPositions = [
        { pos: [0, wallHeight / 2, -GROUND_SIZE / 2], rot: [0, 0, 0], size: [GROUND_SIZE, wallHeight, 0.2] },
        { pos: [0, wallHeight / 2, GROUND_SIZE / 2], rot: [0, 0, 0], size: [GROUND_SIZE, wallHeight, 0.2] },
        { pos: [-GROUND_SIZE / 2, wallHeight / 2, 0], rot: [0, 0, 0], size: [0.2, wallHeight, GROUND_SIZE] },
        { pos: [GROUND_SIZE / 2, wallHeight / 2, 0], rot: [0, 0, 0], size: [0.2, wallHeight, GROUND_SIZE] },
      ];

      // Physics world
      const gravity = new RAPIER.Vector3(0.0, -9.81, 0.0);
      const world = new RAPIER.World(gravity);

      // Ground collider
      const groundColliderDesc = RAPIER.ColliderDesc.cuboid(
        GROUND_SIZE / 2, 0.15, GROUND_SIZE / 2
      ).setTranslation(0, -0.15, 0).setRestitution(0.2).setFriction(0.8);
      world.createCollider(groundColliderDesc);

      // Wall colliders
      for (const w of wallPositions) {
        const wDesc = RAPIER.ColliderDesc.cuboid(
          (w.size[0] as number) / 2,
          (w.size[1] as number) / 2,
          (w.size[2] as number) / 2
        ).setTranslation(
          w.pos[0] as number,
          w.pos[1] as number,
          w.pos[2] as number
        ).setRestitution(0.3).setFriction(0.5);
        world.createCollider(wDesc);
      }

      // Instanced mesh
      const cubeGeo = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
      const cubeMat = new THREE.MeshStandardMaterial({
        roughness: 0.35,
        metalness: 0.15,
      });
      const mesh = new THREE.InstancedMesh(cubeGeo, cubeMat, MAX_CUBES);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.instanceColor = new THREE.InstancedBufferAttribute(
        new Float32Array(MAX_CUBES * 3), 3
      );
      mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.count = 0;
      scene.add(mesh);

      const mouse = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

      const state = {
        renderer,
        scene,
        camera,
        world,
        mesh,
        bodies: [] as CubeBody[],
        mouse,
        raycaster,
        groundPlane,
        animId: 0,
        isDragging: false,
        prevMouse: new THREE.Vector2(),
        cameraAngle,
        cameraPitch,
        cameraDistance,
      };
      stateRef.current = state;

      // Spawn initial cubes
      for (let i = 0; i < INITIAL_CUBES; i++) {
        const x = (Math.random() - 0.5) * 12;
        const y = 2 + Math.random() * 10;
        const z = (Math.random() - 0.5) * 12;
        spawnCube(x, y, z);
      }

      // Mouse handlers
      const onPointerDown = (e: PointerEvent) => {
        if (e.button === 2 || e.button === 1) {
          state.isDragging = true;
          state.prevMouse.set(e.clientX, e.clientY);
          return;
        }

        // Left click — spawn cubes
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersect = new THREE.Vector3();
        raycaster.ray.intersectPlane(groundPlane, intersect);

        if (intersect) {
          const cx = Math.max(-GROUND_SIZE / 2 + 2, Math.min(GROUND_SIZE / 2 - 2, intersect.x));
          const cz = Math.max(-GROUND_SIZE / 2 + 2, Math.min(GROUND_SIZE / 2 - 2, intersect.z));
          spawnCluster(cx, cz, 8 + Math.floor(Math.random() * 8));
        }
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!state.isDragging) return;
        const dx = e.clientX - state.prevMouse.x;
        const dy = e.clientY - state.prevMouse.y;
        state.cameraAngle += dx * 0.005;
        state.cameraPitch = Math.max(0.1, Math.min(1.2, state.cameraPitch + dy * 0.005));
        state.prevMouse.set(e.clientX, e.clientY);
        cameraAngle = state.cameraAngle;
        cameraPitch = state.cameraPitch;
        updateCamera();
      };

      const onPointerUp = () => {
        state.isDragging = false;
      };

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        state.cameraDistance = Math.max(10, Math.min(50, state.cameraDistance + e.deltaY * 0.02));
        cameraDistance = state.cameraDistance;
        updateCamera();
      };

      const onContextMenu = (e: Event) => e.preventDefault();

      const onResize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      renderer.domElement.addEventListener("pointerdown", onPointerDown);
      renderer.domElement.addEventListener("pointermove", onPointerMove);
      renderer.domElement.addEventListener("pointerup", onPointerUp);
      renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
      renderer.domElement.addEventListener("contextmenu", onContextMenu);
      window.addEventListener("resize", onResize);

      // Animation loop
      const dummy = new THREE.Object3D();
      const tempQuat = new THREE.Quaternion();

      function animate() {
        if (disposed) return;
        state.animId = requestAnimationFrame(animate);

        // Step physics
        world.step();

        // Update instanced mesh from physics bodies
        const bodies = state.bodies;
        mesh.count = bodies.length;

        for (let i = 0; i < bodies.length; i++) {
          const { body, color } = bodies[i];
          const pos = body.translation();
          const rot = body.rotation();

          dummy.position.set(pos.x, pos.y, pos.z);
          tempQuat.set(rot.x, rot.y, rot.z, rot.w);
          dummy.quaternion.copy(tempQuat);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
          mesh.setColorAt(i, color);

          // Remove cubes that fell through somehow
          if (pos.y < -10) {
            world.removeRigidBody(body);
            bodies.splice(i, 1);
            i--;
            cubeCountRef.current = bodies.length;
          }
        }

        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

        renderer.render(scene, camera);
      }

      animate();

      // Cleanup
      return () => {
        disposed = true;
        cancelAnimationFrame(state.animId);
        renderer.domElement.removeEventListener("pointerdown", onPointerDown);
        renderer.domElement.removeEventListener("pointermove", onPointerMove);
        renderer.domElement.removeEventListener("pointerup", onPointerUp);
        renderer.domElement.removeEventListener("wheel", onWheel);
        renderer.domElement.removeEventListener("contextmenu", onContextMenu);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }

    let cleanup: (() => void) | undefined;
    init().then((c) => { cleanup = c; });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [spawnCube, spawnCluster]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />

      {/* HUD */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h1 className="text-2xl font-semibold text-white/90 tracking-tight">
          Voxelized Physics
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Three.js + Rapier · Instanced Rendering
        </p>
      </div>

      <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
        <div className="flex flex-col gap-1 text-xs text-white/50 font-mono">
          <span>Left click — spawn cubes</span>
          <span>Right drag — orbit camera</span>
          <span>Scroll — zoom in/out</span>
        </div>
      </div>

      <div className="absolute top-6 right-6 z-10 pointer-events-none">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5">
          <CubeCounter countRef={cubeCountRef} />
        </div>
      </div>
    </div>
  );
}

function CubeCounter({ countRef }: { countRef: React.RefObject<number> }) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let animId: number;
    function update() {
      if (spanRef.current) {
        spanRef.current.textContent = `${countRef.current} / ${MAX_CUBES}`;
      }
      animId = requestAnimationFrame(update);
    }
    update();
    return () => cancelAnimationFrame(animId);
  }, [countRef]);

  return (
    <div className="text-sm text-white/70 font-mono">
      Cubes: <span ref={spanRef}>0 / {MAX_CUBES}</span>
    </div>
  );
}
