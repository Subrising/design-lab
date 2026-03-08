"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const GlowGrid = dynamic(() => import("@/components/GlowGrid"), { ssr: false });
const CursorTrail = dynamic(() => import("@/components/CursorTrail"), { ssr: false });
const MagneticButton = dynamic(() => import("@/components/MagneticButton"), { ssr: false });
const MagneticNav = dynamic(() => import("@/components/MagneticNav"), { ssr: false });

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center">
      <GlowGrid />
      <CursorTrail />
      <CustomCursor />
      <MagneticNav />

      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Hero text */}
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-400 mb-6">
          Interactive Experience
        </p>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none">
          <span className="block text-white/90">Move your</span>
          <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            cursor
          </span>
        </h1>

        <p className="mt-8 text-lg md:text-xl text-white/40 max-w-xl mx-auto leading-relaxed">
          Watch the grid illuminate. Feel the magnetic pull on buttons and
          navigation. See particles trail behind your movement.
        </p>

        {/* Magnetic buttons */}
        <div className="mt-12 flex gap-6 justify-center flex-wrap">
          <MagneticButton strength={0.4}>
            Explore
          </MagneticButton>
          <MagneticButton strength={0.3} className="!border-indigo-500/30">
            Learn More
          </MagneticButton>
        </div>

        {/* Feature cards */}
        <div className="mt-24 grid md:grid-cols-3 gap-6 text-left">
          {[
            {
              title: "Glow Grid",
              desc: "400 cells respond to cursor proximity with distance-based intensity mapping.",
              icon: "◫",
            },
            {
              title: "Magnetic Pull",
              desc: "Buttons and nav items are attracted toward your cursor using lerp-based interpolation.",
              icon: "⊛",
            },
            {
              title: "Particle Trail",
              desc: "Canvas-rendered particles spawn based on cursor velocity, with physics-based decay.",
              icon: "✦",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-indigo-500/20 transition-colors"
              data-magnetic
            >
              <div className="text-3xl mb-4 text-indigo-400">{card.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Tech tags */}
        <div className="mt-16 flex gap-3 justify-center flex-wrap">
          {["requestAnimationFrame", "Canvas API", "lerp()", "Distance Mapping", "Next.js 15"].map(
            (tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full border border-white/5 text-xs text-white/30"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>
    </main>
  );
}
