"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-content > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative min-h-[50vh] flex items-end pb-12 px-8 md:px-16"
      style={{ zIndex: 1 }}
    >
      <div className="footer-content w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <div>
          <h3
            className="text-4xl md:text-6xl font-bold text-[#171717] mb-4"
            style={{ fontFamily: "'Libre Franklin', sans-serif" }}
          >
            Fin.
          </h3>
          <p className="text-[#171717]/50 text-sm max-w-xs">
            A replica of ponpon-mania.com — showcasing WebGL scene transitions,
            Lenis smooth scroll, and custom GLSL shaders.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 text-right">
          <p className="text-[#171717]/40 text-xs tracking-widest uppercase">
            Original by Justine Soulie & Patrick Heng
          </p>
          <p className="text-[#171717]/40 text-xs tracking-widest uppercase">
            Replica built with Next.js + Three.js + GSAP
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="w-2 h-2 rounded-full bg-[#f1abbd]" />
            <div className="w-2 h-2 rounded-full bg-[#f7c704]" />
            <div className="w-2 h-2 rounded-full bg-[#171717]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
