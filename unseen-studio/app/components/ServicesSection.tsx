"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCursor } from "./CursorContext";
import SplitText from "./SplitText";

const services = [
  {
    number: "01",
    title: "Brand Strategy",
    description: "We distill your vision into a strategic foundation that drives every design decision.",
  },
  {
    number: "02",
    title: "Digital Design",
    description: "Crafting interfaces that captivate — where aesthetics meet ruthless functionality.",
  },
  {
    number: "03",
    title: "Web Development",
    description: "Engineering performant, accessible experiences with cutting-edge technology.",
  },
  {
    number: "04",
    title: "Motion & 3D",
    description: "Bringing depth and narrative through animation, interaction, and spatial design.",
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { onEnter, onLeave } = useCursor();

  return (
    <section id="services" ref={sectionRef} className="px-6 md:px-12 py-32">
      <div className="mb-20">
        <span className="text-xs tracking-[0.4em] uppercase text-[#666] block mb-4">
          What We Do
        </span>
        <SplitText
          text="Services"
          as="h2"
          className="text-[10vw] md:text-[7vw] font-editorial leading-[1] tracking-[-0.03em]"
          animation="wave"
          scrollTrigger
          cursorHover
        />
      </div>

      <div className="space-y-0">
        {services.map((service, i) => (
          <motion.div
            key={service.number}
            className="group border-t border-[#222] py-10 md:py-14 flex flex-col md:flex-row md:items-center gap-6 md:gap-12"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: i * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            onMouseEnter={() => onEnter("link")}
            onMouseLeave={onLeave}
          >
            <span className="text-sm text-[#c8ff00] font-mono">{service.number}</span>
            <h3 className="text-[6vw] md:text-[3.5vw] font-light tracking-[-0.02em] group-hover:text-[#c8ff00] transition-colors duration-500 flex-1">
              {service.title}
            </h3>
            <p className="text-[#666] max-w-[350px] text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 md:text-right">
              {service.description}
            </p>
            <motion.div
              className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center group-hover:border-[#c8ff00] group-hover:bg-[#c8ff00] transition-all duration-500"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="group-hover:text-[#0a0a0a] text-[#666] transition-colors duration-500"
              >
                <path
                  d="M1 13L13 1M13 1H3M13 1V11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </motion.div>
          </motion.div>
        ))}
        <div className="border-t border-[#222]" />
      </div>
    </section>
  );
}
