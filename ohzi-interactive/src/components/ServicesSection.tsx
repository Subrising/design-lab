"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  {
    title: "WebGL Experiences",
    description:
      "Full custom 3D web experiences with real-time rendering, custom shaders, and optimized performance across all devices.",
    icon: "◆",
  },
  {
    title: "WebXR & AR",
    description:
      "Immersive augmented and virtual reality experiences accessible directly through the browser. No app downloads required.",
    icon: "◇",
  },
  {
    title: "Interactive Storytelling",
    description:
      "Narrative-driven digital experiences that combine animation, 3D, and interaction design into compelling stories.",
    icon: "○",
  },
  {
    title: "3D Product Visualization",
    description:
      "Photorealistic product configurators and viewers with PBR materials, dynamic lighting, and AR try-on capabilities.",
    icon: "△",
  },
  {
    title: "Creative Development",
    description:
      "Custom development tools, particle systems, physics simulations, and experimental web technologies.",
    icon: "□",
  },
  {
    title: "Brand Experiences",
    description:
      "Complete digital brand experiences that merge design, technology, and storytelling into unforgettable web presences.",
    icon: "◎",
  },
];

export default function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="services"
      className="relative z-10 px-8 py-32 max-w-7xl mx-auto"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="mb-20"
      >
        <p className="text-white/20 text-xs tracking-[0.5em] uppercase mb-4">
          What We Do
        </p>
        <h2 className="text-4xl md:text-6xl font-extralight text-white tracking-wider">
          Services
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden">
        {services.map((service, i) => {
          const cardRef = useRef(null);
          const cardInView = useInView(cardRef, {
            once: true,
            margin: "-50px",
          });

          return (
            <motion.div
              key={service.title}
              ref={cardRef}
              initial={{ opacity: 0, y: 30 }}
              animate={cardInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group p-8 md:p-10 bg-[#020208] hover:bg-white/[0.03] transition-all duration-500"
              data-cursor="pointer"
            >
              <span className="text-blue-400/40 text-2xl mb-6 block">
                {service.icon}
              </span>
              <h3 className="text-lg font-light text-white/80 mb-3 tracking-wider group-hover:text-white transition-colors">
                {service.title}
              </h3>
              <p className="text-white/25 text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
