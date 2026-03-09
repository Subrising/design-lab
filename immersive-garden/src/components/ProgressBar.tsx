"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!barRef.current) return;

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      onUpdate: (self) => {
        if (barRef.current) {
          barRef.current.style.transform = `scaleY(${self.progress})`;
        }
        dotRefs.current.forEach((dot, i) => {
          if (!dot) return;
          const threshold = (i + 1) / 5;
          dot.style.opacity = self.progress >= threshold - 0.05 ? "1" : "0.2";
          dot.style.transform =
            self.progress >= threshold - 0.05 ? "scale(1.5)" : "scale(1)";
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-0">
      {/* Track */}
      <div className="relative w-px h-40">
        <div className="absolute inset-0 bg-white/10" />
        <div
          ref={barRef}
          className="absolute top-0 left-0 w-full bg-white/60 origin-top"
          style={{ transform: "scaleY(0)" }}
        />
      </div>

      {/* Section dots */}
      <div className="flex flex-col gap-6 mt-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            ref={(el) => { dotRefs.current[i] = el; }}
            className="w-1.5 h-1.5 rounded-full bg-white/20 transition-all duration-300"
          />
        ))}
      </div>
    </div>
  );
}
