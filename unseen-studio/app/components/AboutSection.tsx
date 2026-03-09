"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useInView } from "framer-motion";
import SplitText from "./SplitText";
import { useCursor } from "./CursorContext";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "150+", label: "Projects Delivered" },
  { value: "12", label: "Years Experience" },
  { value: "40+", label: "Awards Won" },
  { value: "∞", label: "Ambition" },
];

export default function AboutSection() {
  const marqueRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" });
  const { onEnter, onLeave } = useCursor();

  useEffect(() => {
    if (!marqueRef.current) return;

    const tl = gsap.to(marqueRef.current, {
      xPercent: -50,
      duration: 30,
      repeat: -1,
      ease: "none",
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-32 overflow-hidden">
      {/* Marquee */}
      <div className="relative mb-32 py-8 border-y border-[#222] overflow-hidden">
        <div ref={marqueRef} className="flex whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="text-[8vw] font-light tracking-[-0.03em] mx-8 text-[#222]"
            >
              Design · Strategy · Development · Experience ·{" "}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <SplitText
            text="Built for the bold"
            as="h2"
            className="text-[6vw] md:text-[4vw] font-light leading-[1.1] tracking-[-0.03em] mb-8"
            animation="chars"
            scrollTrigger
            cursorHover
          />
          <motion.p
            className="text-lg text-[#999] leading-relaxed max-w-[500px]"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            We are a collective of designers, developers, and strategists
            who believe in the power of digital craft. Every pixel matters.
            Every interaction tells a story.
          </motion.p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="border-t border-[#222] pt-6"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
              onMouseEnter={() => onEnter("link")}
              onMouseLeave={onLeave}
            >
              <span className="text-[4vw] md:text-[3vw] font-light text-[#c8ff00]">
                {stat.value}
              </span>
              <span className="block text-sm text-[#666] mt-2 tracking-[0.1em] uppercase">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
