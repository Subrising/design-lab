"use client";

import { motion } from "motion/react";

interface MarqueeStripProps {
  text: string;
  speed?: number;
  reverse?: boolean;
  className?: string;
  outlined?: boolean;
}

export default function MarqueeStrip({
  text,
  speed = 20,
  reverse = false,
  className = "",
  outlined = false,
}: MarqueeStripProps) {
  const repeated = `${text} — `.repeat(8);

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="inline-block"
        animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        style={
          outlined
            ? {
                WebkitTextStroke: "1px rgba(255,255,255,0.3)",
                color: "transparent",
              }
            : undefined
        }
      >
        {repeated}
        {repeated}
      </motion.div>
    </div>
  );
}
