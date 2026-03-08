"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const timelineItems = [
  {
    time: "9:00 AM",
    user: "Sarah",
    action: "created issue",
    detail: "Implement dark mode toggle",
    color: "bg-emerald-400",
  },
  {
    time: "9:15 AM",
    user: "Marcus",
    action: "moved to",
    detail: "In Progress",
    color: "bg-accent",
  },
  {
    time: "9:32 AM",
    user: "Sarah",
    action: "linked PR",
    detail: "#247 — feat: dark mode",
    color: "bg-purple-400",
  },
  {
    time: "10:01 AM",
    user: "CI Bot",
    action: "checks passed",
    detail: "All 142 tests green",
    color: "bg-emerald-400",
  },
  {
    time: "10:15 AM",
    user: "Marcus",
    action: "marked as",
    detail: "Done",
    color: "bg-blue-400",
  },
];

export default function ProductShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const leftX = useTransform(scrollYProgress, [0, 0.5], [-60, 0]);
  const rightX = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
  const centerScale = useTransform(scrollYProgress, [0.1, 0.4], [0.9, 1]);
  const centerOpacity = useTransform(scrollYProgress, [0.05, 0.3], [0, 1]);

  return (
    <section id="product" ref={ref} className="py-32 relative overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-xs uppercase tracking-widest text-accent-light mb-3 font-medium">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gradient mb-4">
            From idea to shipped, in minutes
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Watch your team&apos;s workflow come alive with real-time activity streams
            and automatic status updates.
          </p>
        </motion.div>

        {/* Product showcase cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left card - Cycle metrics */}
          <motion.div style={{ x: leftX }} className="glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              Cycle Progress
            </h3>
            <div className="space-y-4">
              {[
                { label: "Completed", value: 73, color: "bg-emerald-400" },
                { label: "In Progress", value: 18, color: "bg-accent" },
                { label: "Remaining", value: 9, color: "bg-zinc-600" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted">{item.label}</span>
                    <span className="text-foreground font-medium">{item.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">4.2</span>
                <span className="text-xs text-muted">days avg cycle time</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-emerald-400">
                  <path d="M6 9V3M6 3L3 6M6 3L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-xs text-emerald-400">23% faster</span>
                <span className="text-xs text-muted">than last cycle</span>
              </div>
            </div>
          </motion.div>

          {/* Center card - Activity timeline */}
          <motion.div style={{ scale: centerScale, opacity: centerOpacity }} className="glass rounded-2xl p-6 glow-accent">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Live Activity
            </h3>
            <div className="space-y-0">
              {timelineItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex gap-3 py-3 group"
                >
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full ${item.color} mt-1.5 ring-2 ring-background`} />
                    {i < timelineItems.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-1" />
                    )}
                  </div>

                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium">{item.user}</span>
                      <span className="text-xs text-muted">{item.action}</span>
                    </div>
                    <p className="text-xs text-muted/80">{item.detail}</p>
                    <span className="text-[10px] text-muted/50 mt-1 block">{item.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right card - Team view */}
          <motion.div style={{ x: rightX }} className="glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              Team
            </h3>
            <div className="space-y-3">
              {[
                { name: "Sarah Chen", role: "Engineering", issues: 12, avatar: "SC" },
                { name: "Marcus Johnson", role: "Design", issues: 8, avatar: "MJ" },
                { name: "Aiko Tanaka", role: "Product", issues: 15, avatar: "AT" },
                { name: "Jake Morris", role: "Backend", issues: 6, avatar: "JM" },
              ].map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-purple-500/30 flex items-center justify-center text-[10px] font-medium">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">{member.name}</p>
                    <p className="text-[10px] text-muted">{member.role}</p>
                  </div>
                  <span className="text-xs text-muted">{member.issues} issues</span>
                </motion.div>
              ))}
            </div>

            {/* Online indicator */}
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
              <div className="flex -space-x-2">
                {["SC", "MJ", "AT"].map((avatar) => (
                  <div key={avatar} className="w-6 h-6 rounded-full bg-accent/20 border-2 border-background flex items-center justify-center text-[8px] font-medium text-accent-light">
                    {avatar}
                  </div>
                ))}
              </div>
              <span className="text-xs text-muted">3 online now</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
