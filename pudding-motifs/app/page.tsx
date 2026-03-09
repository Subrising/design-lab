"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motifs } from "./components/motif-data";
import { AudioEngine } from "./components/AudioEngine";
import MotifSection from "./components/MotifSection";
import ComparisonRadar from "./components/ComparisonRadar";
import TimelineChart from "./components/TimelineChart";
import ScrollProgress from "./components/ScrollProgress";

export default function Home() {
  const [audioEngine, setAudioEngine] = useState<AudioEngine | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [comparisonVisible, setComparisonVisible] = useState(false);
  const [timelineVisible, setTimelineVisible] = useState(false);
  const comparisonRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLElement>(null);

  // Initialize audio on first interaction
  const enableAudio = useCallback(() => {
    if (audioEngine) return;
    const engine = new AudioEngine();
    engine.init();
    setAudioEngine(engine);
    setAudioEnabled(true);
  }, [audioEngine]);

  // Intersection observers for comparison and timeline sections
  useEffect(() => {
    const compEl = comparisonRef.current;
    const timeEl = timelineRef.current;
    if (!compEl || !timeEl) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === compEl) setComparisonVisible(entry.isIntersecting);
          if (entry.target === timeEl) setTimelineVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );

    obs.observe(compEl);
    obs.observe(timeEl);
    return () => obs.disconnect();
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioEngine?.destroy();
    };
  }, [audioEngine]);

  return (
    <main className="relative">
      <ScrollProgress />

      {/* ─── HERO ─── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Decorative staff lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          preserveAspectRatio="none"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={`${(i + 1) * 5}%`}
              x2="100%"
              y2={`${(i + 1) * 5}%`}
              stroke="var(--color-ink)"
              strokeWidth="1"
            />
          ))}
        </svg>

        <div className="text-center relative z-10">
          <p
            className="font-mono text-sm tracking-[0.3em] uppercase mb-6"
            style={{ color: "var(--color-muted)" }}
          >
            A Visual Essay
          </p>

          <h1
            className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-[0.9]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            The Shape
            <br />
            <span
              className="italic font-normal"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-beethoven), var(--color-bach), var(--color-mozart), var(--color-debussy))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              of Music
            </span>
          </h1>

          <p
            className="text-lg md:text-xl max-w-lg mx-auto mb-12 leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            How four notes can define a symphony. An interactive exploration of
            musical motifs — the DNA of classical composition.
          </p>

          {/* Audio enable button */}
          {!audioEnabled ? (
            <button
              onClick={enableAudio}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-all duration-300 cursor-pointer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
              </svg>
              <span className="font-mono text-sm tracking-wide">
                Enable Audio & Begin
              </span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              <span className="font-mono text-sm">Audio active — scroll to explore</span>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "var(--color-muted)" }}
          >
            Scroll
          </span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4v12M4 10l6 6 6-6"
              stroke="var(--color-muted)"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </section>

      {/* ─── INTRO TEXT ─── */}
      <section className="max-w-2xl mx-auto px-6 py-24">
        <p
          className="text-xl leading-relaxed editorial-drop-cap"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Every great symphony begins with an idea — a handful of notes that
          carry the weight of an entire musical universe. Composers call these
          ideas <em>motifs</em>: short melodic or rhythmic figures that recur,
          transform, and develop throughout a work.
        </p>
        <p
          className="text-lg leading-relaxed mt-6"
          style={{ color: "var(--color-muted)" }}
        >
          But what do these motifs actually look like when we strip away the
          performance and reduce them to their essential shapes? What patterns
          emerge when we compare the musical DNA of Bach, Beethoven, Mozart, and
          Debussy?
        </p>
      </section>

      {/* ─── DIVIDER ─── */}
      <div className="flex justify-center py-8">
        <svg width="200" height="2" viewBox="0 0 200 2">
          <line
            x1="0"
            y1="1"
            x2="200"
            y2="1"
            stroke="var(--color-staff)"
            strokeWidth="1"
          />
          <circle cx="100" cy="1" r="3" fill="var(--color-accent)" />
        </svg>
      </div>

      {/* ─── TIMELINE ─── */}
      <section
        ref={timelineRef}
        className="py-20 px-6"
        style={{
          opacity: timelineVisible ? 1 : 0,
          transform: timelineVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s, transform 0.8s",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-serif text-3xl md:text-4xl font-bold text-center mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Two Centuries of Motifs
          </h2>
          <p className="text-center text-[var(--color-muted)] mb-10 max-w-md mx-auto">
            From the mathematical precision of the Baroque to the
            color-drenched haze of Impressionism.
          </p>
          <TimelineChart isVisible={timelineVisible} />
        </div>
      </section>

      {/* ─── MOTIF SECTIONS ─── */}
      {motifs.map((motif, i) => (
        <MotifSection
          key={motif.id}
          motif={motif}
          index={i}
          audioEngine={audioEngine}
        />
      ))}

      {/* ─── COMPARISON ─── */}
      <section
        ref={comparisonRef}
        className="py-24 px-6"
        style={{
          opacity: comparisonVisible ? 1 : 0,
          transform: comparisonVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s, transform 0.8s",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-serif text-3xl md:text-4xl font-bold text-center mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Comparing Musical DNA
          </h2>
          <p className="text-center text-[var(--color-muted)] mb-10 max-w-md mx-auto">
            Each composer&apos;s motif reveals a unique fingerprint — density,
            range, intervallic leaps, and duration paint distinct musical
            personalities.
          </p>
          <ComparisonRadar isVisible={comparisonVisible} />
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-20 px-6 border-t border-[var(--color-staff)]/30">
        <div className="max-w-2xl mx-auto text-center">
          <p
            className="font-serif text-2xl mb-4 italic"
            style={{ fontFamily: "var(--font-serif)", color: "var(--color-muted)" }}
          >
            &ldquo;Music is the arithmetic of sounds as optics is the geometry
            of light.&rdquo;
          </p>
          <p className="font-mono text-sm text-[var(--color-muted)]">
            — Claude Debussy
          </p>

          <div className="mt-12 flex justify-center gap-6">
            {motifs.map((m) => (
              <div
                key={m.id}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: m.color }}
              />
            ))}
          </div>

          <p className="mt-8 font-mono text-xs text-[var(--color-muted)]">
            Built with D3.js · Web Audio API · Next.js · Tailwind CSS
          </p>
        </div>
      </footer>
    </main>
  );
}
