"use client";

import { motion } from "framer-motion";
import { useCursor } from "./CursorContext";

export default function Footer() {
  const { onEnter, onLeave } = useCursor();

  return (
    <footer className="px-6 md:px-12 py-12 border-t border-[#222]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.span
          className="text-xs tracking-[0.3em] uppercase text-[#666]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          © 2024 Unseen Studio
        </motion.span>

        <div className="flex gap-8 text-xs tracking-[0.2em] uppercase text-[#666]">
          {["Privacy", "Terms", "Cookies"].map((item) => (
            <a
              key={item}
              href="#"
              className="hover:text-white transition-colors duration-300"
              onMouseEnter={() => onEnter("link")}
              onMouseLeave={onLeave}
            >
              {item}
            </a>
          ))}
        </div>

        <motion.button
          className="text-xs tracking-[0.2em] uppercase text-[#666] hover:text-[#c8ff00] transition-colors duration-300"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          onMouseEnter={() => onEnter("link")}
          onMouseLeave={onLeave}
        >
          Back to Top ↑
        </motion.button>
      </div>
    </footer>
  );
}
