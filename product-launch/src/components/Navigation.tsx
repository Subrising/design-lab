"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Fade in on load
    gsap.from(nav, { y: -20, opacity: 0, duration: 1, delay: 0.5, ease: "power3.out" });

    // Hide on scroll down, show on scroll up
    let lastScroll = 0;
    ScrollTrigger.create({
      onUpdate: (self) => {
        const direction = self.direction;
        if (direction === 1 && self.scroll() > 100) {
          gsap.to(nav, { y: -100, duration: 0.3, ease: "power2.in" });
        } else {
          gsap.to(nav, { y: 0, duration: 0.3, ease: "power2.out" });
        }
        lastScroll = self.scroll();
      },
    });
  }, []);

  return (
    <nav ref={navRef} className="top-nav">
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Studio</span>
      </div>
      <div style={{ display: "flex", gap: "2rem", fontSize: "0.875rem", fontWeight: 500 }}>
        <span style={{ cursor: "pointer", opacity: 0.7 }}>Overview</span>
        <span style={{ cursor: "pointer", opacity: 0.7 }}>Features</span>
        <span style={{ cursor: "pointer", opacity: 0.7 }}>Specs</span>
        <a href="#buy" className="cta-button" style={{ padding: "0.5rem 1.5rem", fontSize: "0.875rem" }}>
          Pre-order
        </a>
      </div>
    </nav>
  );
}
