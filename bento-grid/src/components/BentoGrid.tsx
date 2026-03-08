"use client";

import { motion } from "motion/react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const },
  },
};

export default function BentoGrid() {
  return (
    <div className="min-h-screen py-12 px-4">
      {/* Header */}
      <motion.div
        className="text-center mb-12 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm text-indigo-400 uppercase tracking-[0.3em] mb-4">
          Dashboard
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Bento Grid Layout
        </h1>
        <p className="mt-4 text-zinc-500">
          Asymmetric card layout with animated entrances and hover interactions
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        className="bento-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Card 1: Hero stats — spans 2 cols */}
        <motion.div
          className="bento-card span-2-col flex flex-col justify-between"
          variants={item}
          style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)" }}
        >
          <div>
            <p className="text-xs text-indigo-300/60 uppercase tracking-widest">Total Revenue</p>
            <h2 className="text-5xl font-bold mt-2 bg-gradient-to-r from-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              $48,290
            </h2>
            <p className="text-sm text-indigo-300/40 mt-1">+12.4% from last month</p>
          </div>
          <div className="flex items-end gap-1.5 h-16 mt-4">
            {[40, 65, 45, 80, 60, 90, 70, 85, 55, 95, 75, 88].map((h, i) => (
              <motion.div
                key={i}
                className="chart-bar flex-1"
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              />
            ))}
          </div>
        </motion.div>

        {/* Card 2: Active users */}
        <motion.div className="bento-card" variants={item}>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">Active Users</p>
          <h3 className="text-3xl font-bold mt-3">2,847</h3>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-zinc-900"
                  style={{
                    background: [`#6366f1`, `#a855f7`, `#ec4899`, `#f59e0b`][i],
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-zinc-500">+42 today</span>
          </div>
        </motion.div>

        {/* Card 3: Status */}
        <motion.div className="bento-card" variants={item}>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">System Status</p>
          <div className="mt-4 space-y-3">
            {[
              { name: "API", status: "Operational", color: "#22c55e" },
              { name: "CDN", status: "Operational", color: "#22c55e" },
              { name: "DB", status: "Degraded", color: "#f59e0b" },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">{s.name}</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: s.color, boxShadow: `0 0 8px ${s.color}50` }}
                  />
                  <span className="text-xs text-zinc-500">{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Card 4: Feature showcase — spans 2 cols, 2 rows */}
        <motion.div
          className="bento-card span-2-col span-2-row flex flex-col justify-between"
          variants={item}
        >
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">
              Feature Showcase
            </p>
            <h3 className="text-2xl font-bold tracking-tight">
              Asymmetric layouts create
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}visual hierarchy
              </span>
            </h3>
            <p className="mt-3 text-sm text-zinc-500 leading-relaxed max-w-sm">
              Cards of different sizes guide the eye naturally. Large cards anchor the layout
              while smaller ones provide supporting detail.
            </p>
          </div>

          {/* Interactive grid pattern */}
          <div className="mt-6 grid grid-cols-4 grid-rows-3 gap-2 h-40">
            {Array.from({ length: 12 }).map((_, i) => {
              const special = [0, 1, 4, 5, 10, 11].includes(i);
              return (
                <motion.div
                  key={i}
                  className="rounded-lg border border-zinc-800"
                  style={{
                    background: special
                      ? "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.05))"
                      : "rgba(39,39,42,0.3)",
                  }}
                  whileHover={{
                    scale: 1.05,
                    borderColor: "rgba(99,102,241,0.4)",
                    transition: { duration: 0.2 },
                  }}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Card 5: Quick metric */}
        <motion.div className="bento-card" variants={item}>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">Conversion</p>
          <h3 className="text-3xl font-bold mt-3">
            4.2<span className="text-lg text-zinc-500">%</span>
          </h3>
          <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "42%" }}
              transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Card 6: Quick metric 2 */}
        <motion.div className="bento-card" variants={item}>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">Bounce Rate</p>
          <h3 className="text-3xl font-bold mt-3">
            23<span className="text-lg text-zinc-500">%</span>
          </h3>
          <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-500 to-orange-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "23%" }}
              transition={{ delay: 0.9, duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Card 7: Full width CTA */}
        <motion.div
          className="bento-card span-full animated-gradient flex items-center justify-between"
          variants={item}
          style={{
            background: "linear-gradient(135deg, #1e1b4b, #312e81, #4c1d95, #581c87)",
          }}
        >
          <div>
            <h3 className="text-xl font-bold">Ready to build something stunning?</h3>
            <p className="text-sm text-indigo-300/50 mt-1">
              CSS Grid + Motion stagger = premium bento layouts
            </p>
          </div>
          <div className="flex gap-3">
            {["CSS Grid", "Motion", "Tailwind", "Next.js"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full border border-indigo-400/20 text-xs text-indigo-300/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
