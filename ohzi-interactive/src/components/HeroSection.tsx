"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-8 z-10">
      <motion.div
        className="text-center max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      >
        <motion.p
          className="text-white/30 text-xs tracking-[0.5em] uppercase mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          Interactive Studio
        </motion.p>

        <div className="overflow-hidden">
          <motion.h1
            className="text-5xl md:text-7xl lg:text-9xl font-extralight text-white tracking-[0.15em] uppercase leading-none"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            We Build
          </motion.h1>
        </div>

        <div className="overflow-hidden mt-2">
          <motion.h1
            className="text-5xl md:text-7xl lg:text-9xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 tracking-[0.15em] uppercase leading-none"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            Digital Magic
          </motion.h1>
        </div>

        <motion.p
          className="text-white/40 text-sm md:text-base mt-12 max-w-xl mx-auto tracking-wider leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
        >
          Immersive 3D experiences crafted with WebGL, Three.js, and custom GLSL
          shaders. We tell stories that push the boundaries of the web.
        </motion.p>

        <motion.div
          className="mt-16 flex items-center gap-3 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.5 }}
        >
          <motion.div
            className="w-px h-12 bg-white/20"
            animate={{ scaleY: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-white/20 text-[10px] tracking-[0.4em] uppercase">
            Scroll to explore
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
