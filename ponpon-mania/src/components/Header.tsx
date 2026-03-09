"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Entrance animation
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.children,
        { y: -30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    }

    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full px-8 py-6 flex items-center justify-between transition-transform duration-500"
      style={{
        zIndex: 50,
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        mixBlendMode: "difference",
      }}
    >
      <div
        className="text-lg font-bold tracking-wider text-white uppercase"
        style={{ fontFamily: "'Libre Franklin', sans-serif" }}
      >
        Ponpon Mania
      </div>

      <nav className="hidden md:flex items-center gap-8">
        {["Chapters", "About", "Credits"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-white text-sm tracking-widest uppercase hover:opacity-60 transition-opacity duration-300"
            style={{ fontFamily: "'Libre Franklin', sans-serif" }}
          >
            {item}
          </a>
        ))}
      </nav>

      <div className="text-white text-xs tracking-widest uppercase opacity-60">
        EN / FR
      </div>
    </header>
  );
}
