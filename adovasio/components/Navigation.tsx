"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Entrance animation
    gsap.fromTo(
      nav,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 2.5, ease: "power3.out" }
    );

    const onScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll.current && current > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScroll.current = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex justify-between items-center transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
      style={{
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        background:
          "linear-gradient(to bottom, rgba(26,26,26,0.8), transparent)",
      }}
    >
      <a
        href="#"
        className="font-serif text-2xl md:text-3xl tracking-[0.15em] text-cream uppercase"
        style={{ fontWeight: 300 }}
      >
        Adovasio
      </a>

      <div className="hidden md:flex items-center gap-10">
        {["Portfolio", "Stories", "About", "Contact"].map((item) => (
          <a
            key={item}
            href="#"
            className="font-sans text-xs tracking-[0.2em] uppercase text-cream/70 hover:text-cream transition-colors duration-500"
            style={{ fontWeight: 300 }}
          >
            {item}
          </a>
        ))}
      </div>

      <button className="md:hidden text-cream" data-cursor-hover>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <line
            x1="3"
            y1="8"
            x2="21"
            y2="8"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="3"
            y1="16"
            x2="21"
            y2="16"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </button>
    </nav>
  );
}
