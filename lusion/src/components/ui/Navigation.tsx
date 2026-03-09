"use client";
import { useState } from "react";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference">
      <div className="flex items-center justify-between px-8 py-6">
        <a href="#" className="text-white text-xl font-light tracking-[0.3em] uppercase">
          Lusion
        </a>

        <div className="hidden md:flex items-center gap-12">
          {["Work", "About", "Labs", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link text-white" data-cursor-hover>
              {item}
            </a>
          ))}
        </div>

        <button
          className="md:hidden text-white z-50"
          onClick={() => setMenuOpen(!menuOpen)}
          data-cursor-hover
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5">
            <span className={`block w-6 h-px bg-white transition-transform ${menuOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
            <span className={`block w-6 h-px bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-px bg-white transition-transform ${menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center md:hidden">
          <div className="flex flex-col items-center gap-8">
            {["Work", "About", "Labs", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-4xl font-light tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
