"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  cursorRippleVertex,
  cursorRippleFragment,
} from "@/shaders/cursor-ripple";

export default function CursorShaderPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const intensity = useRef(0);
  const prevMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uIntensity: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    const target = new THREE.Vector2(
      (state.pointer.x + 1) / 2,
      (state.pointer.y + 1) / 2
    );
    mouse.current.lerp(target, 0.08);

    const velocity = mouse.current.distanceTo(prevMouse.current);
    intensity.current = THREE.MathUtils.lerp(
      intensity.current,
      Math.min(velocity * 50, 1),
      0.1
    );
    prevMouse.current.copy(mouse.current);

    materialRef.current.uniforms.uMouse.value.copy(mouse.current);
    materialRef.current.uniforms.uIntensity.value = intensity.current;
  });

  return (
    <mesh position={[0, 0, -10]}>
      <planeGeometry args={[viewport.width * 3, viewport.height * 3]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={cursorRippleVertex}
        fragmentShader={cursorRippleFragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}
