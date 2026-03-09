"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const navLinks = [
  { label: "Product", href: "#features" },
  { label: "Docs", href: "#" },
  { label: "Pricing", href: "#pricing" },
  { label: "Changelog", href: "#" },
  { label: "Blog", href: "#" },
];

export default function Navbar() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0A0A0F]/80 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="#6C47FF" />
            <path
              d="M14 6L20 10V18L14 22L8 18V10L14 6Z"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="14" cy="12" r="2.5" fill="white" />
            <path d="M10 18C10 15.8 11.8 14 14 14C16.2 14 18 15.8 18 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-lg font-semibold tracking-tight">clerk</span>
        </a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className="relative px-4 py-2 text-sm text-[#8B8B9E] hover:text-white transition-colors"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {hoveredIdx === i && (
                <motion.div
                  layoutId="nav-hover"
                  className="absolute inset-0 bg-white/5 rounded-lg"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button className="text-sm text-[#8B8B9E] hover:text-white transition-colors hidden sm:block">
            Sign in
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-[#6C47FF] hover:bg-[#5A38E0] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Get started
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
