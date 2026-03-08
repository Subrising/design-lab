"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Shortcuts", href: "#shortcuts" },
  { label: "Product", href: "#product" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass" : ""
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M7 5L10 6.5V9.5L7 11L4 9.5V6.5L7 5Z" fill="white" opacity="0.6"/>
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-tight">Aurora</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="text-sm text-muted hover:text-foreground transition-colors px-3 py-1.5">
            Log in
          </button>
          <button className="text-sm bg-foreground text-background px-4 py-1.5 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Get started
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
