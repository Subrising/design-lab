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
      // velocity and direction exist at runtime but aren't in the type defs
      const l = lenis as unknown as Record<string, number>;
      onScroll?.({
        scroll: lenis.scroll,
        limit: lenis.limit,
        velocity: l.velocity ?? 0,
        direction: l.direction ?? 1,
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
