"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const sponsors = [
  { name: "Vercel", tier: "Platinum" },
  { name: "Shopify", tier: "Platinum" },
  { name: "Google", tier: "Gold" },
  { name: "Mozilla", tier: "Gold" },
  { name: "Unity", tier: "Gold" },
  { name: "Epic Games", tier: "Silver" },
  { name: "Figma", tier: "Silver" },
  { name: "GitHub", tier: "Silver" },
  { name: "Cloudflare", tier: "Silver" },
  { name: "Netlify", tier: "Silver" },
];

function LogoPlaceholder({ name, tier }: { name: string; tier: string }) {
  const color = tier === "Platinum" ? "#00d4ff" : tier === "Gold" ? "#f59e0b" : "#94a3b8";
  return (
    <div
      className="flex h-16 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-[#12121a] px-8 transition-all duration-300 hover:border-slate-600"
      style={{ minWidth: "180px" }}
    >
      <span className="text-lg font-bold tracking-wide" style={{ color }}>
        {name}
      </span>
    </div>
  );
}

function Marquee({ items, direction = "left", speed = 30 }: { items: typeof sponsors; direction?: "left" | "right"; speed?: number }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-3">
      <motion.div
        className="flex gap-6"
        animate={{ x: direction === "left" ? [0, -50 * items.length] : [-50 * items.length, 0] }}
        transition={{ x: { repeat: Infinity, repeatType: "loop", duration: speed, ease: "linear" } }}
      >
        {doubled.map((s, i) => (
          <LogoPlaceholder key={`${s.name}-${i}`} name={s.name} tier={s.tier} />
        ))}
      </motion.div>
    </div>
  );
}

export default function Sponsors() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="sponsors" className="relative py-32 px-4" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-4 inline-block text-sm font-medium tracking-widest text-pink-400 uppercase">
            Partners
          </span>
          <h2 className="text-4xl font-black text-white md:text-6xl">
            Our{" "}
            <span className="bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Sponsors
            </span>
          </h2>
        </motion.div>
        <Marquee items={sponsors.filter((s) => s.tier === "Platinum" || s.tier === "Gold")} direction="left" speed={25} />
        <Marquee items={sponsors.filter((s) => s.tier === "Silver")} direction="right" speed={35} />
      </div>
    </section>
  );
}
