"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "./MagneticButton";

const navItems = ["Work", "About", "Services", "Contact"];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference">
        <div className="flex items-center justify-between px-8 py-6">
          <MagneticButton>
            <a href="#" className="text-white text-lg font-medium tracking-tight">
              Studio<span className="text-[var(--accent)]">.</span>
            </a>
          </MagneticButton>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <MagneticButton key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="text-white text-sm tracking-wide uppercase hover:text-[var(--accent)] transition-colors duration-300"
                >
                  {item}
                </a>
              </MagneticButton>
            ))}
          </div>

          <MagneticButton
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <button className="text-white text-sm uppercase tracking-widest">
              {menuOpen ? "Close" : "Menu"}
            </button>
          </MagneticButton>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-[var(--bg)] flex flex-col items-center justify-center gap-8"
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              >
                <MagneticButton>
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    className="text-white text-4xl font-light tracking-tight hover:text-[var(--accent)] transition-colors"
                  >
                    {item}
                  </a>
                </MagneticButton>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
