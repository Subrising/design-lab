"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const navItems = ["Features", "Extensions", "Teams", "Pricing", "Blog"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[rgba(10,10,15,0.8)] backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ray-pink to-ray-purple flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 8L8 2L14 8L8 14L2 8Z"
                fill="white"
                fillOpacity="0.9"
              />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            Raycast
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm text-ray-muted hover:text-white transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="text-sm text-ray-muted hover:text-white transition-colors"
          >
            Log in
          </a>
          <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-ray-pink to-ray-purple rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg shadow-ray-pink/20">
            Download
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
