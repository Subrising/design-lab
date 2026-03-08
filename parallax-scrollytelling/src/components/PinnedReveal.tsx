"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Scrub Animation",
    description:
      "The animation's progress is directly tied to the scrollbar. Scroll forward to play, scroll back to rewind.",
    color: "#6366f1",
    icon: "⟳",
  },
  {
    title: "Pin & Unpin",
    description:
      "Elements freeze in place while the scroll drives their animations, then seamlessly release when complete.",
    color: "#a855f7",
    icon: "⊡",
  },
  {
    title: "Stagger Reveals",
    description:
      "Child elements cascade into view with calculated delays, creating a wave-like choreography.",
    color: "#ec4899",
    icon: "◈",
  },
];

export default function PinnedReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !panelRef.current) return;

    const cards = panelRef.current.querySelectorAll(".feature-card");

    // Pin the section
    const pinTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${window.innerHeight * 2}`,
      pin: true,
      pinSpacing: true,
    });

    // Stagger reveal cards
    gsap.from(cards, {
      x: 100,
      opacity: 0,
      scale: 0.8,
      stagger: 0.3,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${window.innerHeight * 1.5}`,
        scrub: 1,
      },
    });

    // Animate the glow ring
    const ring = sectionRef.current.querySelector(".glow-ring");
    if (ring) {
      gsap.to(ring, {
        rotation: 360,
        scale: 1.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${window.innerHeight * 2}`,
          scrub: true,
        },
      });
    }

    return () => {
      pinTrigger.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="section-full relative">
      {/* Rotating glow ring */}
      <div
        className="glow-ring absolute w-[600px] h-[600px] rounded-full border border-indigo-500/10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          boxShadow: "0 0 80px rgba(99, 102, 241, 0.1), inset 0 0 80px rgba(99, 102, 241, 0.05)",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-lg text-purple-400 uppercase tracking-widest mb-4">
            Chapter 02
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Pinned Sections
          </h2>
        </div>

        <div ref={panelRef} className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card backdrop-blur-xl rounded-2xl p-8 border border-white/5"
              style={{
                background: `linear-gradient(135deg, ${f.color}10, transparent)`,
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6"
                style={{ background: `${f.color}20`, color: f.color }}
              >
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
