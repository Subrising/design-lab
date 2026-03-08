"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollVelocityTextProps {
  text: string;
  className?: string;
}

export default function ScrollVelocityText({ text, className = "" }: ScrollVelocityTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const proxy = { skew: 0 };
    const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        const skewTarget = clamp(velocity / -200, -15, 15);

        gsap.to(proxy, {
          skew: skewTarget,
          duration: 0.8,
          ease: "power3.out",
          overwrite: true,
          onUpdate: () => {
            if (textRef.current) {
              textRef.current.style.transform = `skewX(${proxy.skew}deg)`;
            }
          },
        });
      },
    });

    // Horizontal scroll animation
    gsap.fromTo(
      textRef.current,
      { x: "20%" },
      {
        x: "-20%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden py-8 ${className}`}>
      <div ref={textRef} className="whitespace-nowrap will-change-transform">
        {text}
      </div>
    </div>
  );
}
