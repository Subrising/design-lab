"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: "⚡",
    title: "Lightning Fast",
    description:
      "Sub-millisecond response times. Every interaction feels instant, every transition buttery smooth.",
    metric: "< 1ms",
    metricLabel: "response time",
  },
  {
    icon: "🔒",
    title: "Vault Security",
    description:
      "Enterprise-grade encryption at rest and in transit. SOC 2 Type II certified. Zero-trust architecture.",
    metric: "256-bit",
    metricLabel: "AES encryption",
  },
  {
    icon: "🧠",
    title: "AI Native",
    description:
      "Intelligence woven into every workflow. Smart suggestions, automated insights, predictive actions.",
    metric: "10x",
    metricLabel: "productivity gain",
  },
  {
    icon: "🌐",
    title: "Global Scale",
    description:
      "Edge-deployed across 200+ regions. Your data lives close to your users, always.",
    metric: "200+",
    metricLabel: "edge regions",
  },
  {
    icon: "🔄",
    title: "Real-time Sync",
    description:
      "Conflict-free collaboration with CRDTs. Every change propagates instantly across all devices.",
    metric: "0ms",
    metricLabel: "sync latency",
  },
  {
    icon: "📊",
    title: "Deep Analytics",
    description:
      "Understand your workflow with precision. Custom dashboards, funnel analysis, cohort tracking.",
    metric: "∞",
    metricLabel: "custom queries",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.from(headingRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      });

      // Stagger cards
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.from(cards, {
          y: 80,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 75%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 md:px-12 lg:px-20"
    >
      {/* Section heading */}
      <div ref={headingRef} className="max-w-3xl mx-auto text-center mb-20">
        <p className="text-sm font-mono text-accent uppercase tracking-[0.2em] mb-4">
          Features
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
          Everything you need,
          <br />
          <span className="text-white/40">nothing you don&apos;t</span>
        </h2>
      </div>

      {/* Feature grid */}
      <div
        ref={cardsRef}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature) => (
          <div key={feature.title} className="feature-card p-8 group">
            <div className="text-3xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gradient transition-colors">
              {feature.title}
            </h3>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              {feature.description}
            </p>
            <div className="flex items-baseline gap-2 pt-4 border-t border-white/[0.06]">
              <span className="text-2xl font-bold text-gradient">
                {feature.metric}
              </span>
              <span className="text-xs text-white/30 uppercase tracking-wider">
                {feature.metricLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
