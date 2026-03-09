"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const lineRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Each line reveals on scroll
      lineRefs.current.forEach((line, i) => {
        if (!line) return;
        gsap.fromTo(
          line,
          { y: 60, opacity: 0, skewY: 3 },
          {
            y: 0,
            opacity: 1,
            skewY: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: line,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.05,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addLineRef = (el: HTMLSpanElement | null, i: number) => {
    if (el) lineRefs.current[i] = el;
  };

  const lines = [
    "Helping brands thrive",
    "in the digital world",
  ];

  const bodyLines = [
    "I help companies from all over the world with tailor-made solutions.",
    "With each project, I push my work to new horizons, always putting",
    "quality first.",
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-[var(--color-bg-light)] py-40"
    >
      {/* Rounded top edge */}
      <div className="absolute top-0 left-0 w-full">
        <div
          className="h-[80px] w-full bg-[var(--color-bg)]"
          style={{ borderRadius: "0 0 50% 50%" }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-8 pt-16">
        <p className="mb-16 text-[clamp(2rem,4.5vw,4rem)] leading-[1.15] font-light tracking-tight">
          {lines.map((line, i) => (
            <span
              key={i}
              ref={(el) => addLineRef(el, i)}
              className="block overflow-hidden"
            >
              <span className="inline-block">{line}</span>
            </span>
          ))}
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            {bodyLines.map((line, i) => (
              <p
                key={i}
                ref={(el) => addLineRef(el as HTMLSpanElement, lines.length + i)}
                className="text-lg leading-relaxed text-[var(--color-text-muted)]"
              >
                {line}
              </p>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <StatItem label="Digital Products" value="25+" index={0} />
            <StatItem label="Years Experience" value="8+" index={1} />
            <StatItem label="Awards" value="12" index={2} />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({
  label,
  value,
  index,
}: {
  label: string;
  value: string;
  index: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!itemRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        itemRef.current,
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: index * 0.15,
          scrollTrigger: {
            trigger: itemRef.current,
            start: "top 90%",
          },
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={itemRef}
      className="flex items-center justify-between border-b border-white/10 pb-4"
    >
      <span className="text-sm text-[var(--color-text-muted)]">{label}</span>
      <span className="text-4xl font-light">{value}</span>
    </div>
  );
}
