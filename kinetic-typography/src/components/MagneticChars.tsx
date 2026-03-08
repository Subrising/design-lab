"use client";

import { useEffect, useRef, useCallback } from "react";

interface MagneticCharsProps {
  text: string;
  className?: string;
  radius?: number;
  strength?: number;
}

export default function MagneticChars({
  text,
  className = "",
  radius = 150,
  strength = 40,
}: MagneticCharsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const positionsRef = useRef<{ x: number; y: number }[]>([]);

  const setCharRef = useCallback((el: HTMLSpanElement | null, i: number) => {
    if (el) charsRef.current[i] = el;
  }, []);

  useEffect(() => {
    // Cache initial positions
    const updatePositions = () => {
      positionsRef.current = charsRef.current.map((el) => {
        const rect = el.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      });
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);
    window.addEventListener("scroll", updatePositions);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const animate = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      charsRef.current.forEach((el, i) => {
        const pos = positionsRef.current[i];
        if (!pos) return;

        const dx = mx - pos.x;
        const dy = my - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius) {
          const force = (1 - dist / radius) * strength;
          const angle = Math.atan2(dy, dx);
          const tx = -Math.cos(angle) * force;
          const ty = -Math.sin(angle) * force;
          el.style.transform = `translate(${tx}px, ${ty}px)`;
          el.style.color = `hsl(${260 + force * 3}, 80%, 70%)`;
        } else {
          el.style.transform = "translate(0, 0)";
          el.style.color = "";
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", updatePositions);
      window.removeEventListener("scroll", updatePositions);
    };
  }, [radius, strength]);

  return (
    <div ref={containerRef} className={`flex flex-wrap justify-center ${className}`}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          ref={(el) => setCharRef(el, i)}
          className="inline-block transition-colors duration-200"
          style={{ willChange: "transform" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
