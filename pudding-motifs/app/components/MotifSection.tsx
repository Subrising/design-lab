"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Motif } from "./motif-data";
import { AudioEngine } from "./AudioEngine";
import StaffNotation from "./StaffNotation";
import IntervalChart from "./IntervalChart";

interface MotifSectionProps {
  motif: Motif;
  index: number;
  audioEngine: AudioEngine | null;
}

export default function MotifSection({
  motif,
  index,
  audioEngine,
}: MotifSectionProps) {
  const [activeNote, setActiveNote] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handlePlay = useCallback(() => {
    if (!audioEngine || isPlaying) return;
    setIsPlaying(true);
    setActiveNote(0);

    audioEngine.playMotif(motif, (noteIndex) => {
      setActiveNote(noteIndex);
      if (noteIndex === motif.notes.length - 1) {
        setTimeout(() => {
          setIsPlaying(false);
          setActiveNote(-1);
        }, 800);
      }
    });
  }, [audioEngine, motif, isPlaying]);

  const isEven = index % 2 === 0;

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center py-20"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
      }}
    >
      <div
        className={`max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
          isEven ? "" : "direction-rtl"
        }`}
        style={isEven ? {} : { direction: "rtl" }}
      >
        {/* Text side */}
        <div style={{ direction: "ltr" }}>
          <div className="flex items-baseline gap-3 mb-4">
            <span
              className="font-mono text-sm tracking-widest uppercase"
              style={{ color: motif.color }}
            >
              Motif {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-sm text-[var(--color-muted)]">
              {motif.year}
            </span>
          </div>

          <h2
            className="font-serif text-4xl md:text-5xl font-bold mb-2 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {motif.composer}
          </h2>

          <h3
            className="text-xl md:text-2xl mb-6 italic"
            style={{
              color: motif.color,
              fontFamily: "var(--font-serif)",
            }}
          >
            {motif.piece}
          </h3>

          <p
            className="text-lg leading-relaxed mb-8 editorial-drop-cap"
            style={{
              color: "var(--color-ink)",
              maxWidth: "42ch",
            }}
          >
            {motif.description}
          </p>

          {/* Play button */}
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className="group flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all duration-300 cursor-pointer"
            style={{
              borderColor: motif.color,
              color: isPlaying ? "white" : motif.color,
              backgroundColor: isPlaying ? motif.color : "transparent",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {isPlaying ? (
                <>
                  <rect x="4" y="3" width="4" height="14" rx="1" />
                  <rect x="12" y="3" width="4" height="14" rx="1" />
                </>
              ) : (
                <polygon points="5,3 17,10 5,17" />
              )}
            </svg>
            <span className="font-mono text-sm tracking-wide">
              {isPlaying ? "Playing..." : "Play Motif"}
            </span>
          </button>

          {/* Quick stats */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { label: "Notes", value: motif.notes.length },
              { label: "Range", value: `${motif.range} st` },
              { label: "Density", value: `${motif.rhythmicDensity}/s` },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="font-mono text-2xl font-bold"
                  style={{ color: motif.color }}
                >
                  {stat.value}
                </div>
                <div className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual side */}
        <div className="space-y-8" style={{ direction: "ltr" }}>
          {/* Staff notation */}
          <div className="bg-white/50 rounded-2xl p-6 backdrop-blur-sm border border-[var(--color-staff)]/30">
            <div className="font-mono text-xs text-[var(--color-muted)] mb-3 uppercase tracking-widest">
              Notation
            </div>
            <StaffNotation motif={motif} activeNoteIndex={activeNote} />
          </div>

          {/* Interval chart */}
          <div className="bg-white/50 rounded-2xl p-6 backdrop-blur-sm border border-[var(--color-staff)]/30">
            <div className="font-mono text-xs text-[var(--color-muted)] mb-3 uppercase tracking-widest">
              Interval Pattern
            </div>
            <IntervalChart motif={motif} isVisible={isVisible} />
          </div>
        </div>
      </div>
    </section>
  );
}
