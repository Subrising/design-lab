"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FooterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const creditRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "top 30%",
          scrub: 1,
        },
      });

      tl.fromTo(
        headingRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        0
      );

      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1 },
        0.2
      );

      tl.fromTo(
        linksRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.4
      );

      tl.fromTo(
        creditRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        0.6
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-panel bg-black">
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8">
        <h2
          ref={headingRef}
          className="text-[clamp(2rem,6vw,5rem)] font-light tracking-[-0.02em] mb-8"
          style={{ color: "var(--color-accent)" }}
        >
          Let&apos;s Create Together
        </h2>

        <div
          ref={lineRef}
          className="reveal-line w-24 mb-10"
          style={{ background: "var(--color-accent)", height: "2px" }}
        />

        <div ref={linksRef} className="flex gap-10 mb-16">
          {["Instagram", "Vimeo", "Behance", "Contact"].map((link) => (
            <span
              key={link}
              className="text-sm tracking-[0.2em] uppercase cursor-pointer transition-colors duration-300 hover:text-[var(--color-accent)]"
              style={{ color: "var(--color-muted)" }}
            >
              {link}
            </span>
          ))}
        </div>

        <div ref={creditRef} className="text-xs tracking-[0.3em] uppercase text-[var(--color-muted)]">
          &copy; 2026 Jason Bergh &mdash; All Rights Reserved
        </div>
      </div>
    </section>
  );
}
