"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "motion/react";

interface Card3DProps {
  title: string;
  subtitle: string;
  description: string;
  index: number;
  gradientClass: string;
  tags: string[];
}

export default function Card3D({
  title,
  subtitle,
  description,
  index,
  gradientClass,
  tags,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shineX, setShineX] = useState(50);
  const [shineY, setShineY] = useState(50);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) / (rect.width / 2);
    const dy = (e.clientY - centerY) / (rect.height / 2);

    setRotateX(-dy * 12); // Tilt up/down
    setRotateY(dx * 12);  // Tilt left/right

    // Shine position follows cursor
    setShineX(((e.clientX - rect.left) / rect.width) * 100);
    setShineY(((e.clientY - rect.top) / rect.height) * 100);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="card-3d"
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.12,
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={`card-inner ${gradientClass}`}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Shine overlay */}
        <div
          className="card-shine"
          style={{
            background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.15), transparent 50%)`,
          }}
        />

        {/* Card content */}
        <div className="relative z-5 h-full flex flex-col justify-between p-8">
          {/* Top */}
          <div>
            <span className="text-xs text-white/30 uppercase tracking-[0.3em] font-mono">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Center */}
          <div>
            <p className="text-sm text-white/40 uppercase tracking-widest mb-2">
              {subtitle}
            </p>
            <h3 className="text-4xl font-bold tracking-tight leading-tight">
              {title}
            </h3>
            <p className="mt-4 text-sm text-white/40 leading-relaxed max-w-[280px]">
              {description}
            </p>
          </div>

          {/* Bottom tags */}
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border border-white/10 text-white/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/10 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-white/10 rounded-bl-lg" />
      </motion.div>
    </motion.div>
  );
}
