"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="py-32 relative">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-accent/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            <span className="text-gradient">Ready to build</span>{" "}
            <span className="text-gradient-accent">faster?</span>
          </h2>
          <p className="text-lg text-muted max-w-xl mx-auto mb-10">
            Join thousands of teams shipping better software with Aurora.
            Free for teams up to 10. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-4 rounded-xl bg-accent text-white font-medium overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get started for free
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-0.5 transition-transform">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>

            <button className="text-sm text-muted hover:text-foreground transition-colors flex items-center gap-2">
              Talk to sales
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 10L9 7L5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex items-center justify-center gap-6 text-xs text-muted"
          >
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L8.5 4.5L12.5 5L9.75 7.5L10.5 11.5L7 9.5L3.5 11.5L4.25 7.5L1.5 5L5.5 4.5L7 1Z" fill="#FBBF24" />
              </svg>
              4.9/5 on G2
            </span>
            <span className="w-px h-3 bg-border" />
            <span>10,000+ teams</span>
            <span className="w-px h-3 bg-border" />
            <span>99.99% uptime</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
