"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import SplitText from "./SplitText";
import { useCursor } from "./CursorContext";

export default function Hero() {
  const lineRef = useRef<HTMLDivElement>(null);
  const { onEnter, onLeave } = useCursor();

  useEffect(() => {
    if (!lineRef.current) return;
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.5, delay: 1.2, ease: "power4.inOut" }
    );
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-end px-6 md:px-12 pb-16 pt-32">
      {/* Background subtle noise */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* Top label */}
      <motion.div
        className="absolute top-32 left-6 md:left-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <span className="text-xs tracking-[0.4em] uppercase text-[#666]">
          Digital Design Studio
        </span>
      </motion.div>

      {/* Main headline */}
      <div className="relative z-10">
        <SplitText
          text="We create"
          as="h1"
          className="text-[12vw] md:text-[10vw] leading-[0.9] font-light tracking-[-0.03em]"
          animation="chars"
          delay={0.3}
          stagger={0.04}
          cursorHover
        />
        <SplitText
          text="digital"
          as="h1"
          className="text-[14vw] md:text-[12vw] leading-[0.9] font-editorial tracking-[-0.03em] text-[#c8ff00]"
          animation="wave"
          delay={0.6}
          stagger={0.05}
          cursorHover
        />
        <SplitText
          text="experiences"
          as="h1"
          className="text-[12vw] md:text-[10vw] leading-[0.9] font-light tracking-[-0.03em]"
          animation="chars"
          delay={0.9}
          stagger={0.03}
          cursorHover
        />
      </div>

      {/* Horizontal rule */}
      <div
        ref={lineRef}
        className="w-full h-[1px] bg-[#333] mt-12 origin-left"
        style={{ transform: "scaleX(0)" }}
      />

      {/* Bottom info row */}
      <div className="flex justify-between items-end mt-8">
        <motion.p
          className="text-sm text-[#666] max-w-[300px] leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          Award-winning studio crafting bold digital identities
          and immersive web experiences.
        </motion.p>

        <motion.div
          className="flex items-center gap-2 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          onMouseEnter={() => onEnter("link")}
          onMouseLeave={onLeave}
        >
          <span className="text-[#666]">Scroll</span>
          <motion.div
            className="w-[1px] h-8 bg-[#666]"
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
