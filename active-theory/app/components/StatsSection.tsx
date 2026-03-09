"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 150, suffix: "+", label: "Projects Delivered" },
  { value: 12, suffix: "M+", label: "Users Reached" },
  { value: 45, suffix: "+", label: "Awards Won" },
  { value: 8, suffix: "", label: "Years of Craft" },
];

function AnimatedNumber({
  target,
  suffix,
  inView,
}: {
  target: number;
  suffix: string;
  inView: boolean;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target]);

  return (
    <span>
      {value}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-32 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="text-center group"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(30px)",
              transition: `all 0.6s ease ${i * 150}ms`,
            }}
          >
            <div className="text-4xl md:text-6xl font-bold text-accent mb-2 tracking-tight">
              <AnimatedNumber
                target={stat.value}
                suffix={stat.suffix}
                inView={inView}
              />
            </div>
            <div className="text-xs font-mono tracking-[0.15em] text-muted uppercase">
              {stat.label}
            </div>
            <div className="mt-4 h-px w-12 mx-auto bg-accent/20 group-hover:w-full group-hover:bg-accent/40 transition-all duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}
