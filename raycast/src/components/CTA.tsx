"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

export default function CTA() {
  return (
    <section className="relative z-10 px-6 py-32 max-w-5xl mx-auto text-center">
      {/* Glow backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-ray-purple/8 rounded-full blur-[120px]" />
      </div>

      <ScrollReveal>
        <div className="relative z-10">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Ready to be{" "}
            <span className="gradient-text">supercharged</span>?
          </h2>
          <p className="text-ray-muted text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Download Raycast for free and experience the fastest way to control
            your tools.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-10 py-4 text-base font-medium text-white rounded-xl bg-gradient-to-r from-ray-pink via-ray-purple to-ray-blue overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-ray-purple/30"
          >
            <span className="relative z-10">Download for macOS</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-ray-blue via-ray-purple to-ray-pink"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </motion.button>

          <p className="text-xs text-ray-muted mt-4">
            Free for personal use. No credit card required.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
