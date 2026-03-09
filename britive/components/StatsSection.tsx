"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 99.9, suffix: "%", label: "Uptime SLA" },
  { value: 10, suffix: "M+", label: "API Requests / Day" },
  { value: 150, suffix: "+", label: "Enterprise Clients" },
  { value: 4.9, suffix: "/5", label: "Developer Rating" },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      const heading = sectionRef.current?.querySelector(".stats-heading");
      if (heading) {
        gsap.fromTo(
          heading,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 80%",
            },
          }
        );
      }

      // Stat items
      const items = sectionRef.current?.querySelectorAll(".stat-item");
      items?.forEach((item, i) => {
        const numberEl = item.querySelector(".stat-number");
        const labelEl = item.querySelector(".stat-label");
        const lineEl = item.querySelector(".stat-line");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
          },
        });

        // Line wipe
        tl.fromTo(
          lineEl,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: "power3.inOut" }
        );

        // Number count up
        const targetValue = stats[i].value;
        const obj = { val: 0 };
        tl.to(
          obj,
          {
            val: targetValue,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              if (numberEl) {
                const formatted =
                  targetValue % 1 !== 0
                    ? obj.val.toFixed(1)
                    : Math.floor(obj.val).toString();
                numberEl.textContent = formatted + stats[i].suffix;
              }
            },
          },
          "-=0.6"
        );

        // Label fade
        tl.fromTo(
          labelEl,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=1.5"
        );
      });

      // Divider line animation
      const divider = sectionRef.current?.querySelector(".section-divider");
      if (divider) {
        gsap.fromTo(
          divider,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: divider,
              start: "top 90%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative py-32 md:py-48 px-6 md:px-12 section-wrapper"
    >
      <div className="max-w-7xl mx-auto">
        {/* Divider */}
        <div
          className="section-divider h-px bg-[#27272a] mb-20 origin-left"
          style={{ transform: "scaleX(0)" }}
        />

        <div className="stats-heading mb-16 opacity-0">
          <p className="text-sm text-[#6366f1] font-medium tracking-widest uppercase mb-4">
            Impact
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Numbers that
            <br />
            <span className="gradient-text">speak volumes.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item">
              <div
                className="stat-line h-px bg-[#6366f1] mb-6 origin-left"
                style={{ transform: "scaleX(0)" }}
              />
              <div className="stat-number text-4xl md:text-5xl font-bold tracking-tight">
                0{stat.suffix}
              </div>
              <div className="stat-label text-[#71717a] text-sm mt-2 opacity-0">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
