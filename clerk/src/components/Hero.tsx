"use client";

import { motion } from "framer-motion";
import HeroSVGAnimation from "./HeroSVGAnimation";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mb-6"
      >
        <div className="animated-border px-4 py-1.5 rounded-full flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[#8B8B9E]">New: Organizations & Multi-tenancy</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#6C47FF]">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative z-10 text-5xl sm:text-6xl lg:text-7xl font-bold text-center max-w-4xl leading-[1.1] tracking-tight"
      >
        Authentication for the{" "}
        <span className="gradient-text">modern web</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative z-10 mt-6 text-lg sm:text-xl text-[#8B8B9E] text-center max-w-2xl leading-relaxed"
      >
        Drop-in React components, flexible APIs, and admin dashboards to
        authenticate and manage your users. Built for the modern stack.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="relative z-10 mt-8 flex flex-col sm:flex-row gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(108,71,255,0.4)" }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3.5 bg-[#6C47FF] hover:bg-[#5A38E0] text-white font-medium rounded-xl transition-colors text-sm"
        >
          Start building for free
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3.5 border border-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-colors text-sm backdrop-blur-sm"
        >
          View documentation →
        </motion.button>
      </motion.div>

      {/* Code snippet */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="relative z-10 mt-6 px-4 py-2 rounded-lg bg-[#131320]/80 border border-white/5 font-mono text-sm text-[#8B8B9E]"
      >
        <span className="text-[#17CCFC]">npm</span>{" "}
        <span className="text-[#8B8B9E]">install</span>{" "}
        <span className="text-[#6C47FF]">@clerk/nextjs</span>
      </motion.div>

      {/* SVG Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="relative z-10 mt-12 w-full max-w-3xl"
      >
        <HeroSVGAnimation />
      </motion.div>

      {/* Trusted by logos (simulated) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="relative z-10 mt-16 flex flex-col items-center gap-4"
      >
        <p className="text-xs text-[#8B8B9E] uppercase tracking-widest">Trusted by modern teams</p>
        <div className="flex items-center gap-8 opacity-40">
          {["Vercel", "Stripe", "Notion", "Linear", "Supabase"].map((name) => (
            <span key={name} className="text-sm font-medium tracking-wide">{name}</span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
