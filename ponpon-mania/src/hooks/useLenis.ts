"use client";

import { useEffect, useRef, useCallback } from "react";
import Lenis from "@studio-freight/lenis";

export interface LenisScrollData {
  scroll: number;
  limit: number;
  velocity: number;
  direction: number;
  progress: number;
}

export function useLenis(onScroll?: (data: LenisScrollData) => void) {
  const lenisRef = useRef<Lenis | null>(null);

  const scrollCallback = useCallback(
    (lenis: Lenis) => {
      onScroll?.({
        scroll: lenis.scroll,
        limit: lenis.limit,
        velocity: lenis.velocity,
        direction: lenis.direction,
        progress: lenis.progress,
      });
    },
    [onScroll]
  );

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", scrollCallback);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [scrollCallback]);

  return lenisRef;
}
