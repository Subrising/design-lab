"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = ["Work", "Services", "Labs", "About", "Contact"];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-white font-bold text-xl tracking-[0.3em] uppercase"
        >
          OHZI
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white/70 hover:text-white transition-colors uppercase text-xs tracking-[0.3em] flex items-center gap-3"
          data-cursor="pointer"
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <div className="flex flex-col gap-1.5 w-6">
            <motion.div
              className="h-px bg-white"
              animate={{
                rotate: menuOpen ? 45 : 0,
                y: menuOpen ? 4 : 0,
              }}
            />
            <motion.div
              className="h-px bg-white"
              animate={{
                rotate: menuOpen ? -45 : 0,
                y: menuOpen ? -3 : 0,
                opacity: menuOpen ? 1 : 1,
              }}
            />
          </div>
        </motion.button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8">
              {navItems.map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  onClick={() => setMenuOpen(false)}
                  className="text-4xl md:text-6xl font-light text-white/60 hover:text-white transition-colors tracking-[0.2em] uppercase"
                  data-cursor="pointer"
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
