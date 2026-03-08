"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const shortcuts = [
  { keys: ["C"], label: "Create issue", description: "Instantly create a new issue from anywhere" },
  { keys: ["G", "I"], label: "Go to inbox", description: "Jump to your inbox with unread notifications" },
  { keys: ["⌘", "K"], label: "Command palette", description: "Search everything — issues, projects, settings" },
  { keys: ["X"], label: "Select issue", description: "Toggle selection for bulk actions" },
  { keys: ["S"], label: "Set status", description: "Change issue status without opening it" },
  { keys: ["⌘", "⇧", "P"], label: "Set priority", description: "Assign priority in one keystroke" },
];

function KeyboardKey({ char, pressed }: { char: string; pressed: boolean }) {
  return (
    <motion.span
      animate={{
        scale: pressed ? 0.9 : 1,
        backgroundColor: pressed ? "rgba(99, 102, 241, 0.2)" : "rgba(39, 39, 42, 0.8)",
        borderColor: pressed ? "rgba(99, 102, 241, 0.4)" : "rgba(63, 63, 70, 0.6)",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="kbd"
    >
      {char}
    </motion.span>
  );
}

export default function KeyboardShortcuts() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPressed(true);
      setTimeout(() => {
        setPressed(false);
        setTimeout(() => {
          setActiveIndex((prev) => (prev + 1) % shortcuts.length);
        }, 300);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="shortcuts" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-widest text-accent-light mb-3 font-medium">Keyboard-first</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gradient mb-4">
              Your hands never leave the keyboard
            </h2>
            <p className="text-muted mb-8 leading-relaxed">
              Every single action in Aurora has a keyboard shortcut. Navigate, create, update,
              and manage your entire workflow without ever reaching for the mouse.
            </p>

            {/* Active shortcut display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-1.5">
                    {shortcuts[activeIndex].keys.map((key) => (
                      <KeyboardKey key={key} char={key} pressed={pressed} />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{shortcuts[activeIndex].label}</span>
                </div>
                <p className="text-xs text-muted">{shortcuts[activeIndex].description}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right side - Shortcut list */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            {shortcuts.map((shortcut, i) => (
              <motion.button
                key={shortcut.label}
                onClick={() => setActiveIndex(i)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  i === activeIndex
                    ? "glass border-accent/20 bg-accent/5"
                    : "hover:bg-white/5"
                }`}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {shortcut.keys.map((key) => (
                      <span key={key} className="kbd text-[10px] min-w-[22px] h-[22px]">
                        {key}
                      </span>
                    ))}
                  </div>
                  <span className={`text-sm ${i === activeIndex ? "text-foreground" : "text-muted"}`}>
                    {shortcut.label}
                  </span>
                </div>
                <motion.div
                  animate={{ opacity: i === activeIndex ? 1 : 0 }}
                  className="w-1.5 h-1.5 rounded-full bg-accent"
                />
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
