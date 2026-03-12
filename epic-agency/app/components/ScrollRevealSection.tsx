"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollRevealSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linesRef = useRef<HTMLDivElement[]>([]);
  const statsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Background color transition
    gsap.to(section, {
      backgroundColor: "#e8e0d5",
      color: "#0a0a0a",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
      },
    });

    // Heading reveal - split into lines
    if (headingRef.current) {
      const words = headingRef.current.querySelectorAll(".word");
      gsap.fromTo(
        words,
        { y: "100%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          stagger: 0.08,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 75%",
          },
        }
      );
    }

    // Horizontal lines expand
    linesRef.current.forEach((line, i) => {
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          delay: i * 0.15,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: line,
            start: "top 80%",
          },
        }
      );
    });

    // Stats counter animation
    statsRef.current.forEach((stat) => {
      const target = parseInt(stat.dataset.value || "0", 10);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: stat,
          start: "top 80%",
        },
        onUpdate: () => {
          stat.textContent = Math.round(obj.val).toString();
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const stats = [
    { value: 247, label: "Projects Delivered" },
    { value: 18, label: "Years of Craft" },
    { value: 42, label: "Awards Won" },
    { value: 12, label: "Global Offices" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 px-4 md:px-8 transition-colors"
      style={{ background: "var(--color-epic-black)" }}
    >
      <div className="max-w-[1800px] mx-auto">
        {/* Staggered heading */}
        <h2 ref={headingRef} className="display-medium font-sans mb-24">
          <div className="overflow-hidden">
            <span className="word inline-block">We don&apos;t follow</span>
          </div>
          <div className="overflow-hidden">
            <span className="word inline-block">conventions.</span>
          </div>
          <div className="overflow-hidden">
            <span className="word inline-block" style={{ color: "var(--color-epic-red)" }}>
              We set them.
            </span>
          </div>
        </h2>

        {/* Divider */}
        <div
          ref={(el) => {
            if (el) linesRef.current[0] = el;
          }}
          className="line-accent mb-20"
          style={{ opacity: 0.2 }}
        />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 mb-32">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] opacity-40 mb-6">
              Philosophy
            </p>
            <p className="text-lg md:text-xl leading-relaxed opacity-70">
              Every project begins with a question: what hasn&apos;t been done?
              We exist at the intersection of strategy and spectacle, where
              commercial objectives meet creative ambition. Our work isn&apos;t
              just seen — it&apos;s felt.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] opacity-40 mb-6">
              Approach
            </p>
            <p className="text-lg md:text-xl leading-relaxed opacity-70">
              We believe in the power of restraint and the impact of bold
              decisions. Each pixel, each frame, each word is deliberate. We
              strip away the unnecessary to reveal what matters — the core idea
              that moves people.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          ref={(el) => {
            if (el) linesRef.current[1] = el;
          }}
          className="line-accent mb-20"
          style={{ opacity: 0.2 }}
        />

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center md:text-left">
              <div className="flex items-baseline gap-1">
                <span
                  ref={(el) => {
                    if (el) statsRef.current[i] = el;
                  }}
                  data-value={stat.value}
                  className="display-medium font-sans font-bold"
                >
                  0
                </span>
                <span className="text-2xl opacity-30">+</span>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] opacity-40 mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
