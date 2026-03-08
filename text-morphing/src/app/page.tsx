"use client";

import dynamic from "next/dynamic";

const SpotlightReveal = dynamic(() => import("@/components/SpotlightReveal"), { ssr: false });
const TextScramble = dynamic(() => import("@/components/TextScramble"), { ssr: false });
const Typewriter = dynamic(() => import("@/components/Typewriter"), { ssr: false });
const SplitText = dynamic(() => import("@/components/SplitText"), { ssr: false });
const HoverChars = dynamic(() => import("@/components/HoverChars"), { ssr: false });
const GlitchText = dynamic(() => import("@/components/GlitchText"), { ssr: false });

export default function Home() {
  return (
    <main className="relative">
      {/* Section 1: Spotlight Mask Reveal */}
      <SpotlightReveal />

      {/* Section 2: Text Scramble */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        <div className="absolute top-12 left-8 text-xs text-white/20 uppercase tracking-widest">
          02 / Text Scramble
        </div>
        <p className="text-sm text-indigo-400 uppercase tracking-[0.3em] mb-6">
          Randomized Character Transition
        </p>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-center max-w-4xl">
          <TextScramble
            phrases={[
              "Design is intelligence made visible",
              "Motion creates emotion",
              "Every pixel has purpose",
              "Craft the impossible",
            ]}
          />
        </h2>
        <p className="mt-8 text-white/30 text-center max-w-lg">
          Characters scramble through random glyphs before settling into the target phrase.
          Each letter resolves left-to-right, creating a wave of clarity.
        </p>
      </section>

      {/* Section 3: Typewriter */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent">
        <div className="absolute top-12 left-8 text-xs text-white/20 uppercase tracking-widest">
          03 / Typewriter
        </div>
        <p className="text-sm text-purple-400 uppercase tracking-[0.3em] mb-6">
          Character-by-Character Reveal
        </p>
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            We build{" "}
            <Typewriter
              words={["experiences", "interactions", "animations", "interfaces", "the future"]}
              className="gradient-text"
            />
          </h2>
        </div>
        <p className="mt-8 text-white/30 text-center max-w-lg">
          Classic typewriter with variable-speed typing, smooth deletion, and a blinking cursor.
          Each word cycles with configurable pause duration.
        </p>
      </section>

      {/* Section 4: Split Text / Per-Character Animation */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        <div className="absolute top-12 left-8 text-xs text-white/20 uppercase tracking-widest">
          04 / Split Text
        </div>
        <p className="text-sm text-pink-400 uppercase tracking-[0.3em] mb-6">
          Scroll-Triggered Character Animation
        </p>
        <SplitText
          text="Characters cascade"
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-center"
        />
        <SplitText
          text="into existence"
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter gradient-text text-center mt-2"
          delay={0.2}
        />
        <div className="mt-12 max-w-lg text-center">
          <SplitText
            text="Each character rotates in 3D from below, with staggered timing creating a wave effect."
            as="p"
            className="text-white/30 text-lg leading-relaxed"
            delay={0.4}
            stagger={0.01}
          />
        </div>
      </section>

      {/* Section 5: Hover Characters + Glitch */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
        <div className="absolute top-12 left-8 text-xs text-white/20 uppercase tracking-widest">
          05 / Interactive Text
        </div>
        <p className="text-sm text-rose-400 uppercase tracking-[0.3em] mb-6">
          Hover & Interaction Effects
        </p>

        {/* Hover chars */}
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-center mb-8">
          <HoverChars text="Hover each letter" />
        </h2>

        {/* Glitch text */}
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-center mb-8">
          <GlitchText text="Trigger Glitch" className="gradient-text" />
        </h2>

        {/* Text stroke fills on hover */}
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-center text-stroke">
          Stroke to Fill
        </h2>

        <p className="mt-12 text-white/30 text-center max-w-lg">
          Three interactive text effects: per-character hover lift, chromatic glitch on mouse enter,
          and CSS text-stroke that fills with color on hover.
        </p>
      </section>

      {/* Section 6: Techniques Reference */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full">
          {[
            { name: "Clip-Path Mask", tech: "CSS clip-path: circle() positioned at cursor coordinates", icon: "◉" },
            { name: "Text Scramble", tech: "Random char cycling with left-to-right resolution wave", icon: "⟳" },
            { name: "Typewriter", tech: "setTimeout-based character reveal with deletion phase", icon: "▌" },
            { name: "Split Text", tech: "GSAP per-character animation with ScrollTrigger", icon: "◇" },
            { name: "Hover Chars", tech: "CSS transition-delay cascading on :hover state", icon: "↑" },
            { name: "Glitch Effect", tech: "Clip-path strips with RGB-shifted duplicate layers", icon: "⚡" },
          ].map((t, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="text-2xl text-indigo-400 mb-3">{t.icon}</div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-1">{t.name}</h3>
              <p className="text-xs text-white/30 leading-relaxed">{t.tech}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex gap-3 flex-wrap justify-center">
          {["clip-path", "GSAP", "ScrollTrigger", "CSS transitions", "requestAnimationFrame"].map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full border border-white/5 text-xs text-white/20">
              {tag}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
