"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[200] bg-[#0a0a0a] flex items-end justify-between px-8 pb-8"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.span
            className="text-[20vw] md:text-[15vw] font-light leading-none tracking-tighter text-[#f5f0eb]"
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
          >
            {Math.min(count, 100)}
          </motion.span>
          <motion.span
            className="text-sm tracking-[0.3em] uppercase text-[#666] mb-4"
            exit={{ opacity: 0 }}
          >
            Loading
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
