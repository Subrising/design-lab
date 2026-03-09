"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ScrollCameraProps {
  scrollProgress: React.MutableRefObject<number>;
}

export default function ScrollCamera({ scrollProgress }: ScrollCameraProps) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 0, 20));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Define camera path as a CatmullRom spline
  const cameraPath = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2, 20),
      new THREE.Vector3(-3, 4, 14),
      new THREE.Vector3(2, 1, 8),
      new THREE.Vector3(-1, 6, 2),
      new THREE.Vector3(3, 3, -4),
      new THREE.Vector3(0, 8, -10),
      new THREE.Vector3(-2, 2, -16),
      new THREE.Vector3(0, 5, -22),
    ]);
    curve.curveType = "catmullrom";
    curve.tension = 0.3;
    return curve;
  }, []);

  const lookAtPath = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2, 10),
      new THREE.Vector3(-1, 3, 6),
      new THREE.Vector3(1, 2, 0),
      new THREE.Vector3(0, 5, -4),
      new THREE.Vector3(2, 3, -10),
      new THREE.Vector3(0, 6, -16),
      new THREE.Vector3(-1, 3, -22),
      new THREE.Vector3(0, 4, -28),
    ]);
    curve.curveType = "catmullrom";
    curve.tension = 0.3;
    return curve;
  }, []);

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 55;
      camera.near = 0.1;
      camera.far = 100;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  useFrame((_, delta) => {
    const t = Math.max(0, Math.min(1, scrollProgress.current));
    const targetPos = cameraPath.getPoint(t);
    const targetLookAt = lookAtPath.getPoint(t);

    // Smooth lerp for cinematic feel
    const lerpFactor = 1.0 - Math.pow(0.001, delta);
    currentPos.current.lerp(targetPos, lerpFactor);
    currentLookAt.current.lerp(targetLookAt, lerpFactor);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
