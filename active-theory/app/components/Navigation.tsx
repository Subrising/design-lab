"use client";

import { useState } from "react";

interface NavigationProps {
  scrollProgress: number;
}

export default function Navigation({ scrollProgress }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backdropFilter: scrollProgress > 0.02 ? "blur(12px)" : "none",
          backgroundColor:
            scrollProgress > 0.02
              ? "rgba(10, 10, 10, 0.8)"
              : "transparent",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative">
              <div className="absolute inset-0 border border-accent/60 rotate-45 transition-transform duration-300 hover:rotate-[135deg]" />
              <div className="absolute inset-1 border border-accent/30 rotate-45" />
            </div>
            <span className="text-sm font-bold tracking-[0.2em] uppercase">
              Active Theory
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {["Work", "About", "Lab", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs tracking-[0.15em] uppercase text-muted hover:text-accent transition-colors duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 w-6"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span
              className={`block h-px bg-fg transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-[3.5px]" : ""
              }`}
            />
            <span
              className={`block h-px bg-fg transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px bg-fg transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 transition-all duration-500 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {["Work", "About", "Lab", "Contact"].map((item, i) => (
          <a
            key={item}
            href="#"
            className="text-3xl font-bold tracking-[0.1em] text-fg hover:text-accent transition-colors duration-300"
            style={{
              transitionDelay: menuOpen ? `${i * 100}ms` : "0ms",
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              opacity: menuOpen ? 1 : 0,
            }}
            onClick={() => setMenuOpen(false)}
          >
            {item}
          </a>
        ))}
      </div>
    </>
  );
}
