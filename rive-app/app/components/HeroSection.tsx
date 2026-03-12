"use client";

import { motion } from "framer-motion";
import CursorCanvas from "./CursorCanvas";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(123,97,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(123,97,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#7b61ff]/10 blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#ff6b9d]/10 blur-[120px] animate-[float_6s_ease-in-out_infinite_1s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00d4aa]/5 blur-[150px] animate-[float_10s_ease-in-out_infinite_2s]" />

      {/* Interactive cursor canvas */}
      <CursorCanvas />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2a2a40] bg-[#1a1a2e]/50 backdrop-blur mb-8">
            <div className="w-2 h-2 rounded-full bg-[#00d4aa] animate-pulse" />
            <span className="text-sm text-[#8888aa]">Now with State Machine support</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-6"
        >
          <span className="text-white">Build </span>
          <span className="gradient-text">interactive</span>
          <br />
          <span className="text-white">animations</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-[#8888aa] max-w-2xl mx-auto mb-10"
        >
          Design and ship interactive animations to any platform. Create stunning
          motion graphics with state machines that respond to real-time user input.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-[#7b61ff] to-[#ff6b9d] text-white font-medium text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#7b61ff]/30">
            <span className="relative z-10">Start Creating</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b9d] to-[#7b61ff] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
          <button className="flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#2a2a40] text-white hover:border-[#7b61ff]/50 hover:bg-[#7b61ff]/5 transition-all duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
            </svg>
            Watch Demo
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex items-center justify-center gap-12 mt-20"
        >
          {[
            { value: "100K+", label: "Creators" },
            { value: "1M+", label: "Animations" },
            { value: "50+", label: "Platforms" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-[#8888aa] mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-[#2a2a40] flex items-start justify-center p-1.5">
          <div className="w-1.5 h-2.5 rounded-full bg-[#7b61ff]" />
        </div>
      </motion.div>
    </section>
  );
}
