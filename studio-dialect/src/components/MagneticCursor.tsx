"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagneticCursor() {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [label, setLabel] = useState("");

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const down = () => setClicked(true);
    const up = () => setClicked(false);

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const magnetic = target.closest("[data-magnetic]");
      const cursorLabel = target.closest("[data-cursor-label]");

      if (magnetic) {
        setHovered(true);
        const rect = (magnetic as HTMLElement).getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        // Pull cursor toward center with magnetic effect
        cursorX.set(centerX + dx * 0.4);
        cursorY.set(centerY + dy * 0.4);
      }

      if (cursorLabel) {
        setLabel((cursorLabel as HTMLElement).dataset.cursorLabel || "");
      }

      if (target.closest("a, button, [data-magnetic]")) {
        setHovered(true);
      }
    };

    const out = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-magnetic]")) {
        setHovered(false);
        setLabel("");
      }
    };

    const leave = () => setHidden(true);
    const enter = () => setHidden(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Dot cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width: 8,
          height: 8,
          backgroundColor: "var(--accent)",
          opacity: hidden ? 0 : 1,
        }}
        animate={{
          scale: clicked ? 0.5 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Ring cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: "var(--accent)",
          opacity: hidden ? 0 : 0.5,
        }}
        animate={{
          width: hovered ? 60 : 32,
          height: hovered ? 60 : 32,
          scale: clicked ? 0.8 : 1,
          borderWidth: hovered ? 2 : 1,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      />

      {/* Label */}
      {label && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
          style={{
            x,
            y,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--bg)] font-medium whitespace-nowrap">
            {label}
          </span>
        </motion.div>
      )}
    </>
  );
}
