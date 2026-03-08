"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StrokeRevealProps {
  text: string;
  className?: string;
}

export default function StrokeReveal({ text, className = "" }: StrokeRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const textEl = svgRef.current.querySelector("text");
    if (!textEl) return;

    // Set stroke dash
    const length = 3000;
    gsap.set(textEl, {
      strokeDasharray: length,
      strokeDashoffset: length,
      fill: "transparent",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        end: "bottom 30%",
        scrub: 1,
      },
    });

    tl.to(textEl, {
      strokeDashoffset: 0,
      duration: 1,
      ease: "none",
    }).to(
      textEl,
      {
        fill: "rgba(255,255,255,0.9)",
        duration: 0.5,
      },
      0.6
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <svg
        ref={svgRef}
        viewBox="0 0 900 120"
        className="w-full max-w-4xl mx-auto"
      >
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fontSize="90"
          fontWeight="900"
          fontFamily="system-ui, sans-serif"
          fill="transparent"
          stroke="white"
          strokeWidth="1.5"
        >
          {text}
        </text>
      </svg>
    </div>
  );
}
