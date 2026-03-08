"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, type MouseEvent, type ReactNode } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface RippleButtonProps {
  children: ReactNode;
  className?: string;
}

export default function RippleButton({ children, className = "" }: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ripple: Ripple = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setRipples((prev) => [...prev, ripple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
    }, 800);
  };

  return (
    <motion.button
      className={`relative overflow-hidden glass-card px-8 py-4 text-sm font-medium tracking-wide uppercase cursor-pointer ${className}`}
      style={{ borderRadius: 16 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/20 pointer-events-none"
            style={{ left: ripple.x, top: ripple.y }}
            initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.5 }}
            animate={{ width: 300, height: 300, x: -150, y: -150, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
