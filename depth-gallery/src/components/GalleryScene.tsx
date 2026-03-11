"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ImagePlane } from "./ImagePlane";
import { ITEMS, SPACING, CAMERA_OFFSET } from "@/lib/gallery-data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function lerpRgb(a: RGB, b: RGB, t: number): RGB {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function rgbCss([r, g, b]: RGB) {
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// ─── Scroll state ─────────────────────────────────────────────────────────────

interface ScrollState {
  target: number;
  current: number;
  velocity: number; // raw delta per frame — used by shaders
}

// ─── Inner Three.js scene ─────────────────────────────────────────────────────
// Lives inside <Canvas> so it can use useFrame and useThree.

interface SceneProps {
  scrollRef: React.MutableRefObject<ScrollState>;
  domRefs: React.MutableRefObject<{
    bg: HTMLDivElement | null;
    title: HTMLElement | null;
    subtitle: HTMLElement | null;
    index: HTMLElement | null;
    progress: HTMLElement | null;
  }>;
}

function Scene({ scrollRef, domRefs }: SceneProps) {
  const { camera } = useThree();

  useFrame(() => {
    const s = scrollRef.current;
    const prev = s.current;

    // Exponential lerp toward target — feels springy without overshooting
    s.current = lerp(s.current, s.target, 0.065);
    s.velocity = s.current - prev;

    // ── Camera ─────────────────────────────────────────────────────────────
    camera.position.z = CAMERA_OFFSET - s.current;

    // ── Background gradient ────────────────────────────────────────────────
    // Continuously interpolate between adjacent palette pairs
    const maxScroll = (ITEMS.length - 1) * SPACING;
    const t_global  = s.current / maxScroll; // 0 → 1 across whole gallery
    const rawIdx    = s.current / SPACING;
    const idx       = Math.min(Math.floor(rawIdx), ITEMS.length - 2);
    const t_local   = rawIdx - idx; // 0 → 1 between current & next item

    const a = ITEMS[Math.max(0, idx)];
    const b = ITEMS[Math.min(idx + 1, ITEMS.length - 1)];

    const inner = lerpRgb(hexToRgb(a.bg2), hexToRgb(b.bg2), t_local);
    const outer = lerpRgb(hexToRgb(a.bg1), hexToRgb(b.bg1), t_local);

    const dom = domRefs.current;
    if (dom.bg) {
      dom.bg.style.background = `radial-gradient(ellipse 80% 60% at 50% 50%, ${rgbCss(inner)} 0%, ${rgbCss(outer)} 100%)`;
    }

    // ── UI labels ──────────────────────────────────────────────────────────
    // Snap to nearest item for clean title transitions
    const nearest = Math.min(Math.round(rawIdx), ITEMS.length - 1);
    const item    = ITEMS[nearest];

    // Opacity pulse: fade title out during fast scrolling, back in when still
    const vel    = Math.min(Math.abs(s.velocity) * 40, 1);
    const opacity = 1 - vel * 0.7;

    if (dom.title) {
      (dom.title as HTMLElement).style.opacity = String(opacity);
      dom.title.textContent = item.title;
    }
    if (dom.subtitle) {
      (dom.subtitle as HTMLElement).style.opacity = String(opacity * 0.5);
      dom.subtitle.textContent = item.subtitle;
    }
    if (dom.index) {
      dom.index.textContent = `${pad(nearest + 1)} / ${pad(ITEMS.length)}`;
    }
    if (dom.progress) {
      dom.progress.style.transform = `scaleX(${t_global})`;
    }
  });

  return (
    <>
      {ITEMS.map((item, i) => (
        <ImagePlane key={item.id} item={item} index={i} scrollRef={scrollRef} />
      ))}
    </>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export function GalleryScene() {
  const scrollRef = useRef<ScrollState>({ target: 0, current: 0, velocity: 0 });

  // DOM refs — mutated directly in useFrame to avoid React re-renders
  const bgRef       = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const indexRef    = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const domRefs = useRef({
    bg: null as HTMLDivElement | null,
    title: null as HTMLElement | null,
    subtitle: null as HTMLElement | null,
    index: null as HTMLElement | null,
    progress: null as HTMLElement | null,
  });

  useEffect(() => {
    domRefs.current.bg       = bgRef.current;
    domRefs.current.title    = titleRef.current;
    domRefs.current.subtitle = subtitleRef.current;
    domRefs.current.index    = indexRef.current;
    domRefs.current.progress = progressRef.current;
  }, []);

  // ── Scroll input ──────────────────────────────────────────────────────────
  useEffect(() => {
    const maxScroll = (ITEMS.length - 1) * SPACING;

    const clamp = (v: number) => Math.max(0, Math.min(maxScroll, v));

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollRef.current.target = clamp(scrollRef.current.target + e.deltaY * 0.012);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault();
      const delta = touchY - e.touches[0].clientY;
      touchY = e.touches[0].clientY;
      scrollRef.current.target = clamp(scrollRef.current.target + delta * 0.02);
    };

    window.addEventListener("wheel",      onWheel,      { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true  });
    window.addEventListener("touchmove",  onTouchMove,  { passive: false });

    return () => {
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
    };
  }, []);

  const first = ITEMS[0];

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* ── Background gradient ─────────────────────────────────────────────── */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${first.bg2} 0%, ${first.bg1} 100%)`,
        }}
      />

      {/* ── Three.js canvas ─────────────────────────────────────────────────── */}
      <Canvas
        style={{ position: "absolute", inset: 0 }}
        camera={{ fov: 50, position: [0, 0, CAMERA_OFFSET], near: 0.1, far: 80 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene scrollRef={scrollRef} domRefs={domRefs} />
      </Canvas>

      {/* ── UI overlay ──────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">

        {/* Top bar */}
        <div className="flex justify-between items-start px-8 pt-8 md:px-12 md:pt-10">
          <span
            className="text-white/25 text-xs tracking-[0.35em] uppercase"
            style={{ fontWeight: 300, letterSpacing: "0.35em" }}
          >
            Depth Gallery
          </span>
          <span
            className="text-white/20 text-xs"
            style={{ fontWeight: 300, letterSpacing: "0.2em" }}
          >
            Scroll to navigate
          </span>
        </div>

        {/* Bottom info */}
        <div className="px-8 pb-8 md:px-12 md:pb-10">

          {/* Progress bar — driven by transform: scaleX() from useFrame */}
          <div className="w-full h-px bg-white/8 mb-6 overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-white/30 origin-left"
              style={{ transform: "scaleX(0)", transition: "none" }}
            />
          </div>

          <div className="flex justify-between items-end">
            <div>
              <h2
                ref={titleRef}
                className="text-white text-5xl md:text-7xl"
                style={{
                  fontWeight: 200,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  transition: "opacity 0.1s ease",
                }}
              >
                {first.title}
              </h2>
              <p
                ref={subtitleRef}
                className="text-white/40 text-sm mt-2"
                style={{
                  fontWeight: 300,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  transition: "opacity 0.1s ease",
                }}
              >
                {first.subtitle}
              </p>
            </div>

            <span
              ref={indexRef}
              className="text-white/30 text-sm tabular-nums"
              style={{ fontWeight: 300, letterSpacing: "0.15em" }}
            >
              01 / {pad(ITEMS.length)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
