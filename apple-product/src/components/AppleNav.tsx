"use client";

import { useEffect, useRef, useState } from "react";

const navLinks = [
  "iPhone 16 Pro",
  "iPhone 16",
  "iPhone 15",
  "iPhone SE",
  "Compare",
  "AirPods",
  "Accessories",
];

export default function AppleNav() {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top global nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(0, 0, 0, 0.8)"
            : "rgba(0, 0, 0, 0.92)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
        }}
      >
        <div className="max-w-[1024px] mx-auto h-11 flex items-center justify-between px-4 md:px-6">
          {/* Apple logo */}
          <a className="text-[#d1d1d6] hover:text-white transition-colors cursor-pointer">
            <svg width="14" height="18" viewBox="0 0 14 18" fill="currentColor">
              <path d="M13.1 12.7c-.3.7-.7 1.3-1.1 1.9-.6.8-1.1 1.4-1.5 1.7-.6.5-1.2.8-1.9.8-.5 0-1-.1-1.6-.4-.6-.3-1.1-.4-1.6-.4s-1.1.1-1.6.4c-.6.3-1 .4-1.4.4-.7 0-1.3-.3-1.9-.8C.1 15.9-.3 15.3-.6 14.5-1 13.6-1.2 12.7-1.2 11.7c0-1.1.3-2 .8-2.8.4-.6.9-1.1 1.6-1.5.6-.4 1.3-.6 2-.6.5 0 1.2.2 2 .5.8.3 1.3.5 1.5.5.2 0 .7-.2 1.7-.5.9-.4 1.6-.5 2.2-.4 1.6.1 2.8.8 3.6 2-1.4.9-2.1 2.1-2.1 3.6 0 1.2.4 2.2 1.3 3 .4.4.8.7 1.3.9-.1.3-.2.6-.3.9zM9.9.3c0 .9-.3 1.8-1 2.6-.8 1-1.8 1.5-2.9 1.4 0-.1 0-.2 0-.4 0-.9.4-1.8 1-2.5.3-.4.8-.7 1.3-1 .5-.3 1-.4 1.5-.4 0 .1 0 .2 0 .3z"
                transform="translate(1.2, 1)" />
            </svg>
          </a>

          {/* Nav links - hidden on mobile */}
          <div className="hidden md:flex items-center gap-7">
            {["Store", "Mac", "iPad", "iPhone", "Watch", "AirPods"].map((item) => (
              <a
                key={item}
                className="text-[#d1d1d6] hover:text-white text-xs font-normal transition-colors cursor-pointer"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-[#d1d1d6] hover:text-white transition-colors cursor-pointer">
              <circle cx="6" cy="6" r="5.25" stroke="currentColor" strokeWidth="1.5" />
              <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <svg width="13" height="15" viewBox="0 0 13 15" fill="none" className="text-[#d1d1d6] hover:text-white transition-colors cursor-pointer">
              <path d="M3.5 4V3.5C3.5 1.84 4.84.5 6.5.5S9.5 1.84 9.5 3.5V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="0.75" y="4" width="11.5" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </nav>

      {/* Sub-nav for iPhone */}
      <nav
        ref={navRef}
        className="fixed top-11 left-0 right-0 z-40 transition-all duration-300"
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div className="max-w-[1024px] mx-auto h-12 flex items-center justify-between px-4 md:px-6">
          <span className="text-white font-semibold text-sm">iPhone 16 Pro</span>
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.slice(0, 6).map((link) => (
              <a
                key={link}
                className="text-[#86868b] hover:text-white text-xs transition-colors cursor-pointer"
              >
                {link}
              </a>
            ))}
          </div>
          <a className="apple-link text-sm" style={{ fontSize: "12px" }}>
            Buy
          </a>
        </div>
      </nav>
    </>
  );
}
