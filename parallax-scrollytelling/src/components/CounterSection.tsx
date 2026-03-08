"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 60, suffix: "fps", label: "Buttery Smooth" },
  { value: 100, suffix: "vh", label: "Full Viewport" },
  { value: 5, suffix: "", label: "Sections Deep" },
  { value: 0, suffix: "px", label: "Layout Shift" },
];

export default function CounterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const counters = sectionRef.current.querySelectorAll(".counter-value");

    counters.forEach((counter, i) => {
      const target = stats[i].value;
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: counter,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        onUpdate: () => {
          counter.textContent = Math.round(obj.val).toString();
        },
      });
    });

    // Animate the divider lines
    gsap.from(sectionRef.current.querySelectorAll(".stat-divider"), {
      scaleY: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  return (
    <section ref={sectionRef} className="section-full relative">
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-lg text-rose-400 uppercase tracking-widest mb-4">
            Chapter 04
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            By The Numbers
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="relative text-center">
              {i > 0 && (
                <div className="stat-divider hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              )}
              <div className="text-5xl md:text-6xl font-bold">
                <span className="counter-value bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
                  0
                </span>
                <span className="text-2xl md:text-3xl text-gray-500">
                  {stat.suffix}
                </span>
              </div>
              <p className="mt-3 text-gray-400 text-sm uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
