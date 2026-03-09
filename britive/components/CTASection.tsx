"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = sectionRef.current?.querySelectorAll(".cta-reveal");
      if (elements) {
        gsap.fromTo(
          elements,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            },
          }
        );
      }

      // Animated border glow
      const glowBox = sectionRef.current?.querySelector(".cta-glow-box");
      if (glowBox) {
        gsap.to(glowBox, {
          backgroundPosition: "200% center",
          duration: 3,
          repeat: -1,
          ease: "none",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative py-32 md:py-48 px-6 md:px-12 section-wrapper"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="cta-reveal opacity-0">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#27272a] bg-[#18181b]/50 text-xs text-[#71717a] mb-8">
            Ready to start?
          </span>
        </div>

        <h2 className="cta-reveal text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight opacity-0">
          Let&apos;s build
          <br />
          <span className="gradient-text">something remarkable.</span>
        </h2>

        <p className="cta-reveal mt-6 text-lg text-[#71717a] max-w-xl mx-auto opacity-0">
          Join thousands of teams already crafting extraordinary experiences
          with Britive.
        </p>

        <div className="cta-reveal mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0">
          <button className="cta-glow-box px-10 py-4 bg-[#6366f1] text-white rounded-full text-sm font-medium hover:bg-[#818cf8] transition-all hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] bg-[length:200%_auto]">
            Get Started — It&apos;s Free
          </button>
          <button className="px-10 py-4 border border-[#27272a] text-white rounded-full text-sm font-medium hover:bg-[#18181b] transition-colors">
            Talk to Sales
          </button>
        </div>
      </div>
    </section>
  );
}
