"use client";

import { motion } from "motion/react";

const paths = [
  "M 50 0 C 80 10, 100 40, 90 70 C 80 95, 50 100, 30 85 C 5 70, 0 35, 20 15 C 30 5, 40 0, 50 0",
  "M 55 5 C 85 0, 100 30, 95 60 C 90 90, 60 100, 35 90 C 10 80, 0 50, 10 25 C 20 5, 35 5, 55 5",
  "M 45 0 C 70 5, 100 25, 95 55 C 90 85, 65 100, 40 95 C 15 90, 0 65, 5 35 C 10 10, 25 0, 45 0",
];

interface MorphingShapeProps {
  color: string;
  size?: number;
  className?: string;
  duration?: number;
}

export default function MorphingShape({
  color,
  size = 120,
  className = "",
  duration = 8,
}: MorphingShapeProps) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: duration * 4, repeat: Infinity, ease: "linear" }}
    >
      <defs>
        <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <motion.path
        fill={`url(#grad-${color})`}
        initial={{ d: paths[0] }}
        animate={{ d: paths }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
    </motion.svg>
  );
}
