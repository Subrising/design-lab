"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCursor } from "./CursorContext";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { onEnter, onLeave } = useCursor();

  const toggle = useCallback(() => setIsOpen((p) => !p), []);

  return (
    <>
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8 py-6 mix-blend-difference">
        <motion.a
          href="#"
          className="text-lg font-bold tracking-[0.3em] uppercase text-white"
          onMouseEnter={() => onEnter("link")}
          onMouseLeave={onLeave}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Unseen
        </motion.a>

        <motion.button
          onClick={toggle}
          className="relative z-[110] flex flex-col gap-[6px] items-end group"
          onMouseEnter={() => onEnter("nav", isOpen ? "Close" : "Menu")}
          onMouseLeave={onLeave}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.span
            className="block h-[2px] bg-white origin-right"
            animate={{
              width: isOpen ? 32 : 32,
              rotate: isOpen ? -45 : 0,
              y: isOpen ? 0 : 0,
            }}
            transition={{ duration: 0.4 }}
          />
          <motion.span
            className="block h-[2px] bg-white"
            animate={{
              width: isOpen ? 0 : 20,
              opacity: isOpen ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="block h-[2px] bg-white origin-right"
            animate={{
              width: isOpen ? 32 : 28,
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 0 : 0,
            }}
            transition={{ duration: 0.4 }}
          />
        </motion.button>
      </header>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[99] bg-[#0a0a0a] flex items-center justify-center"
            initial={{ clipPath: "circle(0% at calc(100% - 60px) 60px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 60px) 60px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 60px) 60px)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="flex flex-col items-center gap-4">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-[8vw] md:text-[6vw] font-light leading-[1.1] text-white hover:text-[#c8ff00] transition-colors duration-300 font-editorial"
                  initial={{ opacity: 0, y: 80, rotateX: -30 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onMouseEnter={() => onEnter("text")}
                  onMouseLeave={onLeave}
                  style={{ perspective: "1000px" }}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>

            {/* Bottom info */}
            <motion.div
              className="absolute bottom-12 left-8 right-8 flex justify-between text-sm text-[#666]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span>London / New York</span>
              <span>hello@unseen.studio</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
