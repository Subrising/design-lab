"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current || !footerRef.current) return;

    gsap.fromTo(
      titleRef.current,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 70%",
        },
      }
    );
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative min-h-screen flex flex-col justify-between px-4 md:px-8 py-16"
      style={{ background: "var(--color-epic-cream)", color: "var(--color-epic-black)" }}
    >
      <div className="max-w-[1800px] mx-auto w-full">
        {/* CTA */}
        <div className="pt-20 md:pt-32">
          <p className="text-xs uppercase tracking-[0.4em] opacity-40 mb-8">
            Next Project
          </p>
          <h2
            ref={titleRef}
            className="font-sans font-bold tracking-tighter leading-none cursor-pointer group"
            style={{ fontSize: "clamp(3rem, 12vw, 14rem)" }}
          >
            LET&apos;S{" "}
            <span
              className="italic"
              style={{ color: "var(--color-epic-red)" }}
            >
              TALK
            </span>
            <span className="inline-block transition-transform group-hover:translate-x-4">
              .
            </span>
          </h2>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1800px] mx-auto w-full mt-auto">
        <div className="h-[1px] w-full bg-current opacity-10 mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col md:flex-row gap-8">
            <a href="#" className="text-xs uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity">
              Instagram
            </a>
            <a href="#" className="text-xs uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity">
              LinkedIn
            </a>
            <a href="#" className="text-xs uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity">
              Behance
            </a>
            <a href="#" className="text-xs uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity">
              Dribbble
            </a>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <span className="text-xs opacity-40">hello@epic.studio</span>
            <span className="text-xs opacity-40">
              © 2025 EPIC. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
