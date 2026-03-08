"use client";

import { useRef, useCallback, useEffect } from "react";

const navItems = ["Work", "About", "Services", "Contact"];

export default function MagneticNav() {
  const navRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const links = navRef.current?.querySelectorAll<HTMLAnchorElement>(".nav-link");
    if (!links) return;

    links.forEach((link) => {
      const rect = link.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        const pull = (1 - dist / 100) * 0.3;
        link.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
        link.style.color = "rgba(99, 102, 241, 1)";
      } else {
        link.style.transform = "";
        link.style.color = "";
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const links = navRef.current?.querySelectorAll<HTMLAnchorElement>(".nav-link");
    links?.forEach((link) => {
      link.style.transform = "";
      link.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), color 0.3s ease";
      link.style.color = "";
    });
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6"
      onMouseLeave={handleMouseLeave}
    >
      <div className="text-xl font-bold tracking-tight text-white/80">
        Magnetic<span className="text-indigo-400">.</span>
      </div>
      <div className="flex gap-8">
        {navItems.map((item) => (
          <a
            key={item}
            href="#"
            className="nav-link text-sm uppercase tracking-widest text-white/50 transition-colors hover:text-white"
            data-magnetic
          >
            {item}
          </a>
        ))}
      </div>
    </nav>
  );
}
