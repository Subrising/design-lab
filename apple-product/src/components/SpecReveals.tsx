"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}

function AnimatedCounter({ end, suffix = "", prefix = "", decimals = 0, duration = 2 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        const obj = { val: 0 };
        gsap.to(obj, {
          val: end,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = prefix + obj.val.toFixed(decimals) + suffix;
          },
        });
      },
    });

    return () => trigger.kill();
  }, [end, suffix, prefix, decimals, duration]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

interface SpecCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  description: string;
  gradient: string;
  icon: string;
  delay?: number;
}

function SpecCard({ title, value, suffix, prefix, decimals, description, gradient, icon, delay = 0 }: SpecCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="spec-card-glow rounded-3xl p-8 md:p-10 opacity-0"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <p className="text-[#86868b] text-sm font-semibold uppercase tracking-wider mb-3">
        {title}
      </p>
      <div
        className="font-display tracking-tight"
        style={{
          fontSize: "clamp(48px, 5vw, 72px)",
          fontWeight: 700,
          lineHeight: 1,
          background: gradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        <AnimatedCounter end={value} suffix={suffix} prefix={prefix} decimals={decimals} />
      </div>
      <p className="text-[#86868b] mt-4" style={{ fontSize: "17px", lineHeight: 1.47 }}>
        {description}
      </p>
    </div>
  );
}

function FeatureReveal({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [index]);

  return (
    <div ref={ref} className="opacity-0">
      {children}
    </div>
  );
}

const specs: SpecCardProps[] = [
  {
    title: "A18 Pro Chip",
    value: 6,
    suffix: "-core GPU",
    description: "Hardware-accelerated ray tracing makes games look and feel incredibly immersive with more realistic lighting.",
    gradient: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    icon: "⚡",
  },
  {
    title: "Battery Life",
    value: 33,
    suffix: " hrs",
    description: "Longest battery life ever on iPhone. Up to 33 hours of video playback.",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    icon: "🔋",
  },
  {
    title: "Camera System",
    value: 48,
    suffix: "MP",
    description: "48MP Fusion camera with a 2nd-gen quad-pixel sensor. 48MP Ultra Wide. 5x Telephoto.",
    gradient: "linear-gradient(135deg, #f5c77e 0%, #e8a849 100%)",
    icon: "📸",
  },
  {
    title: "Display",
    value: 6.9,
    suffix: "\"",
    decimals: 1,
    description: "The largest iPhone display ever. Super Retina XDR with ProMotion and Always-On.",
    gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    icon: "✨",
  },
  {
    title: "Peak Brightness",
    value: 2000,
    suffix: " nits",
    description: "Up to 2000 nits peak outdoor brightness. See clearly even in direct sunlight.",
    gradient: "linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)",
    icon: "☀️",
  },
  {
    title: "Camera Control",
    value: 5,
    prefix: "",
    suffix: "x optical",
    description: "New Camera Control button. A faster, more intuitive way to capture the moment.",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    icon: "🎯",
  },
];

export default function SpecReveals() {
  return (
    <section className="relative py-32 md:py-40 px-6">
      {/* Section header */}
      <FeatureReveal index={0}>
        <div className="text-center max-w-4xl mx-auto mb-20 md:mb-28">
          <p className="text-[#2997ff] font-semibold text-lg tracking-wide uppercase mb-4">
            Performance
          </p>
          <h2
            className="font-display tracking-tight text-white"
            style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, lineHeight: 1.07 }}
          >
            A powerhouse of
            <br />
            <span className="text-gradient-apple">intelligence.</span>
          </h2>
          <p
            className="text-[#86868b] mt-6 max-w-2xl mx-auto"
            style={{ fontSize: "clamp(17px, 2vw, 21px)", lineHeight: 1.381 }}
          >
            iPhone 16 Pro features a chip designed for Apple Intelligence, a remarkable new camera, and the thinnest borders ever on iPhone.
          </p>
        </div>
      </FeatureReveal>

      {/* Spec grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {specs.map((spec, i) => (
          <SpecCard key={spec.title} {...spec} delay={i * 0.1} />
        ))}
      </div>

      {/* Feature comparison strip */}
      <FeatureReveal index={1}>
        <div className="max-w-4xl mx-auto mt-28 text-center">
          <h3
            className="font-display tracking-tight text-white mb-12"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700 }}
          >
            Why iPhone 16 Pro
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Apple Intelligence", desc: "Personal intelligence system that transforms how you work, create, and communicate." },
              { label: "Camera Control", desc: "A new button that gives you an easier, faster way to access camera tools." },
              { label: "A18 Pro", desc: "Fastest chip ever in a smartphone powers advanced features and unparalleled efficiency." },
            ].map((item) => (
              <div key={item.label} className="text-left md:text-center">
                <h4 className="text-white font-semibold text-xl mb-2">{item.label}</h4>
                <p className="text-[#86868b]" style={{ fontSize: "15px", lineHeight: 1.47 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FeatureReveal>
    </section>
  );
}
