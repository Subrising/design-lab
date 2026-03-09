"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: "01",
    title: "Precision Animations",
    description:
      "Every micro-interaction is choreographed with frame-perfect timing. GSAP-powered motion that responds to user intent.",
    tag: "Motion",
  },
  {
    icon: "02",
    title: "Scalable Architecture",
    description:
      "Built on a foundation that grows with you. From prototype to production in record time, without technical debt.",
    tag: "Engineering",
  },
  {
    icon: "03",
    title: "Immersive 3D",
    description:
      "WebGL-accelerated particle systems and ambient backgrounds that create depth without distraction.",
    tag: "Visual",
  },
  {
    icon: "04",
    title: "Fluid Scrolling",
    description:
      "Lenis-powered smooth scroll with momentum-based physics. Every scroll feels like silk on glass.",
    tag: "Experience",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      if (headingRef.current) {
        const lines = headingRef.current.querySelectorAll(".reveal-line");
        gsap.fromTo(
          lines,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 80%",
              end: "bottom 60%",
            },
          }
        );
      }

      // Cards staggered reveal
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".feature-card");
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 100, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.9,
              delay: i * 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
              },
            }
          );

          // Hover glow effect
          const glowEl = card.querySelector(".card-glow");
          card.addEventListener("mouseenter", () => {
            gsap.to(glowEl, { opacity: 1, duration: 0.4 });
            gsap.to(card, { y: -5, duration: 0.3, ease: "power2.out" });
          });
          card.addEventListener("mouseleave", () => {
            gsap.to(glowEl, { opacity: 0, duration: 0.4 });
            gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" });
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-32 md:py-48 px-6 md:px-12 section-wrapper"
    >
      <div ref={headingRef} className="max-w-7xl mx-auto mb-20">
        <div className="overflow-hidden">
          <p className="reveal-line text-sm text-[#6366f1] font-medium tracking-widest uppercase mb-4 opacity-0">
            Features
          </p>
        </div>
        <div className="overflow-hidden">
          <h2 className="reveal-line text-4xl md:text-6xl font-bold tracking-tight opacity-0">
            Craft with
          </h2>
        </div>
        <div className="overflow-hidden">
          <h2 className="reveal-line text-4xl md:text-6xl font-bold tracking-tight gradient-text opacity-0">
            unmatched precision.
          </h2>
        </div>
      </div>

      <div
        ref={cardsRef}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {features.map((feature) => (
          <div
            key={feature.icon}
            className="feature-card relative group p-8 md:p-10 rounded-2xl border border-[#27272a] bg-[#0a0a0a]/80 backdrop-blur-sm cursor-pointer overflow-hidden"
            style={{ opacity: 0 }}
          >
            {/* Glow effect */}
            <div
              className="card-glow absolute inset-0 opacity-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99,102,241,0.06), transparent 40%)",
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold text-[#27272a]">
                  {feature.icon}
                </span>
                <span className="px-3 py-1 text-xs rounded-full border border-[#27272a] text-[#71717a]">
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3">
                {feature.title}
              </h3>
              <p className="text-[#71717a] leading-relaxed">
                {feature.description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm text-[#6366f1] font-medium group-hover:gap-3 transition-all">
                Learn more
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform group-hover:translate-x-1"
                >
                  <path
                    d="M3 8h10m0 0L9 4m4 4L9 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
