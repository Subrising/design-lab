"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useHorizontalScroll(panelCount: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const panels = gsap.utils.toArray<HTMLElement>(".panel", wrapper);
    if (panels.length === 0) return;

    const scrollWidth = wrapper.scrollWidth - window.innerWidth;

    const tween = gsap.to(wrapper, {
      x: -scrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        end: () => `+=${scrollWidth}`,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [panelCount]);

  return { containerRef, wrapperRef };
}
