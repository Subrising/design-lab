"use client";

import { motion } from "framer-motion";

export default function Hero({ count }: { count: number }) {
  const categories = 7;
  const techCount = 12;

  return (
    <section className="hero">
      <motion.div
        className="hero-badge"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <span className="dot" />
        Open Source Collection
      </motion.div>

      <motion.h1
        className="hero-title"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <span className="gradient-text">Design</span> Lab
      </motion.h1>

      <motion.p
        className="hero-subtitle"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        A curated collection of bleeding-edge web experiments. GSAP, Three.js,
        WebGL, scroll-driven animations, 3D physics, and beyond.
      </motion.p>

      <motion.div
        className="hero-stats"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <div className="hero-stat">
          <div className="number">{count}</div>
          <div className="label">Experiments</div>
        </div>
        <div className="hero-stat">
          <div className="number">{categories}</div>
          <div className="label">Categories</div>
        </div>
        <div className="hero-stat">
          <div className="number">{techCount}+</div>
          <div className="label">Technologies</div>
        </div>
      </motion.div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        Scroll to explore
        <div className="line" />
      </motion.div>
    </section>
  );
}
