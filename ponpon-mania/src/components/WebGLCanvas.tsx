"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { bgVertex, bgFragment } from "@/shaders/backgroundShader";
import {
  transitionVertex,
  transitionFragment,
} from "@/shaders/sceneTransition";
import { deformVertex, deformFragment } from "@/shaders/mouseDeform";
import { cloudVertex, cloudFragment } from "@/shaders/cloudShader";

interface WebGLCanvasProps {
  scrollProgress: number;
  scrollVelocity: number;
  mouseX: number;
  mouseY: number;
}

interface SceneData {
  scene: THREE.Scene;
  renderTarget: THREE.WebGLRenderTarget;
  meshes: THREE.Mesh[];
}

export default function WebGLCanvas({
  scrollProgress,
  scrollVelocity,
  mouseX,
  mouseY,
}: WebGLCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const scenesRef = useRef<SceneData[]>([]);
  const transitionMeshRef = useRef<THREE.Mesh | null>(null);
  const bgMeshRef = useRef<THREE.Mesh | null>(null);
  const mainSceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const clockRef = useRef(new THREE.Clock());
  const frameRef = useRef<number>(0);

  const createScene = useCallback(
    (
      color1: THREE.Color,
      color2: THREE.Color,
      sceneIndex: number
    ): SceneData => {
      const scene = new THREE.Scene();
      const renderTarget = new THREE.WebGLRenderTarget(
        window.innerWidth,
        window.innerHeight,
        {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
        }
      );
      const meshes: THREE.Mesh[] = [];

      // Deformable shapes for each scene
      const shapeCount = 8 + sceneIndex * 2;
      for (let i = 0; i < shapeCount; i++) {
        const size = 0.15 + Math.random() * 0.4;
        const geo =
          i % 3 === 0
            ? new THREE.CircleGeometry(size, 32)
            : i % 3 === 1
              ? new THREE.PlaneGeometry(size * 1.5, size)
              : new THREE.RingGeometry(size * 0.5, size, 32);

        const mat = new THREE.ShaderMaterial({
          vertexShader: deformVertex,
          fragmentShader: deformFragment,
          transparent: true,
          uniforms: {
            uMouse: { value: new THREE.Vector2(0, 0) },
            uStrength: { value: 0.5 + Math.random() * 0.5 },
            uRadius: { value: 0.8 + Math.random() * 0.7 },
            uTime: { value: 0 },
            uColor1: { value: color1 },
            uColor2: { value: color2 },
            uOpacity: { value: 0.6 + Math.random() * 0.4 },
          },
          side: THREE.DoubleSide,
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
          (Math.random() - 0.5) * 3.5,
          (Math.random() - 0.5) * 2.5,
          Math.random() * 0.5 - 0.25
        );
        mesh.rotation.z = Math.random() * Math.PI;
        scene.add(mesh);
        meshes.push(mesh);
      }

      // Cloud elements
      const cloudCount = 3 + sceneIndex;
      for (let i = 0; i < cloudCount; i++) {
        const w = 0.8 + Math.random() * 1.2;
        const h = 0.3 + Math.random() * 0.5;
        const geo = new THREE.PlaneGeometry(w, h, 32, 16);
        const mat = new THREE.ShaderMaterial({
          vertexShader: cloudVertex,
          fragmentShader: cloudFragment,
          transparent: true,
          uniforms: {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uScrollVelocity: { value: 0 },
            uBaseColor: { value: new THREE.Color(0.95, 0.93, 0.91) },
            uHighlightColor: {
              value: new THREE.Color(
                0.945 + sceneIndex * 0.01,
                0.671,
                0.741
              ),
            },
          },
          side: THREE.DoubleSide,
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
          (Math.random() - 0.5) * 4,
          1.2 + Math.random() * 0.8,
          -0.3 - Math.random() * 0.5
        );
        scene.add(mesh);
        meshes.push(mesh);
      }

      return { scene, renderTarget, meshes };
    },
    []
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xfff5f0, 1);
    rendererRef.current = renderer;

    const aspect = window.innerWidth / window.innerHeight;
    const frustum = 2;
    const camera = new THREE.OrthographicCamera(
      -frustum * aspect,
      frustum * aspect,
      frustum,
      -frustum,
      0.1,
      100
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Main compositing scene
    const mainScene = new THREE.Scene();
    mainSceneRef.current = mainScene;

    // Background shader quad
    const bgGeo = new THREE.PlaneGeometry(
      frustum * aspect * 2,
      frustum * 2
    );
    const bgMat = new THREE.ShaderMaterial({
      vertexShader: bgVertex,
      fragmentShader: bgFragment,
      uniforms: {
        uTime: { value: 0 },
        uScrollProgress: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      },
      depthWrite: false,
    });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.z = -1;
    mainScene.add(bgMesh);
    bgMeshRef.current = bgMesh;

    // Create 4 scenes with different palettes
    const palettes: [THREE.Color, THREE.Color][] = [
      [new THREE.Color(0.945, 0.671, 0.741), new THREE.Color(1.0, 0.96, 0.94)], // Coral → Cream
      [new THREE.Color(0.969, 0.78, 0.016), new THREE.Color(0.945, 0.671, 0.741)], // Gold → Coral
      [new THREE.Color(0.09, 0.09, 0.09), new THREE.Color(0.969, 0.78, 0.016)], // Dark → Gold
      [new THREE.Color(0.945, 0.671, 0.741), new THREE.Color(0.09, 0.09, 0.09)], // Coral → Dark
    ];

    const scenes: SceneData[] = [];
    palettes.forEach(([c1, c2], i) => {
      scenes.push(createScene(c1, c2, i));
    });
    scenesRef.current = scenes;

    // Transition quad (composites two scene render targets)
    const transGeo = new THREE.PlaneGeometry(
      frustum * aspect * 2,
      frustum * 2
    );
    const transMat = new THREE.ShaderMaterial({
      vertexShader: transitionVertex,
      fragmentShader: transitionFragment,
      transparent: true,
      uniforms: {
        uScene1: { value: scenes[0].renderTarget.texture },
        uScene2: { value: scenes[1].renderTarget.texture },
        uProgress: { value: 0 },
        uIntensity: { value: 1.0 },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      },
      depthWrite: false,
    });
    const transMesh = new THREE.Mesh(transGeo, transMat);
    transMesh.position.z = 0;
    mainScene.add(transMesh);
    transitionMeshRef.current = transMesh;

    // Handle resize
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      const newAspect = w / h;
      camera.left = -frustum * newAspect;
      camera.right = frustum * newAspect;
      camera.top = frustum;
      camera.bottom = -frustum;
      camera.updateProjectionMatrix();

      scenes.forEach((s) => s.renderTarget.setSize(w, h));

      if (bgMesh.material instanceof THREE.ShaderMaterial) {
        bgMesh.material.uniforms.uResolution.value.set(w, h);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      scenes.forEach((s) => {
        s.renderTarget.dispose();
        s.meshes.forEach((m) => {
          m.geometry.dispose();
          if (m.material instanceof THREE.ShaderMaterial) m.material.dispose();
        });
      });
    };
  }, [createScene]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      const renderer = rendererRef.current;
      const camera = cameraRef.current;
      const mainScene = mainSceneRef.current;
      const scenes = scenesRef.current;
      const transMesh = transitionMeshRef.current;
      const bgMesh = bgMeshRef.current;

      if (!renderer || !camera || !mainScene || !transMesh || !bgMesh) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const time = clockRef.current.getElapsedTime();

      // Determine which two scenes to blend
      const totalScenes = scenes.length;
      const sceneProgress = scrollProgress * (totalScenes - 1);
      const currentScene = Math.floor(Math.min(sceneProgress, totalScenes - 2));
      const nextScene = Math.min(currentScene + 1, totalScenes - 1);
      const blendFactor = sceneProgress - currentScene;

      // Update all scene meshes
      scenes.forEach((sceneData) => {
        sceneData.meshes.forEach((mesh) => {
          if (mesh.material instanceof THREE.ShaderMaterial) {
            const u = mesh.material.uniforms;
            if (u.uTime) u.uTime.value = time;
            if (u.uMouse)
              u.uMouse.value.set(mouseX, mouseY);
            if (u.uScrollVelocity)
              u.uScrollVelocity.value = scrollVelocity;
          }
        });
      });

      // Render current and next scenes to their render targets
      if (scenes[currentScene]) {
        renderer.setRenderTarget(scenes[currentScene].renderTarget);
        renderer.setClearColor(0x000000, 0);
        renderer.clear();
        renderer.render(scenes[currentScene].scene, camera);
      }
      if (scenes[nextScene]) {
        renderer.setRenderTarget(scenes[nextScene].renderTarget);
        renderer.setClearColor(0x000000, 0);
        renderer.clear();
        renderer.render(scenes[nextScene].scene, camera);
      }

      // Update transition shader
      if (transMesh.material instanceof THREE.ShaderMaterial) {
        const u = transMesh.material.uniforms;
        u.uScene1.value = scenes[currentScene]?.renderTarget.texture;
        u.uScene2.value = scenes[nextScene]?.renderTarget.texture;
        u.uProgress.value = blendFactor;
        u.uIntensity.value = 1.0 + Math.abs(scrollVelocity) * 0.5;
      }

      // Update background
      if (bgMesh.material instanceof THREE.ShaderMaterial) {
        const u = bgMesh.material.uniforms;
        u.uTime.value = time;
        u.uScrollProgress.value = scrollProgress;
        u.uMouse.value.set(mouseX * 0.5 + 0.5, mouseY * 0.5 + 0.5);
      }

      // Render composited main scene
      renderer.setRenderTarget(null);
      renderer.setClearColor(0xfff5f0, 1);
      renderer.clear();
      renderer.render(mainScene, camera);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [scrollProgress, scrollVelocity, mouseX, mouseY]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
