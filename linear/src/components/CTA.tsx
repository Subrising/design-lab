"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-40 px-6 overflow-hidden">
      {/* Background mesh */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-r from-linear-purple/20 via-linear-blue/15 to-linear-teal/10 rounded-full blur-[120px]" />
        </div>
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] gradient-text mb-6 leading-[1.05]">
            Build better
            <br />
            <span className="gradient-text-purple">products, faster</span>
          </h2>
          <p className="text-lg text-linear-text-secondary max-w-md mx-auto mb-10">
            Join thousands of teams using Linear to streamline their development workflow.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.button
            className="relative group px-10 py-4 rounded-xl text-[16px] font-semibold text-white overflow-hidden"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-linear-purple via-linear-blue to-linear-teal" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-linear-teal via-linear-blue to-linear-purple"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-linear-purple via-linear-blue to-linear-teal opacity-0 group-hover:opacity-100 blur-2xl transition-opacity" />
            <span className="relative">Get started for free</span>
          </motion.button>
          <motion.button
            className="text-[15px] font-medium text-linear-text-secondary hover:text-linear-text transition-colors"
            whileHover={{ x: 4 }}
          >
            Talk to sales →
          </motion.button>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          className="mt-16 flex items-center justify-center gap-8 text-[13px] text-linear-text-secondary"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Free forever plan
          </span>
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            No credit card
          </span>
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Cancel anytime
          </span>
        </motion.div>
      </div>
    </section>
  );
}
