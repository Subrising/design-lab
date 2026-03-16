"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { BrandedProgress } from "./BrandedProgress";

// ─── Brand Themes ────────────────────────────────────────────────────────────

interface Theme {
  id: string;
  name: string;
  fill: string;
  fill2: string;
  glow: string;
  track: string;
}

const THEMES: Theme[] = [
  {
    id: "oxide",
    name: "OXIDE",
    fill: "#f59e0b",
    fill2: "#fcd34d",
    glow: "rgba(245,158,11,0.4)",
    track: "rgba(245,158,11,0.08)",
  },
  {
    id: "plasma",
    name: "PLASMA",
    fill: "#06b6d4",
    fill2: "#67e8f9",
    glow: "rgba(6,182,212,0.4)",
    track: "rgba(6,182,212,0.08)",
  },
  {
    id: "ember",
    name: "EMBER",
    fill: "#f43f5e",
    fill2: "#fb7185",
    glow: "rgba(244,63,94,0.4)",
    track: "rgba(244,63,94,0.08)",
  },
  {
    id: "mire",
    name: "MIRE",
    fill: "#10b981",
    fill2: "#34d399",
    glow: "rgba(16,185,129,0.4)",
    track: "rgba(16,185,129,0.08)",
  },
  {
    id: "iris",
    name: "IRIS",
    fill: "#8b5cf6",
    fill2: "#a78bfa",
    glow: "rgba(139,92,246,0.4)",
    track: "rgba(139,92,246,0.08)",
  },
];

function applyTheme(theme: Theme) {
  const r = document.documentElement.style;
  r.setProperty("--p-fill", theme.fill);
  r.setProperty("--p-fill-2", theme.fill2);
  r.setProperty("--p-glow", theme.glow);
  r.setProperty("--p-track", theme.track);
}

// ─── Demo Component ──────────────────────────────────────────────────────────

export default function ProgressDemo() {
  const [activeTheme, setActiveTheme] = useState(0);

  // Live mission progress — cycles 0 → 100 over ~7s
  const [mission, setMission] = useState(0);
  const missionRef = useRef(0);

  // Upload / transform / deploy streams
  const [upload, setUpload] = useState(34);
  const [transform, setTransform] = useState(67);
  const [deploy, setDeploy] = useState(12);
  const deployRef = useRef(12);

  // System vitals — oscillate independently
  const [cpu, setCpu] = useState(62);
  const [ram, setRam] = useState(48);
  const [net, setNet] = useState(23);

  // Variant showcase — shared value
  const [showcase, setShowcase] = useState(68);

  const handleTheme = useCallback((idx: number) => {
    setActiveTheme(idx);
    applyTheme(THEMES[idx]);
  }, []);

  // Mission counter
  useEffect(() => {
    const id = setInterval(() => {
      missionRef.current = (missionRef.current + 1) % 101;
      setMission(missionRef.current);
    }, 70);
    return () => clearInterval(id);
  }, []);

  // Pipeline streams — staggered speeds
  useEffect(() => {
    const id = setInterval(() => {
      setUpload((v) => {
        const next = v + 0.6;
        return next > 100 ? 0 : next;
      });
      setTransform((v) => {
        const next = v + 0.35;
        return next > 100 ? 0 : next;
      });
      setDeploy((v) => {
        deployRef.current = v + 0.9;
        return deployRef.current > 100 ? 0 : deployRef.current;
      });
    }, 80);
    return () => clearInterval(id);
  }, []);

  // System vitals — sine oscillation
  useEffect(() => {
    let t = 0;
    const id = setInterval(() => {
      t += 0.025;
      setCpu(55 + Math.sin(t * 1.1) * 22 + Math.sin(t * 3.7) * 8);
      setRam(44 + Math.sin(t * 0.7 + 1) * 18 + Math.sin(t * 2.3) * 6);
      setNet(15 + Math.abs(Math.sin(t * 2.5 + 0.5)) * 55);
    }, 60);
    return () => clearInterval(id);
  }, []);

  // Showcase slider — slow ping-pong
  useEffect(() => {
    let v = 68;
    let dir = 1;
    const id = setInterval(() => {
      v += dir * 0.4;
      if (v >= 95) dir = -1;
      if (v <= 5) dir = 1;
      setShowcase(v);
    }, 50);
    return () => clearInterval(id);
  }, []);

  const theme = THEMES[activeTheme];

  return (
    <div className="demo-root">
      {/* ── Header ── */}
      <header className="demo-header">
        <div className="demo-header-top">
          <div>
            <p className="demo-eyebrow">DESIGN LAB / COMPONENT</p>
            <h1 className="demo-title">BrandedProgress</h1>
          </div>
          <div className="demo-badge-group">
            <span className="demo-badge demo-badge--live">
              <span className="demo-badge-dot" />
              LIVE
            </span>
            <span className="demo-badge">ARIA 1.2</span>
            <span className="demo-badge">CSS VARS</span>
          </div>
        </div>
        <p className="demo-desc">
          Dynamic progress indicator with full ARIA semantics, CSS variable theming,
          and four render variants. Brand channel updates cascade to all instances instantly.
        </p>
      </header>

      {/* ── Theme Switcher ── */}
      <section className="demo-section" aria-labelledby="theme-heading">
        <div className="demo-section-header">
          <h2 id="theme-heading" className="demo-section-title">BRAND CHANNEL</h2>
          <span className="demo-section-meta">CSS custom properties on :root</span>
        </div>
        <div className="theme-switcher" role="radiogroup" aria-label="Brand theme">
          {THEMES.map((t, i) => (
            <button
              key={t.id}
              role="radio"
              aria-checked={i === activeTheme}
              className={`theme-btn${i === activeTheme ? " theme-btn--active" : ""}`}
              onClick={() => handleTheme(i)}
              style={{ "--t-fill": t.fill, "--t-glow": t.glow } as React.CSSProperties}
            >
              <span className="theme-btn-swatch" aria-hidden="true" />
              {t.name}
            </button>
          ))}
        </div>
        <div className="theme-code" aria-live="polite">
          <span className="tc-comment">/* Active theme vars */</span>
          {[
            ["--p-fill", theme.fill],
            ["--p-fill-2", theme.fill2],
            ["--p-glow", theme.glow],
            ["--p-track", theme.track],
          ].map(([prop, val]) => (
            <div key={prop} className="tc-row">
              <span className="tc-prop">{prop}</span>
              <span className="tc-colon">:</span>
              <span className="tc-val">{val}</span>
              <span className="tc-semi">;</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Two-Column: Mission + Vitals ── */}
      <div className="demo-grid-2">
        {/* Mission */}
        <section className="demo-section" aria-labelledby="mission-heading">
          <div className="demo-section-header">
            <h2 id="mission-heading" className="demo-section-title">LIVE MISSION</h2>
            <span className="demo-section-meta">deterministic · cycling</span>
          </div>
          <div className="mission-display" aria-label={`Mission progress: ${Math.round(mission)}%`}>
            <span className="mission-pct" style={{ color: "var(--p-fill)" }}>
              {String(Math.round(mission)).padStart(3, "\u2007")}
            </span>
            <span className="mission-unit">%</span>
          </div>
          <BrandedProgress
            value={mission}
            label="MISSION ELAPSED"
            sublabel="Streaming telemetry data"
            variant="solid"
            size="xl"
            showTicks
          />
        </section>

        {/* System Vitals */}
        <section className="demo-section" aria-labelledby="vitals-heading">
          <div className="demo-section-header">
            <h2 id="vitals-heading" className="demo-section-title">SYSTEM VITALS</h2>
            <span className="demo-section-meta">sinusoidal · live</span>
          </div>
          <div className="vitals-stack">
            <BrandedProgress value={cpu} label="CPU" sublabel="USAGE" size="sm" />
            <BrandedProgress value={ram} label="MEMORY" sublabel="ALLOCATED" size="sm" />
            <BrandedProgress value={net} label="NETWORK" sublabel="THROUGHPUT" size="sm" />
          </div>
        </section>
      </div>

      {/* ── Pipeline ── */}
      <section className="demo-section" aria-labelledby="pipeline-heading">
        <div className="demo-section-header">
          <h2 id="pipeline-heading" className="demo-section-title">PIPELINE STREAMS</h2>
          <span className="demo-section-meta">independent rates · auto-reset</span>
        </div>
        <div className="pipeline-stack">
          <BrandedProgress
            value={upload}
            label="UPLOAD"
            sublabel="src → remote"
            variant="striped"
            size="md"
          />
          <BrandedProgress
            value={transform}
            label="TRANSFORM"
            sublabel="compress + hash"
            variant="segmented"
            size="md"
          />
          <BrandedProgress
            value={deploy}
            label="DEPLOY"
            sublabel="edge propagation"
            variant="solid"
            size="md"
          />
          <BrandedProgress
            label="INDEXING"
            sublabel="indeterminate state"
            variant="pulse"
            size="md"
          />
        </div>
      </section>

      {/* ── Variant Showcase ── */}
      <section className="demo-section" aria-labelledby="variants-heading">
        <div className="demo-section-header">
          <h2 id="variants-heading" className="demo-section-title">VARIANTS</h2>
          <span className="demo-section-meta">same value · different render</span>
        </div>
        <div className="variant-grid">
          {(["solid", "segmented", "striped", "pulse"] as const).map((v) => (
            <div key={v} className="variant-row">
              <span className="variant-label">{v.toUpperCase()}</span>
              <div className="variant-bar">
                <BrandedProgress
                  value={v === "pulse" ? undefined : showcase}
                  variant={v}
                  size="lg"
                  showTicks={v === "solid"}
                  showValue={false}
                  label={`${v} variant`}
                />
              </div>
              {v !== "pulse" && (
                <span className="variant-value" aria-hidden="true">
                  {Math.round(showcase)}%
                </span>
              )}
              {v === "pulse" && (
                <span className="variant-value variant-value--busy" aria-hidden="true">···</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Size Scale ── */}
      <section className="demo-section" aria-labelledby="sizes-heading">
        <div className="demo-section-header">
          <h2 id="sizes-heading" className="demo-section-title">SIZE SCALE</h2>
          <span className="demo-section-meta">xs · sm · md · lg · xl</span>
        </div>
        <div className="size-grid">
          {(["xs", "sm", "md", "lg", "xl"] as const).map((s, i) => (
            <div key={s} className="size-row">
              <span className="size-label">{s.toUpperCase()}</span>
              <div className="size-bar">
                <BrandedProgress
                  value={40 + i * 12}
                  size={s}
                  label={`Size ${s}`}
                  showValue={false}
                />
              </div>
              <span className="size-value" aria-hidden="true">{40 + i * 12}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Usage snippet ── */}
      <section className="demo-section" aria-labelledby="api-heading">
        <div className="demo-section-header">
          <h2 id="api-heading" className="demo-section-title">COMPONENT API</h2>
          <span className="demo-section-meta">TypeScript · ARIA 1.2</span>
        </div>
        <pre className="code-block"><code>{`<BrandedProgress
  value={72}              // 0–100 | undefined (indeterminate)
  label="Upload"          // → aria-label
  sublabel="src → remote" // descriptor
  variant="striped"       // solid | segmented | striped | pulse
  size="lg"               // xs | sm | md | lg | xl
  showValue               // numeric readout
  showTicks               // tick marks at 10% intervals
/>

/* Theme via CSS custom properties on :root */
--p-fill: #f59e0b;
--p-fill-2: #fcd34d;
--p-glow: rgba(245,158,11,0.4);
--p-track: rgba(245,158,11,0.08);`}</code></pre>
      </section>

      <footer className="demo-footer">
        <span>DESIGN LAB</span>
        <span>·</span>
        <span>BrandedProgress</span>
        <span>·</span>
        <span>React 19 / Next.js 16</span>
      </footer>
    </div>
  );
}
