"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── SVG Illustration Data ─── */

// Brain illustration - hand-drawn style
const brainPaths = [
  // Left hemisphere outline
  "M 200 180 C 180 140, 140 120, 120 140 C 100 160, 90 200, 100 230 C 110 260, 140 280, 170 290 C 190 295, 200 290, 200 280",
  // Right hemisphere outline
  "M 200 180 C 220 140, 260 120, 280 140 C 300 160, 310 200, 300 230 C 290 260, 260 280, 230 290 C 210 295, 200 290, 200 280",
  // Brain folds left
  "M 140 160 C 155 175, 170 165, 180 180 C 185 190, 175 200, 160 195",
  "M 120 200 C 135 210, 150 200, 160 215 C 165 225, 155 235, 140 230",
  "M 150 240 C 165 250, 180 240, 185 255",
  // Brain folds right
  "M 260 160 C 245 175, 230 165, 220 180 C 215 190, 225 200, 240 195",
  "M 280 200 C 265 210, 250 200, 240 215 C 235 225, 245 235, 260 230",
  "M 250 240 C 235 250, 220 240, 215 255",
  // Brain stem
  "M 190 285 C 188 300, 185 315, 190 330 C 195 340, 205 340, 210 330 C 215 315, 212 300, 210 285",
];

// Lightbulb illustration
const lightbulbPaths = [
  // Bulb shape
  "M 200 100 C 160 100, 130 130, 130 170 C 130 200, 150 220, 170 240 C 175 248, 175 260, 175 270",
  "M 200 100 C 240 100, 270 130, 270 170 C 270 200, 250 220, 230 240 C 225 248, 225 260, 225 270",
  // Bulb base
  "M 175 270 L 225 270",
  "M 178 280 L 222 280",
  "M 182 290 L 218 290",
  "M 190 290 C 190 300, 195 305, 200 305 C 205 305, 210 300, 210 290",
  // Filament
  "M 190 240 C 190 220, 195 210, 200 200 C 205 190, 210 200, 210 210 C 210 220, 200 225, 200 240",
  // Rays
  "M 200 70 L 200 50",
  "M 260 85 L 275 70",
  "M 295 145 L 315 140",
  "M 140 85 L 125 70",
  "M 105 145 L 85 140",
  // Sparkle dots (small marks)
  "M 280 110 L 285 105",
  "M 120 110 L 115 105",
];

// Rocket illustration
const rocketPaths = [
  // Rocket body
  "M 200 80 C 190 100, 175 150, 175 220 C 175 250, 185 270, 200 280 C 215 270, 225 250, 225 220 C 225 150, 210 100, 200 80",
  // Nose cone detail
  "M 195 110 C 195 100, 200 90, 200 85 C 200 90, 205 100, 205 110",
  // Window
  "M 200 160 C 210 160, 215 170, 215 180 C 215 190, 210 200, 200 200 C 190 200, 185 190, 185 180 C 185 170, 190 160, 200 160",
  // Left fin
  "M 175 240 C 160 250, 145 270, 140 290 C 155 280, 170 265, 175 260",
  // Right fin
  "M 225 240 C 240 250, 255 270, 260 290 C 245 280, 230 265, 225 260",
  // Exhaust flames
  "M 190 280 C 185 300, 195 320, 200 340 C 205 320, 215 300, 210 280",
  "M 185 285 C 178 310, 190 330, 195 345",
  "M 215 285 C 222 310, 210 330, 205 345",
  // Stars around
  "M 120 120 L 130 120 M 125 115 L 125 125",
  "M 280 150 L 290 150 M 285 145 L 285 155",
  "M 140 200 L 145 200 M 142 197 L 142 203",
  "M 270 100 L 275 100 M 272 97 L 272 103",
];

// Plant/growth illustration
const plantPaths = [
  // Stem
  "M 200 320 C 200 280, 195 240, 200 200 C 205 160, 195 130, 200 100",
  // Left leaves
  "M 200 260 C 180 250, 150 255, 140 240 C 150 235, 170 240, 200 260",
  "M 200 200 C 175 195, 145 205, 130 190 C 145 180, 170 185, 200 200",
  "M 200 150 C 180 140, 160 145, 145 135 C 160 125, 178 130, 200 150",
  // Right leaves
  "M 200 230 C 220 220, 250 225, 260 210 C 250 205, 230 210, 200 230",
  "M 200 170 C 225 165, 255 175, 265 160 C 255 150, 230 155, 200 170",
  // Flower at top
  "M 200 100 C 210 85, 225 80, 220 95 C 225 80, 215 70, 200 80 C 185 70, 175 80, 180 95 C 175 80, 190 85, 200 100",
  // Flower center
  "M 195 90 C 198 85, 202 85, 205 90 C 202 92, 198 92, 195 90",
  // Roots
  "M 200 320 C 190 340, 175 350, 160 345",
  "M 200 320 C 210 340, 225 350, 240 345",
  "M 200 320 C 200 335, 200 345, 200 355",
];

// Eye illustration
const eyePaths = [
  // Upper eyelid
  "M 100 200 C 140 140, 200 120, 260 140 C 290 150, 310 180, 300 200",
  // Lower eyelid
  "M 100 200 C 140 260, 200 280, 260 260 C 290 250, 310 220, 300 200",
  // Iris outer
  "M 200 160 C 225 160, 245 180, 245 200 C 245 220, 225 240, 200 240 C 175 240, 155 220, 155 200 C 155 180, 175 160, 200 160",
  // Pupil
  "M 200 175 C 215 175, 225 185, 225 200 C 225 215, 215 225, 200 225 C 185 225, 175 215, 175 200 C 175 185, 185 175, 200 175",
  // Eyelashes top
  "M 130 165 C 128 150, 135 140, 138 148",
  "M 155 145 C 150 130, 158 120, 160 130",
  "M 180 135 C 178 118, 185 110, 188 122",
  "M 210 132 C 212 115, 220 108, 220 120",
  "M 240 140 C 245 125, 252 120, 250 132",
  "M 265 155 C 272 142, 278 140, 275 150",
  // Sparkle in eye
  "M 190 188 C 192 184, 196 184, 196 188",
];

// Constellation/network illustration
const networkPaths = [
  // Connecting lines
  "M 120 150 L 200 120",
  "M 200 120 L 280 160",
  "M 280 160 L 250 250",
  "M 250 250 L 150 260",
  "M 150 260 L 120 150",
  "M 200 120 L 200 200",
  "M 200 200 L 280 160",
  "M 200 200 L 150 260",
  "M 200 200 L 250 250",
  "M 120 150 L 200 200",
  // Node circles
  "M 125 150 C 130 145, 135 150, 130 155 C 125 158, 118 155, 120 150",
  "M 205 120 C 210 115, 215 120, 210 125 C 205 128, 198 125, 200 120",
  "M 285 160 C 290 155, 295 160, 290 165 C 285 168, 278 165, 280 160",
  "M 255 250 C 260 245, 265 250, 260 255 C 255 258, 248 255, 250 250",
  "M 155 260 C 160 255, 165 260, 160 265 C 155 268, 148 265, 150 260",
  "M 205 200 C 210 195, 215 200, 210 205 C 205 208, 198 205, 200 200",
  // Radiating dots
  "M 100 130 L 105 128",
  "M 300 140 L 305 138",
  "M 270 275 L 275 278",
  "M 130 285 L 125 288",
];

/* ─── Section Component ─── */

interface DrawingSectionProps {
  id: string;
  title: string;
  subtitle: string;
  paths: string[];
  strokeColor: string;
  bgClass: string;
  textColorClass: string;
  accentColorClass: string;
  reverse?: boolean;
}

function DrawingSection({
  id,
  title,
  subtitle,
  paths,
  strokeColor,
  bgClass,
  textColorClass,
  accentColorClass,
  reverse = false,
}: DrawingSectionProps) {
  return (
    <section
      id={id}
      className={`relative min-h-screen flex items-center ${bgClass} overflow-hidden`}
    >
      <div
        className={`container mx-auto px-8 flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12 py-20`}
      >
        {/* Text side */}
        <div className={`flex-1 section-text ${textColorClass}`}>
          <h2
            className={`text-5xl md:text-7xl font-display font-bold mb-6 leading-tight section-title`}
          >
            {title}
          </h2>
          <p className="text-xl md:text-2xl opacity-70 max-w-lg leading-relaxed section-subtitle">
            {subtitle}
          </p>
          <div
            className={`mt-8 h-1 w-0 ${accentColorClass} rounded-full section-line`}
          />
        </div>

        {/* SVG drawing side */}
        <div className="flex-1 flex justify-center">
          <svg
            viewBox="0 0 400 400"
            className="w-full max-w-md h-auto drawing-svg"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {paths.map((d, i) => (
              <path
                key={i}
                d={d}
                stroke={strokeColor}
                strokeWidth={d.includes("M 1") && d.includes("L 1") ? 2 : 3}
                className="draw-path"
                style={{ opacity: 0 }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Decorative floating dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full floating-dot ${accentColorClass}`}
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              opacity: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── Main Page ─── */

export default function MindMarketPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ─── Hero animation ───
      const heroTl = gsap.timeline({ delay: 0.3 });
      heroTl
        .from(".hero-title span", {
          y: 120,
          opacity: 0,
          rotateX: -90,
          stagger: 0.08,
          duration: 1,
          ease: "back.out(1.7)",
        })
        .from(
          ".hero-subtitle",
          { y: 40, opacity: 0, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        )
        .from(
          ".hero-cta",
          {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(2)",
          },
          "-=0.3"
        )
        .from(
          ".hero-scroll-hint",
          {
            y: -20,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.1"
        );

      // Hero SVG doodles continuous animation
      gsap.to(".hero-doodle", {
        y: "random(-15, 15)",
        x: "random(-10, 10)",
        rotation: "random(-8, 8)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { amount: 1, from: "random" },
      });

      // ─── Section animations with ScrollTrigger ───
      const sections = document.querySelectorAll("section[id]");

      sections.forEach((section) => {
        const paths = section.querySelectorAll<SVGPathElement>(".draw-path");
        const title = section.querySelector(".section-title");
        const subtitle = section.querySelector(".section-subtitle");
        const line = section.querySelector(".section-line");
        const dots = section.querySelectorAll(".floating-dot");

        // Calculate path lengths and set initial state
        paths.forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
            opacity: 1,
          });
        });

        // Main scroll-triggered timeline for this section
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "center center",
            scrub: 1,
          },
        });

        // Draw all paths with stagger
        paths.forEach((path, i) => {
          tl.to(
            path,
            {
              strokeDashoffset: 0,
              duration: 1,
              ease: "none",
            },
            i * 0.15
          );
        });

        // Bounce-in text elements (separate trigger, not scrubbed)
        if (title) {
          ScrollTrigger.create({
            trigger: section,
            start: "top 75%",
            onEnter: () => {
              gsap.fromTo(
                title,
                { y: 80, opacity: 0, scale: 0.9 },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  duration: 1,
                  ease: "elastic.out(1, 0.5)",
                }
              );
            },
            once: true,
          });
        }

        if (subtitle) {
          ScrollTrigger.create({
            trigger: section,
            start: "top 65%",
            onEnter: () => {
              gsap.fromTo(
                subtitle,
                { y: 50, opacity: 0 },
                {
                  y: 0,
                  opacity: 0.7,
                  duration: 0.8,
                  delay: 0.3,
                  ease: "back.out(1.7)",
                }
              );
            },
            once: true,
          });
        }

        if (line) {
          ScrollTrigger.create({
            trigger: section,
            start: "top 55%",
            onEnter: () => {
              gsap.to(line, {
                width: "120px",
                duration: 0.8,
                delay: 0.5,
                ease: "elastic.out(1, 0.6)",
              });
            },
            once: true,
          });
        }

        // Float in decorative dots
        dots.forEach((dot, i) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top 80%",
            onEnter: () => {
              gsap.to(dot, {
                opacity: 0.3,
                duration: 0.5,
                delay: i * 0.1,
              });
              gsap.to(dot, {
                y: "random(-20, 20)",
                x: "random(-10, 10)",
                duration: "random(3, 5)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.2,
              });
            },
            once: true,
          });
        });
      });

      // ─── Outro section ───
      ScrollTrigger.create({
        trigger: "#outro",
        start: "top 70%",
        onEnter: () => {
          gsap.fromTo(
            ".outro-text",
            { y: 60, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "elastic.out(1, 0.5)",
              stagger: 0.15,
            }
          );
          // Draw the final decorative paths
          const outroPaths =
            document.querySelectorAll<SVGPathElement>("#outro .draw-path");
          outroPaths.forEach((path) => {
            const length = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
              opacity: 1,
            });
            gsap.to(path, {
              strokeDashoffset: 0,
              duration: 2,
              delay: 0.5,
              ease: "power2.inOut",
            });
          });
        },
        once: true,
      });

      // ─── Parallax background shapes ───
      gsap.utils.toArray<HTMLElement>(".parallax-shape").forEach((shape) => {
        gsap.to(shape, {
          y: () => gsap.utils.random(-100, 100),
          scrollTrigger: {
            trigger: shape.closest("section"),
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      {/* SVG Filters for hand-drawn effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="hand-drawn-filter">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.03"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="1.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-cream overflow-hidden">
        {/* Hero background doodles */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1200 800"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Spiral */}
          <path
            className="hero-doodle"
            d="M 100 200 C 120 180, 140 200, 130 220 C 120 240, 90 230, 95 210 C 100 190, 130 180, 140 210 C 150 240, 110 260, 85 230"
            stroke="#a78bfa"
            strokeWidth="2"
            opacity="0.3"
          />
          {/* Star */}
          <path
            className="hero-doodle"
            d="M 1050 150 L 1060 180 L 1090 180 L 1065 200 L 1075 230 L 1050 210 L 1025 230 L 1035 200 L 1010 180 L 1040 180 Z"
            stroke="#ff6b6b"
            strokeWidth="2"
            opacity="0.3"
          />
          {/* Zigzag */}
          <path
            className="hero-doodle"
            d="M 200 600 L 220 570 L 240 600 L 260 570 L 280 600 L 300 570"
            stroke="#4ecdc4"
            strokeWidth="2"
            opacity="0.3"
          />
          {/* Circle */}
          <circle
            className="hero-doodle"
            cx="1000"
            cy="600"
            r="30"
            stroke="#fbbf24"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
          {/* Wavy line */}
          <path
            className="hero-doodle"
            d="M 50 400 C 100 380, 150 420, 200 400 C 250 380, 300 420, 350 400"
            stroke="#f9a8d4"
            strokeWidth="2"
            opacity="0.3"
          />
          {/* Diamond */}
          <path
            className="hero-doodle"
            d="M 900 100 L 920 130 L 900 160 L 880 130 Z"
            stroke="#4ecdc4"
            strokeWidth="2"
            opacity="0.3"
          />
          {/* Dots cluster */}
          <path
            className="hero-doodle"
            d="M 800 500 L 802 500 M 810 510 L 812 510 M 820 500 L 822 500 M 810 490 L 812 490"
            stroke="#a78bfa"
            strokeWidth="3"
            opacity="0.3"
          />
          {/* Arrow */}
          <path
            className="hero-doodle"
            d="M 150 100 L 180 100 M 170 90 L 180 100 L 170 110"
            stroke="#ff6b6b"
            strokeWidth="2"
            opacity="0.3"
          />
        </svg>

        <div className="relative z-10 text-center px-8">
          <h1 className="hero-title text-6xl md:text-8xl lg:text-9xl font-display font-bold text-ink mb-6 overflow-hidden">
            {"MindMarket".split("").map((char, i) => (
              <span key={i} className="inline-block">
                {char}
              </span>
            ))}
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-ink/60 max-w-2xl mx-auto mb-12">
            Watch ideas come to life through hand-drawn SVG illustrations that
            reveal as you scroll. Each stroke tells a story.
          </p>
          <div className="hero-cta inline-flex items-center gap-2 px-8 py-4 bg-ink text-cream rounded-full text-lg font-medium cursor-default">
            <span>Scroll to explore</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 4 L10 16 M5 11 L10 16 L15 11" />
            </svg>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-hint absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-6 h-10 rounded-full border-2 border-ink/30 flex justify-center pt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-ink/50 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTIONS ═══════════════ */}

      <DrawingSection
        id="brain"
        title="Think Different"
        subtitle="Every great creation begins with a spark of imagination. Let your mind wander through unexplored territories of thought."
        paths={brainPaths}
        strokeColor="#a78bfa"
        bgClass="bg-[#f0ebff]"
        textColorClass="text-ink"
        accentColorClass="bg-lavender"
      />

      <DrawingSection
        id="lightbulb"
        title="Illuminate Ideas"
        subtitle="From fleeting thoughts to brilliant breakthroughs — watch as concepts crystallize into clarity right before your eyes."
        paths={lightbulbPaths}
        strokeColor="#fbbf24"
        bgClass="bg-[#fef9e7]"
        textColorClass="text-ink"
        accentColorClass="bg-gold"
        reverse
      />

      <DrawingSection
        id="rocket"
        title="Launch Forward"
        subtitle="Propel your vision into reality. Every line drawn is a step closer to turning the impossible into the inevitable."
        paths={rocketPaths}
        strokeColor="#ff6b6b"
        bgClass="bg-[#fff0f0]"
        textColorClass="text-ink"
        accentColorClass="bg-coral"
      />

      <DrawingSection
        id="plant"
        title="Grow & Evolve"
        subtitle="Ideas are seeds. With patience and nurture, they blossom into beautiful, living creations that inspire the world."
        paths={plantPaths}
        strokeColor="#4ecdc4"
        bgClass="bg-[#ecfdf5]"
        textColorClass="text-ink"
        accentColorClass="bg-mint"
        reverse
      />

      <DrawingSection
        id="eye"
        title="See Clearly"
        subtitle="Open your eyes to new perspectives. The best solutions reveal themselves when you change how you look at problems."
        paths={eyePaths}
        strokeColor="#f9a8d4"
        bgClass="bg-[#fdf2f8]"
        textColorClass="text-ink"
        accentColorClass="bg-blush"
      />

      <DrawingSection
        id="network"
        title="Connect Everything"
        subtitle="Ideas don't exist in isolation. When thoughts connect, networks form, and magic happens at every intersection."
        paths={networkPaths}
        strokeColor="#a78bfa"
        bgClass="bg-[#f5f0ff]"
        textColorClass="text-ink"
        accentColorClass="bg-lavender"
        reverse
      />

      {/* ═══════════════ OUTRO ═══════════════ */}
      <section
        id="outro"
        className="relative min-h-screen flex flex-col items-center justify-center bg-ink overflow-hidden"
      >
        {/* Decorative SVG frame */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1200 800"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Decorative border lines */}
          <path
            className="draw-path"
            d="M 100 100 C 200 80, 400 90, 600 100 C 800 110, 1000 80, 1100 100"
            stroke="#a78bfa"
            strokeWidth="1.5"
            opacity="0.4"
          />
          <path
            className="draw-path"
            d="M 100 700 C 200 720, 400 710, 600 700 C 800 690, 1000 720, 1100 700"
            stroke="#4ecdc4"
            strokeWidth="1.5"
            opacity="0.4"
          />
          <path
            className="draw-path"
            d="M 80 150 C 70 300, 90 500, 80 650"
            stroke="#ff6b6b"
            strokeWidth="1.5"
            opacity="0.3"
          />
          <path
            className="draw-path"
            d="M 1120 150 C 1130 300, 1110 500, 1120 650"
            stroke="#fbbf24"
            strokeWidth="1.5"
            opacity="0.3"
          />
          {/* Corner flourishes */}
          <path
            className="draw-path"
            d="M 120 120 C 110 110, 100 115, 100 100 M 120 120 C 110 125, 100 120, 100 130"
            stroke="#f9a8d4"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <path
            className="draw-path"
            d="M 1080 120 C 1090 110, 1100 115, 1100 100 M 1080 120 C 1090 125, 1100 120, 1100 130"
            stroke="#f9a8d4"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <path
            className="draw-path"
            d="M 120 680 C 110 690, 100 685, 100 700 M 120 680 C 110 675, 100 680, 100 670"
            stroke="#f9a8d4"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <path
            className="draw-path"
            d="M 1080 680 C 1090 690, 1100 685, 1100 700 M 1080 680 C 1090 675, 1100 680, 1100 670"
            stroke="#f9a8d4"
            strokeWidth="1.5"
            opacity="0.5"
          />
        </svg>

        <div className="relative z-10 text-center px-8">
          <h2 className="outro-text text-5xl md:text-7xl lg:text-8xl font-display font-bold text-cream mb-6">
            Every line has
            <br />
            <span className="text-lavender">a story</span>
          </h2>
          <p className="outro-text text-xl md:text-2xl text-cream/50 max-w-xl mx-auto mb-10">
            Crafted with GSAP, ScrollTrigger &amp; hand-drawn SVG paths.
            Every stroke animated one pixel at a time.
          </p>
          <div className="outro-text flex items-center justify-center gap-6 text-cream/30 text-sm">
            <span>SVG Path Drawing</span>
            <span className="w-1 h-1 rounded-full bg-cream/30" />
            <span>ScrollTrigger</span>
            <span className="w-1 h-1 rounded-full bg-cream/30" />
            <span>GSAP</span>
            <span className="w-1 h-1 rounded-full bg-cream/30" />
            <span>Tailwind CSS</span>
          </div>
        </div>
      </section>
    </div>
  );
}
