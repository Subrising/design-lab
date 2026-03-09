"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import Cubie from "./Cubie";
import { generateCubies, type Axis, type LayerIndex } from "@/lib/cubeLogic";

export default function RubiksCube() {
  const groupRef = useRef<THREE.Group>(null);
  const pivotRef = useRef<THREE.Group>(null);
  const cubieRefs = useRef<(THREE.Group | null)[]>([]);
  const [cubies] = useState(() => generateCubies());
  const [isAnimating, setIsAnimating] = useState(false);
  const { camera, gl } = useThree();

  // Drag state
  const dragState = useRef<{
    active: boolean;
    startPoint: THREE.Vector3 | null;
    startNormal: THREE.Vector3 | null;
    startMouse: THREE.Vector2;
    faceAxis: Axis | null;
    faceLayer: LayerIndex | null;
    rotationAxis: Axis | null;
    rotationLayer: LayerIndex | null;
    decided: boolean;
  }>({
    active: false,
    startPoint: null,
    startNormal: null,
    startMouse: new THREE.Vector2(),
    faceAxis: null,
    faceLayer: null,
    rotationAxis: null,
    rotationLayer: null,
    decided: false,
  });

  // Whole-cube rotation for orbit
  const orbitState = useRef({
    active: false,
    startMouse: new THREE.Vector2(),
    startRotation: new THREE.Euler(),
  });

  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  const getCubiesInLayer = useCallback(
    (axis: Axis, layer: LayerIndex): THREE.Group[] => {
      const tolerance = 0.4;
      return cubieRefs.current.filter((c): c is THREE.Group => {
        if (!c) return false;
        const wp = new THREE.Vector3();
        c.getWorldPosition(wp);
        // Transform to group local space
        if (groupRef.current) {
          groupRef.current.worldToLocal(wp);
        }
        return Math.abs(wp[axis] - layer * 1.05) < tolerance;
      });
    },
    []
  );

  const animateLayerRotation = useCallback(
    (axis: Axis, layer: LayerIndex, direction: 1 | -1) => {
      if (isAnimating || !groupRef.current || !pivotRef.current) return;
      setIsAnimating(true);

      const pivot = pivotRef.current;
      const group = groupRef.current;

      // Reset pivot
      pivot.position.set(0, 0, 0);
      pivot.rotation.set(0, 0, 0);

      // Find cubies in this layer
      const layerCubies = getCubiesInLayer(axis, layer);

      // Re-parent cubies to pivot
      layerCubies.forEach((cubie) => {
        pivot.attach(cubie);
      });

      // Animate rotation
      const target = { value: 0 };
      const angle = (Math.PI / 2) * direction;

      gsap.to(target, {
        value: angle,
        duration: 0.4,
        ease: "power2.inOut",
        onUpdate: () => {
          pivot.rotation[axis] = target.value;
        },
        onComplete: () => {
          // Re-parent cubies back to main group
          layerCubies.forEach((cubie) => {
            group.attach(cubie);
          });

          // Reset pivot
          pivot.rotation.set(0, 0, 0);
          setIsAnimating(false);
        },
      });
    },
    [isAnimating, getCubiesInLayer]
  );

  // Pointer down handler
  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (isAnimating) return;

      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);
      const meshes: THREE.Mesh[] = [];
      groupRef.current?.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) meshes.push(child as THREE.Mesh);
      });

      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const point = hit.point.clone();
        const normal = hit.face?.normal.clone() || new THREE.Vector3(0, 0, 1);

        // Transform normal to world space
        const obj = hit.object;
        normal.transformDirection(obj.matrixWorld);

        if (groupRef.current) {
          groupRef.current.worldToLocal(point);
        }

        // Determine which face axis
        const absN = new THREE.Vector3(
          Math.abs(normal.x),
          Math.abs(normal.y),
          Math.abs(normal.z)
        );
        let faceAxis: Axis;
        if (absN.x > absN.y && absN.x > absN.z) faceAxis = "x";
        else if (absN.y > absN.x && absN.y > absN.z) faceAxis = "y";
        else faceAxis = "z";

        // Determine layer
        const val = point[faceAxis];
        let faceLayer: LayerIndex;
        if (val > 0.5) faceLayer = 1;
        else if (val < -0.5) faceLayer = -1;
        else faceLayer = 0;

        dragState.current = {
          active: true,
          startPoint: point,
          startNormal: normal,
          startMouse: mouse,
          faceAxis,
          faceLayer,
          rotationAxis: null,
          rotationLayer: null,
          decided: false,
        };
      } else {
        // Orbit mode — rotate whole cube
        orbitState.current = {
          active: true,
          startMouse: new THREE.Vector2(e.clientX, e.clientY),
          startRotation: groupRef.current?.rotation.clone() || new THREE.Euler(),
        };
      }
    },
    [camera, gl, raycaster, isAnimating]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (dragState.current.active && !dragState.current.decided) {
        const rect = gl.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );

        const delta = mouse.clone().sub(dragState.current.startMouse);
        const threshold = 0.03;

        if (delta.length() > threshold) {
          const { faceAxis, startPoint } = dragState.current;
          if (!faceAxis || !startPoint) return;

          // Determine rotation axis based on drag direction relative to face
          let rotAxis: Axis;
          let rotLayer: LayerIndex;

          if (faceAxis === "z") {
            if (Math.abs(delta.x) > Math.abs(delta.y)) {
              rotAxis = "y";
              const v = startPoint.y;
              rotLayer = v > 0.5 ? 1 : v < -0.5 ? -1 : 0;
            } else {
              rotAxis = "x";
              const v = startPoint.x;
              rotLayer = v > 0.5 ? 1 : v < -0.5 ? -1 : 0;
            }
          } else if (faceAxis === "x") {
            if (Math.abs(delta.y) > Math.abs(delta.x)) {
              rotAxis = "z";
              const v = startPoint.z;
              rotLayer = v > 0.5 ? 1 : v < -0.5 ? -1 : 0;
            } else {
              rotAxis = "y";
              const v = startPoint.y;
              rotLayer = v > 0.5 ? 1 : v < -0.5 ? -1 : 0;
            }
          } else {
            // faceAxis === "y"
            if (Math.abs(delta.x) > Math.abs(delta.y)) {
              rotAxis = "z";
              const v = startPoint.z;
              rotLayer = v > 0.5 ? 1 : v < -0.5 ? -1 : 0;
            } else {
              rotAxis = "x";
              const v = startPoint.x;
              rotLayer = v > 0.5 ? 1 : v < -0.5 ? -1 : 0;
            }
          }

          // Direction based on drag
          const primaryDelta =
            rotAxis === "y"
              ? delta.x
              : rotAxis === "x"
              ? -delta.y
              : delta.x;
          const direction: 1 | -1 = primaryDelta > 0 ? 1 : -1;

          dragState.current.decided = true;
          dragState.current.rotationAxis = rotAxis;
          dragState.current.rotationLayer = rotLayer;

          animateLayerRotation(rotAxis, rotLayer, direction);
        }
      }

      if (orbitState.current.active && groupRef.current) {
        const dx = (e.clientX - orbitState.current.startMouse.x) * 0.005;
        const dy = (e.clientY - orbitState.current.startMouse.y) * 0.005;
        groupRef.current.rotation.y = orbitState.current.startRotation.y + dx;
        groupRef.current.rotation.x = orbitState.current.startRotation.x + dy;
      }
    },
    [gl, animateLayerRotation]
  );

  const handlePointerUp = useCallback(() => {
    dragState.current.active = false;
    dragState.current.decided = false;
    orbitState.current.active = false;
  }, []);

  useEffect(() => {
    const el = gl.domElement;
    el.addEventListener("pointerdown", handlePointerDown);
    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerup", handlePointerUp);
    return () => {
      el.removeEventListener("pointerdown", handlePointerDown);
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerup", handlePointerUp);
    };
  }, [gl, handlePointerDown, handlePointerMove, handlePointerUp]);

  // Gentle idle rotation when not interacting
  useFrame((_, delta) => {
    if (
      groupRef.current &&
      !dragState.current.active &&
      !orbitState.current.active &&
      !isAnimating
    ) {
      groupRef.current.rotation.y += delta * 0.08;
      groupRef.current.rotation.x += delta * 0.03;
    }
  });

  return (
    <>
      <group ref={pivotRef} />
      <group ref={groupRef} rotation={[0.5, 0.7, 0]}>
        {cubies.map((cubie, i) => (
          <Cubie
            key={cubie.id}
            data={cubie}
            ref={(el: THREE.Group | null) => {
              cubieRefs.current[i] = el;
            }}
          />
        ))}
      </group>
    </>
  );
}
