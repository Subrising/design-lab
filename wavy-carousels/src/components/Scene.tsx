"use client";

import { useRef, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import Carousel from "./Carousel";

export default function Scene() {
  const scrollSpeed = useRef(0);
  const targetSpeed = useRef(0);
  const isDragging = useRef(false);
  const lastY = useRef(0);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    targetSpeed.current += e.deltaY * 0.5;
  }, []);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    isDragging.current = true;
    lastY.current = e.clientY;
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientY - lastY.current;
    targetSpeed.current += delta * 2;
    lastY.current = e.clientY;
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    let raf: number;
    const tick = () => {
      scrollSpeed.current += (targetSpeed.current - scrollSpeed.current) * 0.1;
      targetSpeed.current *= 0.9;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      cancelAnimationFrame(raf);
    };
  }, [handleWheel, handlePointerDown, handlePointerMove, handlePointerUp]);

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "fixed", inset: 0 }}
    >
      <color attach="background" args={["#0a0a0a"]} />

      {/* Center column — scrolls down */}
      <Carousel
        xOffset={0}
        imageSize={[2, 3]}
        gap={0.4}
        curveStrength={1.2}
        curveFrequency={0.2}
        wheelFactor={1}
        wheelDirection={1}
        scrollSpeed={scrollSpeed}
      />

      {/* Left column — scrolls up, curves left */}
      <Carousel
        xOffset={-3}
        imageSize={[1.8, 2.7]}
        gap={0.35}
        curveStrength={-1.5}
        curveFrequency={0.22}
        wheelFactor={0.8}
        wheelDirection={-1}
        scrollSpeed={scrollSpeed}
      />

      {/* Right column — scrolls up, curves right */}
      <Carousel
        xOffset={3}
        imageSize={[1.8, 2.7]}
        gap={0.35}
        curveStrength={1.5}
        curveFrequency={0.22}
        wheelFactor={0.8}
        wheelDirection={-1}
        scrollSpeed={scrollSpeed}
      />
    </Canvas>
  );
}
