"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const menuItems = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
    );
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-8 py-6 mix-blend-difference"
    >
      <a href="#" className="text-lg font-medium tracking-tight text-white" data-magnetic>
        Dennis Snellenberg ©
      </a>

      <nav ref={menuItems} className="hidden items-center gap-8 md:flex">
        {["Work", "About", "Contact"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="hover-line text-sm text-white/70 transition-colors hover:text-white"
            data-magnetic
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}
