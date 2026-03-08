"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface GravityDropProps {
  text: string;
  className?: string;
}

export default function GravityDrop({ text, className = "" }: GravityDropProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chars = containerRef.current.querySelectorAll(".char");

    gsap.set(chars, { y: -200, opacity: 0, rotateX: -90 });
    gsap.to(chars, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 1.2,
      ease: "bounce.out",
      stagger: { each: 0.04, from: "center" },
      delay: 0.3,
    });
  }, []);

  return (
    <div ref={containerRef} className={`flex flex-wrap justify-center ${className}`}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="char inline-block"
          style={{ perspective: "600px" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
