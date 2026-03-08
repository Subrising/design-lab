"use client";

import { motion } from "motion/react";
import { useRef, type MouseEvent, type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  span?: "default" | "wide" | "tall" | "hero";
}

const spanMap = {
  default: "",
  wide: "md:col-span-2",
  tall: "md:row-span-2",
  hero: "md:col-span-2 md:row-span-2",
};

export default function GlassCard({
  children,
  className = "",
  delay = 0,
  span = "default",
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glowRef.current.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(139,92,246,0.12), transparent 60%)`;
  };

  const handleMouseLeave = () => {
    if (glowRef.current) {
      glowRef.current.style.background = "transparent";
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card glass-shimmer relative p-6 md:p-8 ${spanMap[span]} ${className}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay,
        duration: 0.7,
        ease: [0.23, 1, 0.32, 1] as const,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cursor-following inner glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-[24px] pointer-events-none transition-[background] duration-300"
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
