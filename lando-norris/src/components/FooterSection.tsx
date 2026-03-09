"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FooterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        nameRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      if (linksRef.current) {
        gsap.fromTo(
          linksRef.current.children,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="relative min-h-[60vh] flex flex-col items-center justify-center py-24 px-4 border-t border-white/5"
    >
      {/* CTA / closing */}
      <div ref={nameRef} className="text-center mb-16">
        <p className="text-sm tracking-[0.5em] uppercase text-smoke-dark mb-4">
          Follow the journey
        </p>
        <div
          style={{
            fontSize: "clamp(48px, 10vw, 160px)",
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            lineHeight: 0.9,
            background: "linear-gradient(135deg, #FFFFFF, #FF8000)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          LN4
        </div>
      </div>

      {/* Social links */}
      <div ref={linksRef} className="flex gap-8 mb-16">
        {["Instagram", "Twitter / X", "YouTube", "TikTok"].map((social) => (
          <span
            key={social}
            className="text-smoke-dark hover:text-papaya transition-colors duration-300 text-sm tracking-[0.2em] uppercase cursor-pointer"
          >
            {social}
          </span>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="w-full max-w-6xl flex justify-between items-center text-xs text-white/20">
        <span>Design Experiment — GSAP + Next.js</span>
        <span>Not affiliated with Lando Norris or McLaren Racing</span>
      </div>

      {/* Bottom racing stripe */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-papaya to-transparent" />
    </footer>
  );
}
