"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const shortcuts = [
  { keys: ["C"], label: "Create issue" },
  { keys: ["G", "I"], label: "Go to inbox" },
  { keys: ["G", "M"], label: "Go to my issues" },
  { keys: ["⌘", "K"], label: "Command menu" },
  { keys: ["X"], label: "Mark as done" },
  { keys: ["S"], label: "Set status" },
];

function Key({ char, delay }: { char: string; delay: number }) {
  return (
    <motion.kbd
      className="inline-flex items-center justify-center min-w-[32px] h-8 px-2 glass-strong rounded-lg text-[12px] font-mono text-linear-text-secondary border border-white/[0.08] shadow-[0_2px_0_0_rgba(0,0,0,0.3)]"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{
        y: -2,
        boxShadow: "0 4px 0 0 rgba(0,0,0,0.3), 0 0 20px rgba(124,92,252,0.15)",
        borderColor: "rgba(124,92,252,0.3)",
        transition: { duration: 0.15 },
      }}
      whileTap={{ y: 1, boxShadow: "0 0px 0 0 rgba(0,0,0,0.3)" }}
    >
      {char}
    </motion.kbd>
  );
}

export default function KeyboardShortcuts() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[13px] font-medium text-linear-teal uppercase tracking-widest mb-4">
              Keyboard First
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] gradient-text mb-6">
              Designed for
              <br />
              your keyboard
            </h2>
            <p className="text-linear-text-secondary text-[15px] leading-relaxed mb-8 max-w-md">
              Navigate your entire workflow without touching the mouse. Every action has a shortcut, every view is a keystroke away.
            </p>
            <motion.div
              className="inline-flex items-center gap-3 glass rounded-xl px-5 py-3"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-[13px] text-linear-text-secondary">Press</span>
              <Key char="⌘" delay={0} />
              <Key char="K" delay={0.1} />
              <span className="text-[13px] text-linear-text-secondary">to start</span>
            </motion.div>
          </motion.div>

          {/* Right — shortcut list */}
          <motion.div
            className="glass-strong rounded-2xl p-8 space-y-3"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {shortcuts.map((shortcut, i) => (
              <motion.div
                key={shortcut.label}
                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/[0.03] transition-colors group"
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <span className="text-[13px] text-linear-text-secondary group-hover:text-linear-text transition-colors">
                  {shortcut.label}
                </span>
                <div className="flex items-center gap-1.5">
                  {shortcut.keys.map((key, j) => (
                    <Key key={j} char={key} delay={0.4 + i * 0.08 + j * 0.05} />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
