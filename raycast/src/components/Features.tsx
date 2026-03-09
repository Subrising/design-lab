"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";

function FeatureShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -150]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, -5]);

  return (
    <div ref={containerRef} className="relative h-[400px] sm:h-[500px] w-full overflow-hidden rounded-2xl">
      {/* Floating UI elements */}
      <motion.div
        style={{ y: y1, rotate }}
        className="absolute top-10 left-[10%] glass-card p-4 w-64"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ray-pink to-ray-purple" />
          <div>
            <div className="text-sm text-white font-medium">Quick Actions</div>
            <div className="text-xs text-ray-muted">⌘ + K</div>
          </div>
        </div>
        <div className="space-y-2">
          {["Create new file", "Search docs", "Run command"].map((item) => (
            <div
              key={item}
              className="text-xs text-ray-muted bg-white/3 rounded-lg px-3 py-2 border border-white/5"
            >
              {item}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="absolute top-20 right-[10%] glass-card p-4 w-56"
      >
        <div className="text-xs text-ray-muted mb-2">System Status</div>
        <div className="space-y-2">
          {[
            { label: "CPU", value: "23%", color: "bg-ray-green" },
            { label: "Memory", value: "64%", color: "bg-ray-yellow" },
            { label: "Disk", value: "41%", color: "bg-ray-blue" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="text-[10px] text-ray-muted w-12">{stat.label}</span>
              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: stat.value }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full ${stat.color} rounded-full`}
                />
              </div>
              <span className="text-[10px] text-ray-muted font-mono w-8 text-right">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [80, -80]) }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 glass-card p-4 w-72"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🤖</span>
          <div className="text-xs text-ray-purple font-medium">AI Assistant</div>
        </div>
        <div className="text-xs text-ray-muted bg-white/3 rounded-lg p-3 border border-white/5">
          Based on your recent workflow, I suggest scheduling the design review
          for tomorrow at 2pm.
        </div>
      </motion.div>
    </div>
  );
}

export default function Features() {
  return (
    <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <ScrollReveal direction="left">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ray-purple/20 bg-ray-purple/5 mb-6">
              <span className="text-xs text-ray-purple">New in v2.0</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Your command center
              <br />
              <span className="gradient-text-cool">for everything</span>
            </h2>
            <p className="text-ray-muted text-lg leading-relaxed mb-8">
              Raycast brings all your tools together in one fast, beautiful
              interface. Search across apps, control your system, and automate
              workflows — all from your keyboard.
            </p>

            <div className="space-y-4">
              {[
                {
                  title: "Universal Search",
                  desc: "Find files, apps, and contacts instantly",
                },
                {
                  title: "Script Commands",
                  desc: "Automate anything with custom scripts",
                },
                {
                  title: "Floating Notes",
                  desc: "Capture ideas without breaking flow",
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-ray-purple to-ray-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {feature.title}
                    </div>
                    <div className="text-xs text-ray-muted">{feature.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <FeatureShowcase />
        </ScrollReveal>
      </div>
    </section>
  );
}
