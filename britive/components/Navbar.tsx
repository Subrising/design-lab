"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Entrance animation
    gsap.fromTo(
      nav,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
    );

    // Hide/show on scroll
    let lastScroll = 0;
    const onScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll && current > 100) {
        gsap.to(nav, { y: -100, duration: 0.4, ease: "power2.in" });
      } else {
        gsap.to(nav, { y: 0, duration: 0.4, ease: "power2.out" });
      }
      // Background blur on scroll
      if (current > 50) {
        nav.style.backdropFilter = "blur(20px)";
        nav.style.backgroundColor = "rgba(10,10,10,0.8)";
      } else {
        nav.style.backdropFilter = "blur(0px)";
        nav.style.backgroundColor = "transparent";
      }
      lastScroll = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 flex items-center justify-between transition-colors"
      style={{ opacity: 0 }}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#6366f1] flex items-center justify-center">
          <span className="text-white font-bold text-sm">B</span>
        </div>
        <span className="text-lg font-bold tracking-tight">britive</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm text-[#71717a]">
        <a href="#features" className="hover:text-white transition-colors">
          Features
        </a>
        <a href="#showcase" className="hover:text-white transition-colors">
          Showcase
        </a>
        <a href="#stats" className="hover:text-white transition-colors">
          Impact
        </a>
        <a href="#cta" className="hover:text-white transition-colors">
          Contact
        </a>
      </div>
      <button className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-medium hover:bg-[#e4e4e7] transition-colors">
        Get Started
      </button>
    </nav>
  );
}
