"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setVisible(false),
    });

    tl.to(progressRef.current, {
      width: "100%",
      duration: 2,
      ease: "power2.inOut",
    })
      .to(textRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.6,
        ease: "power3.in",
      })
      .to(overlayRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut",
      });
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-obsidian"
    >
      <div ref={textRef} className="text-center">
        <p className="text-gold/60 text-xs tracking-[0.4em] uppercase mb-6 font-sans">
          Watches & Wonders
        </p>
        <h1 className="font-display text-5xl md:text-7xl text-pearl tracking-wide">
          CARTIER
        </h1>
        <div className="mt-8 w-48 h-px bg-smoke mx-auto overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-gold"
            style={{ width: 0 }}
          />
        </div>
      </div>
    </div>
  );
}
