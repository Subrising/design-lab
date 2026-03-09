"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCursor } from "./CursorContext";

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  animation?: "chars" | "words" | "lines" | "wave";
  delay?: number;
  stagger?: number;
  scrollTrigger?: boolean;
  cursorHover?: boolean;
}

export default function SplitText({
  text,
  className = "",
  as: Tag = "div",
  animation = "chars",
  delay = 0,
  stagger = 0.03,
  scrollTrigger = false,
  cursorHover = false,
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { onEnter, onLeave } = useCursor();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = container.querySelectorAll(".char");
    const words = container.querySelectorAll(".word");

    const targets = animation === "words" || animation === "lines" ? words : chars;

    const tl = gsap.timeline({
      delay,
      ...(scrollTrigger
        ? {
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        : {}),
    });

    if (animation === "chars") {
      gsap.set(targets, { opacity: 0, y: 80, rotateX: -90 });
      tl.to(targets, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger,
        ease: "power4.out",
      });
    } else if (animation === "wave") {
      gsap.set(targets, { opacity: 0, y: 120, scale: 0.8 });
      tl.to(targets, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: {
          each: stagger,
          from: "start",
        },
        ease: "elastic.out(1, 0.5)",
      });
    } else if (animation === "words") {
      gsap.set(targets, { opacity: 0, y: "100%" });
      tl.to(targets, {
        opacity: 1,
        y: "0%",
        duration: 0.8,
        stagger: stagger * 3,
        ease: "power4.out",
      });
    } else if (animation === "lines") {
      gsap.set(targets, { opacity: 0, x: -60 });
      tl.to(targets, {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: stagger * 5,
        ease: "power3.out",
      });
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) st.kill();
      });
    };
  }, [text, animation, delay, stagger, scrollTrigger]);

  const splitWords = text.split(" ");

  return (
    <Tag
      ref={containerRef as React.Ref<HTMLHeadingElement & HTMLParagraphElement & HTMLDivElement & HTMLSpanElement>}
      className={`${className} overflow-hidden`}
      onMouseEnter={cursorHover ? () => onEnter("text") : undefined}
      onMouseLeave={cursorHover ? onLeave : undefined}
    >
      {splitWords.map((word, wi) => (
        <span key={wi} className="word mr-[0.25em] inline-block overflow-hidden">
          {word.split("").map((char, ci) => (
            <span
              key={ci}
              className="char inline-block"
              style={{ perspective: "1000px" }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
