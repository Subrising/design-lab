"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "12", label: "Countries Reached" },
  { value: "8+", label: "Years of WebGL" },
  { value: "∞", label: "Creativity" },
];

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative z-10 px-8 py-32 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <p className="text-white/20 text-xs tracking-[0.5em] uppercase mb-4">
            About Us
          </p>
          <h2 className="text-4xl md:text-5xl font-extralight text-white tracking-wider mb-8 leading-tight">
            Creativity
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Without Limits
            </span>
          </h2>
          <p className="text-white/30 text-sm leading-relaxed mb-6 tracking-wider">
            We are a passionate team of designers and developers dedicated to
            building spectacular, 3D interactive web experiences. From product
            visualizations to virtual tours, gamified e-commerce to interactive
            storytelling — we build the impossible.
          </p>
          <p className="text-white/20 text-sm leading-relaxed tracking-wider">
            Our tools: WebGL, Three.js, WebXR, Blender, GLSL, and a relentless
            drive to push every pixel to perfection. Precise, innovative
            craftsmanship — that&apos;s what defines us.
          </p>
        </motion.div>

        <motion.div style={{ y }} className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              className="border border-white/5 rounded-xl p-6 text-center bg-white/[0.02] backdrop-blur-sm"
            >
              <div className="text-3xl md:text-4xl font-extralight text-white/80 mb-2">
                {stat.value}
              </div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/25">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
