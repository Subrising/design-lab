"use client";

import { motion } from "motion/react";
import GravityDrop from "./GravityDrop";
import ScrollVelocityText from "./ScrollVelocityText";
import MagneticChars from "./MagneticChars";
import WaveText from "./WaveText";
import ExplodeText from "./ExplodeText";
import StrokeReveal from "./StrokeReveal";
import MarqueeStrip from "./MarqueeStrip";

function SectionLabel({ label, num }: { label: string; num: string }) {
  return (
    <motion.div
      className="flex items-center gap-4 mb-8"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-xs font-mono text-zinc-600">{num}</span>
      <div className="h-px flex-1 bg-zinc-800" />
      <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
        {label}
      </span>
    </motion.div>
  );
}

export default function KineticTypography() {
  return (
    <div className="min-h-screen">
      {/* Hero — Gravity Drop */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        <motion.p
          className="text-xs uppercase tracking-[0.4em] text-zinc-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Design Experiment
        </motion.p>

        <GravityDrop
          text="KINETIC"
          className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none"
        />
        <GravityDrop
          text="TYPOGRAPHY"
          className="text-4xl md:text-6xl font-light tracking-[0.2em] text-zinc-400 mt-2"
        />

        <motion.p
          className="mt-12 text-sm text-zinc-600 max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          Text that moves, reacts, and transforms. Scroll to explore.
        </motion.p>

        <motion.div
          className="absolute bottom-12"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-zinc-700 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-zinc-500" />
          </div>
        </motion.div>
      </section>

      {/* Marquee Strips */}
      <section className="py-4 space-y-2 border-y border-zinc-900">
        <MarqueeStrip
          text="MOTION DESIGN"
          speed={25}
          className="text-6xl md:text-8xl font-black text-zinc-100/5"
        />
        <MarqueeStrip
          text="CREATIVE CODE"
          speed={30}
          reverse
          outlined
          className="text-6xl md:text-8xl font-black"
        />
      </section>

      {/* Scroll Velocity Warp */}
      <section className="py-32 px-4 max-w-6xl mx-auto">
        <SectionLabel label="Velocity Warp" num="01" />
        <ScrollVelocityText
          text="SCROLL FASTER AND WATCH THE TEXT SKEW IN REAL TIME"
          className="text-5xl md:text-8xl font-black tracking-tight"
        />
        <ScrollVelocityText
          text="THE FASTER YOU SCROLL THE MORE IT WARPS"
          className="text-3xl md:text-5xl font-light tracking-wide text-zinc-500 mt-4"
        />
      </section>

      {/* Wave Distortion */}
      <section className="py-32 px-4 max-w-4xl mx-auto">
        <SectionLabel label="Wave Distortion" num="02" />
        <WaveText
          text="RIDING THE SINE WAVE"
          className="text-5xl md:text-7xl font-black tracking-tight"
        />
        <motion.p
          className="text-center text-sm text-zinc-600 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Each character oscillates independently based on scroll progress and its index
        </motion.p>
      </section>

      {/* Stroke Reveal */}
      <section className="py-32 px-4">
        <SectionLabel label="Stroke Draw" num="03" />
        <StrokeReveal text="DRAWN BY SCROLL" />
        <motion.p
          className="text-center text-sm text-zinc-600 mt-8 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          SVG stroke-dashoffset animated by ScrollTrigger scrub — the path draws as you scroll
        </motion.p>
      </section>

      {/* Magnetic Characters */}
      <section className="py-32 px-4 max-w-4xl mx-auto">
        <SectionLabel label="Magnetic Repel" num="04" />
        <MagneticChars
          text="MOVE YOUR CURSOR OVER THESE CHARACTERS"
          className="text-3xl md:text-5xl font-bold tracking-tight leading-relaxed"
          radius={120}
          strength={35}
        />
        <motion.p
          className="text-center text-sm text-zinc-600 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Characters repel from cursor using distance-based force calculation at 60fps
        </motion.p>
      </section>

      {/* Explode Text */}
      <section className="py-32 px-4 max-w-4xl mx-auto">
        <SectionLabel label="Explode / Reform" num="05" />
        <ExplodeText
          text="CLICK TO EXPLODE"
          className="text-5xl md:text-8xl font-black tracking-tight"
        />
        <motion.p
          className="text-center text-sm text-zinc-600 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Click to scatter — click again to reform with elastic easing
        </motion.p>
      </section>

      {/* Footer Marquee */}
      <section className="py-16 border-t border-zinc-900">
        <MarqueeStrip
          text="GSAP + MOTION + NEXT.JS"
          speed={35}
          className="text-4xl md:text-6xl font-black text-zinc-100/5"
        />
        <div className="text-center mt-8">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">
            Design Lab — Kinetic Typography
          </p>
          <div className="flex gap-3 justify-center mt-4">
            {["GSAP", "ScrollTrigger", "Motion", "rAF"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full border border-zinc-800 text-xs text-zinc-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
