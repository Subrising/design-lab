"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 3.5, ease: "power3.out" }
    );
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-6 opacity-0"
    >
      <div className="flex items-center gap-8">
        <span className="text-pearl/50 text-xs tracking-[0.3em] uppercase font-sans cursor-pointer hover:text-gold transition-colors duration-500">
          Collections
        </span>
        <span className="text-pearl/50 text-xs tracking-[0.3em] uppercase font-sans cursor-pointer hover:text-gold transition-colors duration-500">
          Maison
        </span>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <h2 className="font-display text-xl md:text-2xl text-pearl tracking-[0.2em]">
          CARTIER
        </h2>
      </div>

      <div className="flex items-center gap-8">
        <span className="text-pearl/50 text-xs tracking-[0.3em] uppercase font-sans cursor-pointer hover:text-gold transition-colors duration-500">
          Boutiques
        </span>
        <span className="text-pearl/50 text-xs tracking-[0.3em] uppercase font-sans cursor-pointer hover:text-gold transition-colors duration-500">
          Contact
        </span>
      </div>
    </nav>
  );
}
