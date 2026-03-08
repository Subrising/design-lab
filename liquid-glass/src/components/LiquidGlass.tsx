"use client";

import { motion } from "motion/react";
import LiquidBlobs from "./LiquidBlobs";
import MouseGlow from "./MouseGlow";
import GlassCard from "./GlassCard";
import MorphingShape from "./MorphingShape";
import AnimatedCounter from "./AnimatedCounter";
import RippleButton from "./RippleButton";
import OrbitRing from "./OrbitRing";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function LiquidGlass() {
  return (
    <div className="relative min-h-screen">
      <LiquidBlobs />
      <MouseGlow />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24">
        {/* Hero */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] as const }}
        >
          <motion.p
            className="text-xs uppercase tracking-[0.4em] text-violet-400/60 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Design Experiment
          </motion.p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-violet-300 via-cyan-300 to-rose-300 bg-clip-text text-transparent">
              Liquid Glass
            </span>
          </h1>
          <p className="mt-4 text-lg text-zinc-500 max-w-md mx-auto">
            Frosted morphism with animated blobs, glass cards, and fluid interactions
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {[
            { label: "Active Users", value: 12847, suffix: "", prefix: "" },
            { label: "Uptime", value: 99, suffix: ".9%", prefix: "" },
            { label: "Latency", value: 42, suffix: "ms", prefix: "" },
            { label: "Throughput", value: 3200, suffix: "/s", prefix: "" },
          ].map((stat, i) => (
            <motion.div key={stat.label} variants={fadeUp}>
              <GlassCard delay={0.3 + i * 0.1}>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold">
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    delay={0.5 + i * 0.15}
                  />
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Morphing showcase — wide */}
          <GlassCard span="wide" delay={0.8}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4">
              Shape Morphing
            </p>
            <div className="flex items-center gap-8 flex-wrap justify-center py-4">
              <MorphingShape color="#8b5cf6" size={100} duration={6} />
              <MorphingShape color="#06b6d4" size={80} duration={8} />
              <MorphingShape color="#f43f5e" size={60} duration={10} />
              <MorphingShape color="#f59e0b" size={90} duration={7} />
            </div>
            <p className="text-sm text-zinc-500 mt-4">
              SVG path interpolation with continuous rotation — organic motion from geometric paths
            </p>
          </GlassCard>

          {/* Orbit animation */}
          <GlassCard delay={0.9}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4">
              Orbital System
            </p>
            <div className="flex items-center justify-center py-2 relative h-[180px]">
              <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
                {/* Center dot */}
                <div className="absolute w-3 h-3 rounded-full bg-violet-400" style={{ boxShadow: "0 0 20px #8b5cf680", left: 'calc(50% - 6px)', top: 'calc(50% - 6px)' }} />
                <div className="absolute" style={{ left: 'calc(50% - 80px)', top: 'calc(50% - 80px)' }}>
                  <OrbitRing radius={80} duration={12} dotCount={3} color="#8b5cf6" />
                </div>
                <div className="absolute" style={{ left: 'calc(50% - 55px)', top: 'calc(50% - 55px)' }}>
                  <OrbitRing radius={55} duration={8} dotCount={2} color="#06b6d4" reverse />
                </div>
                <div className="absolute" style={{ left: 'calc(50% - 30px)', top: 'calc(50% - 30px)' }}>
                  <OrbitRing radius={30} duration={5} dotCount={1} color="#f43f5e" />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Progress bars */}
          <GlassCard delay={1.0}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4">
              Resources
            </p>
            <div className="space-y-4">
              {[
                { label: "CPU", value: 67, color: "#8b5cf6" },
                { label: "Memory", value: 42, color: "#06b6d4" },
                { label: "Storage", value: 89, color: "#f43f5e" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-400">{item.label}</span>
                    <span className="text-zinc-500">{item.value}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ delay: 1.2, duration: 1.2, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Glass layers explanation */}
          <GlassCard delay={1.1}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-3">
              Glass Stack
            </p>
            <div className="relative h-32 perspective-[400px]">
              {[
                { label: "Blur", z: 0, bg: "rgba(139,92,246,0.08)" },
                { label: "Saturate", z: 1, bg: "rgba(6,182,212,0.06)" },
                { label: "Overlay", z: 2, bg: "rgba(244,63,94,0.05)" },
              ].map((layer, i) => (
                <motion.div
                  key={layer.label}
                  className="absolute rounded-xl border border-white/10 flex items-center justify-center text-xs text-zinc-400"
                  style={{
                    background: layer.bg,
                    width: "80%",
                    height: "50px",
                    left: "10%",
                  }}
                  initial={{ y: 40, opacity: 0, rotateX: 20 }}
                  animate={{
                    y: i * 30,
                    opacity: 1,
                    rotateX: 20,
                  }}
                  transition={{ delay: 1.3 + i * 0.15, duration: 0.6 }}
                >
                  {layer.label}
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* CTA card */}
          <GlassCard delay={1.2}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-3">
              Interaction
            </p>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              Ripple effect on click. Cursor glow follows your mouse across all cards.
            </p>
            <RippleButton>Click me</RippleButton>
          </GlassCard>
        </div>

        {/* Full-width footer card */}
        <GlassCard delay={1.4} className="text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h3 className="text-xl font-bold">
                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Glassmorphism done right
                </span>
              </h3>
              <p className="text-sm text-zinc-500 mt-1">
                backdrop-filter: blur + saturate over animated radial gradients
              </p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              {["backdrop-filter", "Motion", "SVG Path", "CSS Blend"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full border border-violet-400/20 text-xs text-violet-300/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
