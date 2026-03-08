"use client";

import { motion } from "motion/react";

interface OrbitRingProps {
  radius: number;
  duration: number;
  dotCount: number;
  color: string;
  reverse?: boolean;
}

export default function OrbitRing({
  radius,
  duration,
  dotCount,
  color,
  reverse = false,
}: OrbitRingProps) {
  return (
    <motion.div
      className="absolute"
      style={{ width: radius * 2, height: radius * 2 }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {/* Ring border */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: `1px solid ${color}15` }}
      />
      {/* Orbiting dots */}
      {Array.from({ length: dotCount }).map((_, i) => {
        const angle = (360 / dotCount) * i;
        const rad = (angle * Math.PI) / 180;
        const x = radius + Math.cos(rad) * radius;
        const y = radius + Math.sin(rad) * radius;
        return (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: x - 4,
              top: y - 4,
              background: color,
              boxShadow: `0 0 12px ${color}80`,
            }}
          />
        );
      })}
    </motion.div>
  );
}
