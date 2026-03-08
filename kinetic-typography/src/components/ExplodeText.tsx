"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface ExplodeTextProps {
  text: string;
  className?: string;
}

export default function ExplodeText({ text, className = "" }: ExplodeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [exploded, setExploded] = useState(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chars = containerRef.current.querySelectorAll(".explode-char");

    // Entrance animation
    gsap.from(chars, {
      opacity: 0,
      scale: 0,
      duration: 0.6,
      stagger: 0.02,
      ease: "back.out(1.5)",
      delay: 0.2,
    });
  }, []);

  const handleClick = () => {
    if (!containerRef.current) return;
    const chars = containerRef.current.querySelectorAll(".explode-char");

    if (tlRef.current) tlRef.current.kill();

    const tl = gsap.timeline();
    tlRef.current = tl;

    if (!exploded) {
      // Explode outward
      tl.to(chars, {
        x: () => gsap.utils.random(-300, 300),
        y: () => gsap.utils.random(-300, 300),
        rotation: () => gsap.utils.random(-360, 360),
        scale: () => gsap.utils.random(0.5, 2),
        opacity: 0.6,
        duration: 0.8,
        ease: "power4.out",
        stagger: { each: 0.01, from: "center" },
      });
    } else {
      // Reform with spring
      tl.to(chars, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "elastic.out(1, 0.4)",
        stagger: { each: 0.02, from: "edges" },
      });
    }

    setExploded(!exploded);
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-wrap justify-center cursor-pointer select-none ${className}`}
      onClick={handleClick}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="explode-char inline-block will-change-transform"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
