"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SplitText from "./SplitText";
import { useCursor } from "./CursorContext";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { onEnter, onLeave } = useCursor();

  return (
    <section id="contact" ref={sectionRef} className="px-6 md:px-12 py-32 min-h-screen flex flex-col justify-center">
      <div className="mb-8">
        <span className="text-xs tracking-[0.4em] uppercase text-[#666] block mb-6">
          Get in Touch
        </span>
        <SplitText
          text="Let's create"
          as="h2"
          className="text-[10vw] md:text-[8vw] font-light leading-[0.95] tracking-[-0.03em]"
          animation="chars"
          scrollTrigger
          stagger={0.04}
          cursorHover
        />
        <SplitText
          text="something"
          as="h2"
          className="text-[12vw] md:text-[10vw] font-editorial leading-[0.95] tracking-[-0.03em] text-[#c8ff00]"
          animation="wave"
          scrollTrigger
          delay={0.2}
          stagger={0.05}
          cursorHover
        />
        <SplitText
          text="extraordinary"
          as="h2"
          className="text-[10vw] md:text-[8vw] font-light leading-[0.95] tracking-[-0.03em]"
          animation="chars"
          scrollTrigger
          delay={0.4}
          stagger={0.03}
          cursorHover
        />
      </div>

      <motion.div
        className="mt-16 flex flex-col md:flex-row gap-12 md:gap-24"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <a
          href="mailto:hello@unseen.studio"
          className="text-2xl md:text-3xl font-light hover:text-[#c8ff00] transition-colors duration-300 underline underline-offset-8 decoration-[#333] hover:decoration-[#c8ff00]"
          onMouseEnter={() => onEnter("link")}
          onMouseLeave={onLeave}
        >
          hello@unseen.studio
        </a>
        <div className="flex gap-8 text-sm text-[#666]">
          {["Twitter", "Instagram", "Dribbble", "LinkedIn"].map((social) => (
            <a
              key={social}
              href="#"
              className="hover:text-white transition-colors duration-300"
              onMouseEnter={() => onEnter("link")}
              onMouseLeave={onLeave}
            >
              {social}
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
