"use client";

import { useEffect, useRef } from "react";

export interface MouseData {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMouse() {
  const mouse = useRef<MouseData>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const smoothMouse = useRef<MouseData>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = {
        x: e.clientX,
        y: e.clientY,
        normalizedX: (e.clientX / window.innerWidth) * 2 - 1,
        normalizedY: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Smooth interpolation loop
    let frame: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function animate() {
      smoothMouse.current = {
        x: lerp(smoothMouse.current.x, mouse.current.x, 0.08),
        y: lerp(smoothMouse.current.y, mouse.current.y, 0.08),
        normalizedX: lerp(
          smoothMouse.current.normalizedX,
          mouse.current.normalizedX,
          0.08
        ),
        normalizedY: lerp(
          smoothMouse.current.normalizedY,
          mouse.current.normalizedY,
          0.08
        ),
      };
      frame = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return { mouse, smoothMouse };
}
