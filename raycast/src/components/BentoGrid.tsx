"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

interface BentoCardProps {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  glowClass: string;
  className?: string;
  children?: React.ReactNode;
}

function BentoCard({
  title,
  description,
  icon,
  gradient,
  glowClass,
  className = "",
  children,
}: BentoCardProps) {
  return (
    <div className={`glass-card ${glowClass} p-6 sm:p-8 flex flex-col ${className}`}>
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl mb-5`}
      >
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-ray-muted leading-relaxed mb-4">
        {description}
      </p>
      {children && <div className="mt-auto">{children}</div>}
    </div>
  );
}

function KeyboardShortcutDemo() {
  const keys = ["⌘", "⇧", "K"];
  return (
    <div className="flex items-center gap-2 mt-2">
      {keys.map((key, i) => (
        <motion.kbd
          key={key}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.1 }}
          className="px-3 py-2 text-sm font-mono text-white bg-white/5 border border-white/10 rounded-lg"
        >
          {key}
        </motion.kbd>
      ))}
    </div>
  );
}

function ExtensionGrid() {
  const extensions = [
    { name: "GitHub", color: "from-white/10 to-white/5" },
    { name: "Linear", color: "from-indigo-500/20 to-indigo-500/5" },
    { name: "Figma", color: "from-purple-500/20 to-purple-500/5" },
    { name: "Notion", color: "from-white/10 to-white/5" },
    { name: "Slack", color: "from-green-500/20 to-green-500/5" },
    { name: "Vercel", color: "from-white/10 to-white/5" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 mt-2">
      {extensions.map((ext, i) => (
        <motion.div
          key={ext.name}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.06 }}
          className={`bg-gradient-to-br ${ext.color} border border-white/5 rounded-lg p-2.5 text-center`}
        >
          <span className="text-[10px] text-ray-muted">{ext.name}</span>
        </motion.div>
      ))}
    </div>
  );
}

function SpeedMeter() {
  return (
    <div className="mt-2 space-y-3">
      {[
        { label: "App launch", value: "92ms", width: "15%" },
        { label: "Search", value: "4ms", width: "5%" },
        { label: "Clipboard", value: "12ms", width: "8%" },
      ].map((item) => (
        <div key={item.label}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-ray-muted">{item.label}</span>
            <span className="text-ray-green font-mono">{item.value}</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: item.width }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-gradient-to-r from-ray-green to-ray-blue rounded-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function AIPreview() {
  return (
    <div className="mt-2 space-y-2">
      {[
        { role: "user", text: "Summarize my last 3 meetings" },
        {
          role: "ai",
          text: "Here's a summary of your recent meetings: Design review focused on the new dashboard...",
        },
      ].map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.15 }}
          className={`px-3 py-2 rounded-lg text-xs ${
            msg.role === "user"
              ? "bg-ray-purple/10 border border-ray-purple/20 text-ray-purple ml-8"
              : "bg-white/5 border border-white/5 text-ray-muted mr-8"
          }`}
        >
          {msg.text}
        </motion.div>
      ))}
    </div>
  );
}

export default function BentoGrid() {
  return (
    <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            Designed for <span className="gradient-text">speed</span>
          </h2>
          <p className="text-ray-muted text-lg max-w-2xl mx-auto">
            Every feature is built with performance in mind. No compromises.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Large card - spans 2 cols */}
        <ScrollReveal className="lg:col-span-2" delay={0}>
          <BentoCard
            title="Lightning Fast Search"
            description="Find anything on your Mac in milliseconds. Applications, files, bookmarks, and more — all instantly accessible."
            icon="⚡"
            gradient="from-ray-yellow to-ray-orange"
            glowClass=""
            className="h-full"
          >
            <SpeedMeter />
          </BentoCard>
        </ScrollReveal>

        {/* Keyboard shortcuts */}
        <ScrollReveal delay={0.1}>
          <BentoCard
            title="Keyboard First"
            description="Navigate everything without touching your mouse. Custom hotkeys for every action."
            icon="⌨️"
            gradient="from-ray-pink to-ray-purple"
            glowClass="glow-pink"
          >
            <KeyboardShortcutDemo />
          </BentoCard>
        </ScrollReveal>

        {/* Extensions */}
        <ScrollReveal delay={0.15}>
          <BentoCard
            title="Extensions"
            description="Hundreds of community extensions. Connect your favorite tools."
            icon="🧩"
            gradient="from-ray-blue to-ray-purple"
            glowClass="glow-blue"
          >
            <ExtensionGrid />
          </BentoCard>
        </ScrollReveal>

        {/* AI card - spans 2 cols */}
        <ScrollReveal className="lg:col-span-2" delay={0.2}>
          <BentoCard
            title="AI Built In"
            description="Ask questions, summarize content, generate code, and more — all powered by the latest AI models, right in your launcher."
            icon="🤖"
            gradient="from-ray-purple to-ray-blue"
            glowClass="glow-purple"
            className="h-full"
          >
            <AIPreview />
          </BentoCard>
        </ScrollReveal>

        {/* Clipboard */}
        <ScrollReveal delay={0}>
          <BentoCard
            title="Clipboard History"
            description="Never lose copied content again. Search through your entire clipboard history instantly."
            icon="📋"
            gradient="from-ray-green to-ray-blue"
            glowClass=""
          />
        </ScrollReveal>

        {/* Snippets */}
        <ScrollReveal delay={0.05}>
          <BentoCard
            title="Snippets"
            description="Create text shortcuts that expand anywhere. Dynamic variables for dates, times, and more."
            icon="✂️"
            gradient="from-ray-orange to-ray-yellow"
            glowClass=""
          />
        </ScrollReveal>

        {/* Window management - spans full width on lg */}
        <ScrollReveal className="lg:col-span-1" delay={0.1}>
          <BentoCard
            title="Window Management"
            description="Organize your workspace with powerful window controls. Snap, resize, and arrange with ease."
            icon="🪟"
            gradient="from-ray-pink to-ray-orange"
            glowClass="glow-pink"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
