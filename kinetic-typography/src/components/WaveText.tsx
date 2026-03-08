"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface WaveTextProps {
  text: string;
  className?: string;
}

export default function WaveText({ text, className = "" }: WaveTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chars = containerRef.current.querySelectorAll(".wave-char");

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      end: "bottom 20%",
      onUpdate: (self) => {
        const progress = self.progress;
        chars.forEach((char, i) => {
          const offset = Math.sin(progress * Math.PI * 4 + i * 0.3) * 30;
          const rotate = Math.sin(progress * Math.PI * 3 + i * 0.2) * 15;
          const scale = 1 + Math.sin(progress * Math.PI * 2 + i * 0.4) * 0.1;
          gsap.set(char, {
            y: offset,
            rotation: rotate,
            scale,
          });
        });
      },
    });

    // Initial entrance
    gsap.from(chars, {
      opacity: 0,
      y: 60,
      rotateZ: gsap.utils.wrap([-20, 20, -15, 25, -10]),
      stagger: 0.03,
      duration: 0.8,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className={`flex flex-wrap justify-center ${className}`}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="wave-char inline-block will-change-transform"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
