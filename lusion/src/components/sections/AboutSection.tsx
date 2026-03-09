"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  "WebGL & Three.js",
  "Custom GLSL Shaders",
  "Real-time 3D",
  "Interactive Installations",
  "Creative Development",
  "Motion Design",
];

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "12", label: "Industry Awards" },
  { value: "8", label: "Years of Craft" },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text reveal on scroll
      if (textRef.current) {
        const words = textRef.current.querySelectorAll("span");
        gsap.fromTo(
          words,
          { opacity: 0.1 },
          {
            opacity: 1,
            stagger: 0.05,
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 70%",
              end: "bottom 40%",
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const splitText = "We are a collective of developers, designers, and creative technologists pushing the boundaries of what's possible on the web. Every pixel is intentional. Every interaction is crafted.";

  return (
    <section ref={sectionRef} id="about" className="relative z-10 py-40 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-20">About</h2>

        <p ref={textRef} className="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-32">
          {splitText.split(" ").map((word, i) => (
            <span key={i} className="inline-block mr-[0.3em]">
              {word}
            </span>
          ))}
        </p>

        {/* Capabilities */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4 mb-32">
          {capabilities.map((cap) => (
            <div key={cap} className="flex items-center gap-3 py-4 border-b border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500/60" />
              <span className="text-sm text-white/60">{cap}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-20">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-6xl font-extralight gradient-text mb-2">{stat.value}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
