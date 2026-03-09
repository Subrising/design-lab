"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { useCursor } from "./CursorContext";

interface ProjectCardProps {
  title: string;
  category: string;
  year: string;
  index: number;
  color: string;
  imageGradient: string;
}

export default function ProjectCard({
  title,
  category,
  year,
  index,
  color,
  imageGradient,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const { onEnter, onLeave } = useCursor();

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    if (!card || !image) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(image, {
        x: x * 30,
        y: y * 20,
        scale: 1.08,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(image, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="project-card relative overflow-hidden group"
      style={{ aspectRatio: index % 3 === 0 ? "16/10" : "4/5" }}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1,
        delay: (index % 2) * 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => onEnter("project", "View")}
      onMouseLeave={onLeave}
    >
      {/* Image placeholder with gradient */}
      <div
        ref={imageRef}
        className="absolute inset-[-20px] transition-none"
        style={{
          background: imageGradient,
        }}
      />

      {/* Geometric accent */}
      <motion.div
        className="absolute top-6 right-6 w-16 h-16 border opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ borderColor: color }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Bottom info — slides up on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <motion.span
          className="block text-xs tracking-[0.3em] uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ color }}
        >
          {category}
        </motion.span>
        <h3 className="text-3xl md:text-4xl font-light tracking-[-0.02em]">
          {title}
        </h3>
        <span className="block text-sm text-[#666] mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          {year}
        </span>
      </div>

      {/* Hover border animation */}
      <div className="absolute inset-0 border border-transparent group-hover:border-[#333] transition-colors duration-500" />
    </motion.div>
  );
}
