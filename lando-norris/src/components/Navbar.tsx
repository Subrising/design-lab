"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 1.5, ease: "power3.out" }
      );

      // Background change on scroll
      ScrollTrigger.create({
        start: "top -100",
        onUpdate: (self) => {
          setScrolled(self.progress > 0);
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-carbon/80 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="text-2xl font-bold"
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            <span className="text-papaya">LN</span>
            <span className="text-white/60">4</span>
          </div>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {["About", "Career", "Speed", "Moments"].map((item) => (
            <span
              key={item}
              className="text-xs tracking-[0.3em] uppercase text-smoke-dark hover:text-papaya transition-colors duration-300 cursor-pointer"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Racing number */}
        <div
          className="text-papaya/40"
          style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "24px",
          }}
        >
          #4
        </div>
      </div>
    </nav>
  );
}
