"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/* ─── Scroll Progress Bar ─── */
function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 0.3 },
    });
  });
  return <div ref={bar} className="scroll-progress" style={{ transform: "scaleX(0)" }} />;
}

/* ─── Navigation ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-[9998] px-8 py-6 flex justify-between items-center transition-all duration-500 ${scrolled ? "bg-background/80 backdrop-blur-md" : ""}`}>
      <div className="text-lg font-light tracking-[0.2em] uppercase">
        motion<span className="text-accent">.</span>ed
      </div>
      <div className="hidden md:flex gap-8 text-sm text-muted">
        {["Easing", "Offset", "Parallax", "Motion Path", "Pinning", "Morph", "Zoom"].map((s) => (
          <a key={s} href={`#${s.toLowerCase().replace(" ", "-")}`} className="hover:text-foreground transition-colors duration-300">
            {s}
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ─── Hero Section ─── */
function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(titleRef.current, { y: 120, opacity: 0, duration: 1.2, ease: "power4.out" })
      .from(subtitleRef.current, { y: 60, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.6")
      .from(orbRef.current, { scale: 0, opacity: 0, duration: 1.4, ease: "elastic.out(1, 0.5)" }, "-=0.8");

    gsap.to(orbRef.current, {
      y: -200,
      scale: 0.6,
      opacity: 0.3,
      scrollTrigger: { trigger: container.current, start: "top top", end: "bottom top", scrub: true },
    });

    gsap.to(titleRef.current, {
      y: -100,
      opacity: 0,
      scrollTrigger: { trigger: container.current, start: "center center", end: "bottom top", scrub: true },
    });
  }, { scope: container });

  return (
    <section ref={container} className="relative h-[150vh] flex items-start justify-center pt-[30vh] overflow-hidden grid-lines">
      <div ref={orbRef} className="absolute top-[20%] right-[15%] w-64 h-64 rounded-full bg-gradient-to-br from-accent/30 to-highlight/20 blur-3xl" />
      <div className="text-center z-10 px-4">
        <h1 ref={titleRef} className="text-[clamp(3rem,8vw,8rem)] font-extralight leading-[0.9] tracking-tight">
          The Art of
          <br />
          <span className="font-normal text-accent">Motion</span>
        </h1>
        <p ref={subtitleRef} className="mt-8 text-lg md:text-xl text-muted max-w-xl mx-auto font-light leading-relaxed">
          A deep dive into scroll-driven animation, easing principles,
          and the craft of bringing interfaces to life.
        </p>
        <div className="mt-12 flex items-center justify-center gap-2 text-muted/50 text-sm">
          <span>Scroll to explore</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-20 left-10 grid grid-cols-5 gap-3 opacity-20">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-foreground" />
        ))}
      </div>
    </section>
  );
}

/* ─── Section 1: Easing Showcase ─── */
function EasingSection() {
  const container = useRef<HTMLDivElement>(null);
  const easings = [
    { name: "Linear", ease: "none", color: "#c8cfe8" },
    { name: "Power2.out", ease: "power2.out", color: "#e8c8d0" },
    { name: "Elastic", ease: "elastic.out(1, 0.3)", color: "#c8e8cf" },
    { name: "Bounce", ease: "bounce.out", color: "#e8dcc8" },
  ];

  useGSAP(() => {
    gsap.from(container.current!.querySelector("h2"), {
      y: 80, opacity: 0,
      scrollTrigger: { trigger: container.current, start: "top 80%", end: "top 50%", scrub: 1 },
    });

    easings.forEach((_, i) => {
      const box = container.current!.querySelector(`.ease-demo-${i}`);
      if (!box) return;
      gsap.fromTo(box, { x: 0 }, {
        x: "70vw",
        ease: easings[i].ease,
        scrollTrigger: {
          trigger: container.current,
          start: "top 30%",
          end: "bottom 60%",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });
    });
  }, { scope: container });

  return (
    <section ref={container} id="easing" className="relative min-h-[120vh] py-32 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 text-sm text-muted tracking-[0.3em] uppercase">01</div>
        <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extralight mb-4">
          The Basics of <span className="text-accent font-normal">Easing</span>
        </h2>
        <p className="text-muted max-w-lg mb-20 text-lg font-light">
          Nothing in the real world moves linearly. Easing functions define how
          objects accelerate and decelerate — the soul of believable motion.
        </p>
        <div className="space-y-8">
          {easings.map((e, i) => (
            <div key={e.name} className="flex items-center gap-6">
              <span className="w-32 text-right text-sm text-muted font-mono">{e.name}</span>
              <div className="flex-1 relative h-14 bg-card rounded-lg overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-full opacity-10" style={{ background: `linear-gradient(90deg, ${e.color}, transparent)` }} />
                <div className={`ease-demo-${i} ease-box absolute top-1/2 left-4 -translate-y-1/2`} style={{ background: e.color }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-16 text-muted/60 text-sm max-w-md">
          Like a car that accelerates from a stop and brakes before parking —
          natural motion always has acceleration and deceleration curves.
        </p>
      </div>
    </section>
  );
}

/* ─── Section 2: Offset & Delay (Stagger) ─── */
function OffsetSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = container.current!.querySelectorAll(".stagger-card");
    gsap.from(container.current!.querySelector("h2"), {
      y: 80, opacity: 0,
      scrollTrigger: { trigger: container.current, start: "top 80%", end: "top 50%", scrub: 1 },
    });
    gsap.from(cards, {
      y: 120, opacity: 0, rotateX: -15, stagger: 0.15,
      scrollTrigger: { trigger: container.current, start: "top 50%", end: "center center", scrub: 1 },
    });
  }, { scope: container });

  const items = [
    { title: "Follow Through", desc: "Elements arrive at different times, creating visual hierarchy" },
    { title: "Overlapping Action", desc: "Sequential motion draws the eye along a deliberate path" },
    { title: "Secondary Motion", desc: "Subtle delays add softness and organic quality to reveals" },
    { title: "Anticipation", desc: "A brief counter-movement signals that something is about to happen" },
    { title: "Staging", desc: "Careful timing ensures each element gets its moment" },
    { title: "Rhythm", desc: "Consistent offset patterns create a musical cadence in motion" },
  ];

  return (
    <section ref={container} id="offset" className="relative min-h-screen py-32 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 text-sm text-muted tracking-[0.3em] uppercase">02</div>
        <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extralight mb-4">
          Offset & <span className="text-highlight font-normal">Delay</span>
        </h2>
        <p className="text-muted max-w-lg mb-16 text-lg font-light">
          Staggered timing transforms a wall of content into a choreographed sequence.
          Each element arrives in turn, guiding the viewer&apos;s attention.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={item.title} className="stagger-card bg-card border border-white/5 rounded-2xl p-8 hover:border-accent/20 transition-colors duration-500" style={{ perspective: "1000px" }}>
              <div className="text-5xl font-extralight text-accent/20 mb-4">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="text-lg font-light mb-2">{item.title}</h3>
              <p className="text-sm text-muted/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 3: Parallax Layers ─── */
function ParallaxSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const layers = container.current!.querySelectorAll(".plx-layer");
    const speeds = [-200, -100, -50, 50, 100, 150];
    layers.forEach((layer, i) => {
      gsap.to(layer, {
        y: speeds[i % speeds.length],
        scrollTrigger: { trigger: container.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
    gsap.from(container.current!.querySelector("h2"), {
      y: 80, opacity: 0,
      scrollTrigger: { trigger: container.current, start: "top 80%", end: "top 50%", scrub: 1 },
    });
  }, { scope: container });

  return (
    <section ref={container} id="parallax" className="relative min-h-[140vh] py-32 px-8 md:px-16 overflow-hidden">
      <div className="plx-layer absolute top-[10%] left-[5%] w-40 h-40 rounded-full bg-accent/10 blur-2xl" />
      <div className="plx-layer absolute top-[20%] right-[10%] w-64 h-64 rounded-full bg-highlight/8 blur-3xl" />
      <div className="plx-layer absolute top-[50%] left-[20%] w-24 h-24 border border-accent/20 rounded-full" />
      <div className="plx-layer absolute top-[60%] right-[25%] w-32 h-32 border border-highlight/15 rounded-lg rotate-45" />
      <div className="plx-layer absolute top-[30%] left-[60%] w-3 h-3 bg-accent rounded-full" />
      <div className="plx-layer absolute top-[70%] left-[40%] w-2 h-2 bg-highlight rounded-full" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-4 text-sm text-muted tracking-[0.3em] uppercase">03</div>
        <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extralight mb-4">
          <span className="text-accent font-normal">Parallax</span> Layers
        </h2>
        <p className="text-muted max-w-lg mb-16 text-lg font-light">
          Multiple layers moving at different speeds create a powerful sense of depth.
          The background drifts slowly, the foreground rushes past — just like looking out a window.
        </p>
        <div className="relative h-[60vh] rounded-3xl overflow-hidden bg-card border border-white/5">
          <div className="plx-layer absolute inset-0 flex items-center justify-center">
            <div className="text-[20vw] font-extralight text-white/[0.02] select-none">DEPTH</div>
          </div>
          <div className="plx-layer absolute top-1/4 left-1/4 w-48 h-48 rounded-2xl bg-gradient-to-br from-accent/20 to-transparent backdrop-blur-sm border border-accent/10" />
          <div className="plx-layer absolute bottom-1/4 right-1/4 w-36 h-36 rounded-full bg-gradient-to-br from-highlight/20 to-transparent backdrop-blur-sm border border-highlight/10" />
          <div className="plx-layer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-6xl md:text-8xl font-extralight tracking-tight">∞</div>
            <div className="text-sm text-muted mt-4">Scroll to feel the depth</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 4: Motion Path ─── */
function MotionPathSection() {
  const container = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(container.current!.querySelector("h2"), {
      y: 80, opacity: 0,
      scrollTrigger: { trigger: container.current, start: "top 80%", end: "top 50%", scrub: 1 },
    });

    gsap.to(ballRef.current, {
      motionPath: {
        path: "#motionPath",
        align: "#motionPath",
        alignOrigin: [0.5, 0.5],
        autoRotate: true,
      },
      scrollTrigger: {
        trigger: container.current,
        start: "top 30%",
        end: "bottom 60%",
        scrub: 1.5,
      },
    });

    const dots = container.current!.querySelectorAll(".trail-dot");
    dots.forEach((dot, i) => {
      gsap.to(dot, {
        motionPath: {
          path: "#motionPath",
          align: "#motionPath",
          alignOrigin: [0.5, 0.5],
        },
        scrollTrigger: {
          trigger: container.current,
          start: "top 30%",
          end: "bottom 60%",
          scrub: 1.5 + i * 0.3,
        },
      });
    });
  }, { scope: container });

  return (
    <section ref={container} id="motion-path" className="relative min-h-[120vh] py-32 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 text-sm text-muted tracking-[0.3em] uppercase">04</div>
        <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extralight mb-4">
          Motion <span className="text-accent font-normal">Path</span>
        </h2>
        <p className="text-muted max-w-lg mb-16 text-lg font-light">
          Objects following organic curves feel alive. GSAP&apos;s MotionPathPlugin
          lets elements glide along any SVG path as you scroll.
        </p>
        <div className="relative h-[60vh] rounded-3xl overflow-hidden bg-card border border-white/5">
          <svg className="motion-path-svg" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
            <path
              id="motionPath"
              d="M 50,250 C 200,50 350,450 500,250 C 650,50 800,450 950,250"
              fill="none"
              stroke="rgba(200,207,232,0.15)"
              strokeWidth="2"
              strokeDasharray="8 8"
            />
          </svg>
          {[0.3, 0.5, 0.7].map((opacity, i) => (
            <div key={i} className="trail-dot absolute w-3 h-3 rounded-full bg-accent" style={{ opacity, top: 0, left: 0 }} />
          ))}
          <div ref={ballRef} className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-accent to-highlight shadow-lg shadow-accent/30" style={{ top: 0, left: 0 }} />
          <div className="absolute bottom-8 left-8 text-sm text-muted/50">Scroll to animate along the path →</div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 5: Pinning Showcase ─── */
function PinningSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const panels = container.current!.querySelectorAll(".pin-panel");
    gsap.from(container.current!.querySelector("h2"), {
      y: 80, opacity: 0,
      scrollTrigger: { trigger: container.current, start: "top 80%", end: "top 50%", scrub: 1 },
    });

    const pinArea = container.current!.querySelector(".pin-area");
    if (!pinArea) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinArea,
        start: "top 15%",
        end: `+=${panels.length * 100}%`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    panels.forEach((panel, i) => {
      if (i === 0) return;
      tl.fromTo(panel, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1 }, i * 0.5);
    });
  }, { scope: container });

  const slides = [
    { title: "Pin & Reveal", desc: "Content stays fixed while new layers reveal on top", bg: "from-accent/20 to-accent/5", icon: "◆" },
    { title: "Horizontal Scroll", desc: "Vertical scrolling drives horizontal movement", bg: "from-highlight/20 to-highlight/5", icon: "◇" },
    { title: "Stack & Peel", desc: "Cards stack and peel away as you progress", bg: "from-green-400/20 to-green-400/5", icon: "○" },
    { title: "Zoom Through", desc: "Dive into content as depth layers resolve", bg: "from-yellow-400/20 to-yellow-400/5", icon: "△" },
  ];

  return (
    <section ref={container} id="pinning" className="relative py-32 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 text-sm text-muted tracking-[0.3em] uppercase">05</div>
        <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extralight mb-4">
          ScrollTrigger <span className="text-accent font-normal">Pinning</span>
        </h2>
        <p className="text-muted max-w-lg mb-16 text-lg font-light">
          Pin an element in place while scroll-driven animations play out.
          The viewport becomes a stage for choreographed reveals.
        </p>
        <div className="pin-area relative h-[70vh] rounded-3xl overflow-hidden">
          {slides.map((slide, i) => (
            <div key={slide.title} className={`pin-panel absolute inset-0 flex items-center justify-center bg-gradient-to-br ${slide.bg} border border-white/5 rounded-3xl`} style={{ zIndex: i + 1 }}>
              <div className="text-center px-8">
                <div className="text-7xl mb-8 text-foreground/30">{slide.icon}</div>
                <h3 className="text-3xl md:text-5xl font-extralight mb-4">{slide.title}</h3>
                <p className="text-muted max-w-md mx-auto">{slide.desc}</p>
                <div className="mt-8 flex justify-center gap-2">
                  {slides.map((_, j) => (
                    <div key={j} className={`w-2 h-2 rounded-full ${j === i ? "bg-foreground" : "bg-foreground/20"}`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 6: Transform & Morph ─── */
function MorphSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(container.current!.querySelector("h2"), {
      y: 80, opacity: 0,
      scrollTrigger: { trigger: container.current, start: "top 80%", end: "top 50%", scrub: 1 },
    });

    const morphBox = container.current!.querySelector(".morph-box");
    if (!morphBox) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current!.querySelector(".morph-stage"),
        start: "top 40%",
        end: "bottom 60%",
        scrub: 1.5,
      },
    });

    tl.to(morphBox, { borderRadius: "50%", rotation: 180, scale: 1.3, background: "linear-gradient(135deg, #c8cfe8, #e8c8d0)", duration: 1 })
      .to(morphBox, { borderRadius: "20%", rotation: 360, scale: 0.8, width: 200, height: 100, duration: 1 })
      .to(morphBox, { borderRadius: "50% 0 50% 0", rotation: 540, scale: 1.1, width: 150, height: 150, duration: 1 })
      .to(morphBox, { borderRadius: "12px", rotation: 720, scale: 1, width: 120, height: 120, background: "linear-gradient(135deg, #e8c8d0, #c8e8cf)", duration: 1 });
  }, { scope: container });

  return (
    <section ref={container} id="morph" className="relative min-h-[120vh] py-32 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 text-sm text-muted tracking-[0.3em] uppercase">06</div>
        <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extralight mb-4">
          Transform & <span className="text-highlight font-normal">Morph</span>
        </h2>
        <p className="text-muted max-w-lg mb-16 text-lg font-light">
          Shape-shifting creates visual continuity. An object that smoothly
          transforms between states tells a story of connection.
        </p>
        <div className="morph-stage relative h-[50vh] rounded-3xl bg-card border border-white/5 flex items-center justify-center">
          <div className="morph-box w-[120px] h-[120px] rounded-xl bg-gradient-to-br from-accent to-highlight" />
          <div className="absolute bottom-8 left-8 text-sm text-muted/50">Scroll to morph the shape →</div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 7: Zoom & Scale ─── */
function ZoomSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(container.current!.querySelector("h2"), {
      y: 80, opacity: 0,
      scrollTrigger: { trigger: container.current, start: "top 80%", end: "top 50%", scrub: 1 },
    });

    const zoomTarget = container.current!.querySelector(".zoom-target");
    if (!zoomTarget) return;

    gsap.fromTo(zoomTarget, { scale: 0.3, opacity: 0.5 }, {
      scale: 1, opacity: 1,
      scrollTrigger: {
        trigger: container.current!.querySelector(".zoom-stage"),
        start: "top 60%",
        end: "bottom 40%",
        scrub: 1,
      },
    });

    const innerElements = container.current!.querySelectorAll(".zoom-inner");
    innerElements.forEach((el, i) => {
      gsap.fromTo(el, { scale: 0.5 + i * 0.1, opacity: 0 }, {
        scale: 1, opacity: 1,
        scrollTrigger: {
          trigger: container.current!.querySelector(".zoom-stage"),
          start: `top ${70 - i * 10}%`,
          end: "bottom 40%",
          scrub: 1,
        },
      });
    });
  }, { scope: container });

  return (
    <section ref={container} id="zoom" className="relative min-h-[120vh] py-32 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 text-sm text-muted tracking-[0.3em] uppercase">07</div>
        <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extralight mb-4">
          <span className="text-accent font-normal">Zoom</span> & Scale
        </h2>
        <p className="text-muted max-w-lg mb-16 text-lg font-light">
          Scaling creates narrative flow. Zooming in draws focus;
          zooming out reveals context. Camera-like movement through content.
        </p>
        <div className="zoom-stage relative h-[60vh] rounded-3xl bg-card border border-white/5 flex items-center justify-center overflow-hidden">
          <div className="zoom-target relative">
            <div className="w-80 h-80 rounded-3xl bg-gradient-to-br from-card to-background border border-white/10 flex items-center justify-center overflow-hidden">
              <div className="zoom-inner absolute inset-4 rounded-2xl border border-accent/20 flex items-center justify-center">
                <div className="zoom-inner absolute inset-4 rounded-xl border border-highlight/20 flex items-center justify-center">
                  <div className="zoom-inner text-center">
                    <div className="text-4xl font-extralight text-accent">⦿</div>
                    <div className="text-xs text-muted mt-2">Focus point</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 8: Horizontal Scroll Pinned ─── */
function HorizontalScrollSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const track = container.current!.querySelector(".h-scroll-track") as HTMLElement;
    if (!track) return;

    gsap.from(container.current!.querySelector("h2"), {
      y: 80, opacity: 0,
      scrollTrigger: { trigger: container.current, start: "top 80%", end: "top 50%", scrub: 1 },
    });

    const totalWidth = track.scrollWidth - window.innerWidth + 200;

    gsap.to(track, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: container.current!.querySelector(".h-scroll-wrapper"),
        start: "top 10%",
        end: `+=${totalWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  }, { scope: container });

  const panels = [
    { num: "01", title: "Scroll Hijacking", text: "Vertical scroll drives horizontal movement. Use sparingly — it subverts user expectations." },
    { num: "02", title: "Timeline Scrub", text: "Complex multi-step animations tied to scroll progress create cinematic storytelling." },
    { num: "03", title: "Snap Points", text: "Magnetic snap positions create discrete steps in a continuous scroll experience." },
    { num: "04", title: "Progress Mapping", text: "Any value can be driven by scroll position — color, blur, opacity, 3D transforms." },
    { num: "05", title: "Velocity Tracking", text: "Scroll velocity can modulate animation intensity for responsive, dynamic effects." },
  ];

  return (
    <section ref={container} className="relative py-32 px-8 md:px-16">
      <div className="max-w-6xl mx-auto mb-16">
        <div className="mb-4 text-sm text-muted tracking-[0.3em] uppercase">08</div>
        <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extralight mb-4">
          Horizontal <span className="text-highlight font-normal">Scroll</span>
        </h2>
        <p className="text-muted max-w-lg text-lg font-light">
          Pin a container and translate its contents horizontally.
          A powerful technique for galleries, timelines, and case studies.
        </p>
      </div>
      <div className="h-scroll-wrapper overflow-hidden">
        <div className="h-scroll-track flex gap-8 pl-8" style={{ width: "fit-content" }}>
          {panels.map((p) => (
            <div key={p.num} className="flex-shrink-0 w-[80vw] md:w-[40vw] h-[50vh] rounded-3xl bg-card border border-white/5 p-12 flex flex-col justify-between">
              <div>
                <div className="text-6xl font-extralight text-accent/20 mb-6">{p.num}</div>
                <h3 className="text-2xl font-light mb-3">{p.title}</h3>
                <p className="text-muted/70 text-sm leading-relaxed max-w-sm">{p.text}</p>
              </div>
              <div className="w-full h-px bg-gradient-to-r from-accent/30 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 9: Text Reveal ─── */
function TextRevealSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const words = container.current!.querySelectorAll(".reveal-word");
    words.forEach((word, i) => {
      gsap.fromTo(word, { opacity: 0.1 }, {
        opacity: 1,
        scrollTrigger: {
          trigger: container.current,
          start: `top ${60 - i * 1.5}%`,
          end: `top ${45 - i * 1.5}%`,
          scrub: true,
        },
      });
    });
  }, { scope: container });

  const text = "Animation is not decoration. It is communication. Every transition carries meaning. Every easing curve tells a story. Motion guides attention, creates hierarchy, and breathes life into static interfaces.";
  const words = text.split(" ");

  return (
    <section ref={container} className="relative min-h-[200vh] py-32 px-8 md:px-16 flex items-start justify-center pt-[40vh]">
      <p className="max-w-4xl text-[clamp(1.5rem,3.5vw,3.5rem)] font-extralight leading-relaxed text-center">
        {words.map((word, i) => (
          <span key={i} className="reveal-word inline-block mr-[0.3em]">{word}</span>
        ))}
      </p>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  const container = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(container.current!.querySelectorAll(".footer-item"), {
      y: 40, opacity: 0, stagger: 0.1,
      scrollTrigger: { trigger: container.current, start: "top 90%", end: "top 70%", scrub: 1 },
    });
  }, { scope: container });

  return (
    <footer ref={container} className="relative py-32 px-8 md:px-16 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="footer-item text-[clamp(2rem,4vw,4rem)] font-extralight mb-8">
          motion<span className="text-accent">.</span>ed
        </div>
        <div className="footer-item text-muted text-sm mb-12 max-w-md">
          A showcase of GSAP ScrollTrigger techniques — pinning, motion paths,
          scroll-scrubbing, parallax layers, and smooth section transitions.
        </div>
        <div className="footer-item flex gap-8 text-sm text-muted/50">
          <span>Built with Next.js + GSAP + Tailwind</span>
          <span>© 2025</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  return (
    <main>
      <ScrollProgress />
      <Nav />
      <Hero />
      <EasingSection />
      <OffsetSection />
      <ParallaxSection />
      <MotionPathSection />
      <PinningSection />
      <MorphSection />
      <ZoomSection />
      <HorizontalScrollSection />
      <TextRevealSection />
      <Footer />
    </main>
  );
}
