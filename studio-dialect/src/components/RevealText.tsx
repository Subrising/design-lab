"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface RevealTextProps {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export default function RevealText({
  children,
  className = "",
  delay = 0,
  as: Tag = "span",
}: RevealTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const words = children.split(" ");

  return (
    <Tag ref={ref} className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={isInView ? { y: 0 } : { y: "110%" }}
            transition={{
              duration: 0.8,
              delay: delay + i * 0.04,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
