"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Hide nav on scroll down, show on scroll up
    let lastScroll = 0;
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll && current > 100) {
        gsap.to(nav, { yPercent: -100, duration: 0.3, ease: "power2.in" });
      } else {
        gsap.to(nav, { yPercent: 0, duration: 0.3, ease: "power2.out" });
      }
      lastScroll = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;

    if (isOpen) {
      gsap.to(menuRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.6,
        ease: "power3.inOut",
      });
      const items = menuRef.current.querySelectorAll(".menu-item");
      gsap.fromTo(
        items,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, delay: 0.3, duration: 0.6, ease: "power3.out" }
      );
    } else {
      gsap.to(menuRef.current, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.4,
        ease: "power3.in",
      });
    }
  }, [isOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 mix-blend-difference"
      >
        <a href="#" className="text-white text-xl font-sans font-bold tracking-tight">
          EPIC<span style={{ color: "var(--color-epic-red)" }}>.</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {["Work", "About", "Services", "Journal"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-white text-xs uppercase tracking-[0.2em] hover:opacity-50 transition-opacity"
            >
              {item}
            </a>
          ))}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-8 h-5 flex flex-col justify-between cursor-pointer z-50"
          aria-label="Toggle menu"
        >
          <span
            className="w-full h-[1px] bg-white transition-transform duration-300 origin-center"
            style={{
              transform: isOpen ? "translateY(9px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="w-full h-[1px] bg-white transition-opacity duration-300"
            style={{ opacity: isOpen ? 0 : 1 }}
          />
          <span
            className="w-full h-[1px] bg-white transition-transform duration-300 origin-center"
            style={{
              transform: isOpen ? "translateY(-9px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Fullscreen menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{
          background: "var(--color-epic-black)",
          clipPath: "inset(0% 0% 100% 0%)",
        }}
      >
        <div className="text-center">
          {["Work", "About", "Services", "Journal", "Contact"].map(
            (item, i) => (
              <div key={item} className="menu-item overflow-hidden mb-4">
                <a
                  href="#"
                  className="block font-sans font-bold text-5xl md:text-7xl lg:text-8xl tracking-tighter hover:opacity-50 transition-opacity"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
                <span className="text-xs opacity-30 uppercase tracking-[0.3em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            )
          )}
        </div>

        <div className="absolute bottom-8 left-8 right-8 flex justify-between text-xs opacity-30">
          <span>hello@epic.studio</span>
          <span>© 2025</span>
        </div>
      </div>
    </>
  );
}
