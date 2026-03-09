"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = sectionRef.current?.querySelectorAll("[data-animate]");
      if (!elements) return;

      elements.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 px-6 md:px-24"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div data-animate className="divider mx-auto mb-12" />

        <h2
          data-animate
          className="font-serif text-3xl md:text-5xl leading-relaxed tracking-wide text-cream/90"
          style={{ fontWeight: 300 }}
        >
          Every love story deserves to be told
          <br />
          with the beauty it holds
        </h2>

        <p
          data-animate
          className="mt-10 font-sans text-sm md:text-base leading-relaxed text-warm-gray max-w-2xl mx-auto"
          style={{ fontWeight: 300 }}
        >
          Based in the heart of Italy, we capture the essence of your most
          precious moments. Our approach blends documentary authenticity with
          cinematic artistry, creating timeless imagery that transcends the
          ordinary.
        </p>

        <div data-animate className="mt-16 flex items-center justify-center gap-16 text-center">
          {[
            { number: "200+", label: "Weddings" },
            { number: "15", label: "Years" },
            { number: "12", label: "Countries" },
          ].map((stat) => (
            <div key={stat.label}>
              <span className="font-serif text-3xl md:text-4xl text-cream/80" style={{ fontWeight: 300 }}>
                {stat.number}
              </span>
              <p className="mt-2 font-sans text-[10px] tracking-[0.3em] uppercase text-warm-gray" style={{ fontWeight: 300 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
