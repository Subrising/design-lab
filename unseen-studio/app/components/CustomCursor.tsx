"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useCursor } from "./CursorContext";

export default function CustomCursor() {
  const { cursorVariant, cursorText } = useCursor();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);
  const dotRef = useRef<HTMLDivElement>(null);

  const moveCursor = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    },
    [cursorX, cursorY]
  );

  useEffect(() => {
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [moveCursor]);

  const variants: Record<string, { width: number; height: number; backgroundColor: string; mixBlendMode?: string }> = {
    default: {
      width: 20,
      height: 20,
      backgroundColor: "#f5f0eb",
      mixBlendMode: "difference",
    },
    text: {
      width: 120,
      height: 120,
      backgroundColor: "#c8ff00",
      mixBlendMode: "difference",
    },
    project: {
      width: 100,
      height: 100,
      backgroundColor: "#c8ff00",
    },
    link: {
      width: 60,
      height: 60,
      backgroundColor: "#f5f0eb",
      mixBlendMode: "difference",
    },
    nav: {
      width: 80,
      height: 80,
      backgroundColor: "#c8ff00",
    },
  };

  const currentVariant = variants[cursorVariant] || variants.default;

  return (
    <>
      {/* Main cursor blob */}
      <motion.div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: currentVariant.width,
          height: currentVariant.height,
          backgroundColor: currentVariant.backgroundColor,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <AnimatePresence>
          {cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-[10px] font-bold uppercase tracking-widest text-[#0a0a0a] pointer-events-none select-none"
            >
              {cursorText}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Trail dot */}
      <motion.div
        className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full bg-[#c8ff00] pointer-events-none z-[9998]"
        style={{
          x: useSpring(cursorX, { damping: 40, stiffness: 200 }),
          y: useSpring(cursorY, { damping: 40, stiffness: 200 }),
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
