"use client";
import { useEffect, useRef } from "react";

export function useMouse() {
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const target = useRef({ x: 0.5, y: 0.5 });
  const velocity = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      target.current.x = e.clientX / window.innerWidth;
      target.current.y = 1.0 - e.clientY / window.innerHeight;
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        target.current.x = e.touches[0].clientX / window.innerWidth;
        target.current.y = 1.0 - e.touches[0].clientY / window.innerHeight;
      }
    };

    let raf: number;
    const update = () => {
      const lerp = 0.08;
      prevMouse.current.x = mouse.current.x;
      prevMouse.current.y = mouse.current.y;
      mouse.current.x += (target.current.x - mouse.current.x) * lerp;
      mouse.current.y += (target.current.y - mouse.current.y) * lerp;
      velocity.current.x = mouse.current.x - prevMouse.current.x;
      velocity.current.y = mouse.current.y - prevMouse.current.y;
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleTouch, { passive: true });
    raf = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleTouch);
      cancelAnimationFrame(raf);
    };
  }, []);

  return { mouse, velocity };
}
