"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Counter animation
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.max(1, Math.floor(Math.random() * 15));
        return Math.min(100, prev + increment);
      });
    }, 60);

    // Exit animation after counting
    const timer = setTimeout(() => {
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
          onComplete,
        });
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[var(--color-bg)]"
    >
      <div className="flex flex-col items-center gap-4">
        <span
          ref={counterRef}
          className="text-[clamp(4rem,15vw,12rem)] font-bold tabular-nums tracking-tighter text-white/10"
        >
          {count}
        </span>
        <div className="h-[1px] w-32 overflow-hidden bg-white/10">
          <div
            className="h-full bg-white transition-all duration-100 ease-out"
            style={{ width: `${count}%` }}
          />
        </div>
      </div>
    </div>
  );
}
