"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  stagger?: number;
}

export default function SplitText({
  text,
  className = "",
  as: Tag = "h2",
  delay = 0,
  stagger = 0.03,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const chars = ref.current.querySelectorAll(".split-char");

    gsap.from(chars, {
      y: 80,
      opacity: 0,
      rotateX: -90,
      stagger,
      duration: 0.8,
      delay,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  }, [delay, stagger]);

  const words = text.split(" ");

  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement>} className={className} style={{ perspective: "600px" }}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.3em]">
          {word.split("").map((char, ci) => (
            <span
              key={ci}
              className="split-char inline-block"
              style={{ transformOrigin: "bottom", display: "inline-block" }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
