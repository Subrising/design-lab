"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    quote: "Linear has transformed how our engineering team operates. The speed is unmatched.",
    author: "Sarah Chen",
    role: "VP Engineering",
    company: "Vercel",
    avatar: "SC",
  },
  {
    quote: "We moved from Jira to Linear and never looked back. Our sprint velocity increased 40%.",
    author: "Marcus Rivera",
    role: "CTO",
    company: "Loom",
    avatar: "MR",
  },
  {
    quote: "The keyboard-first approach makes Linear feel like a superpower for developers.",
    author: "Alex Kim",
    role: "Staff Engineer",
    company: "Stripe",
    avatar: "AK",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-32 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[13px] font-medium text-linear-purple uppercase tracking-widest mb-4">
            Loved by teams
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] gradient-text">
            Trusted by the best
            <br />
            product teams
          </h2>
        </motion.div>

        {/* Logo bar */}
        <motion.div
          className="flex items-center justify-center gap-12 mb-20 opacity-40"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.4 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {["Vercel", "Stripe", "Loom", "Ramp", "Cash App", "Retool"].map((name) => (
            <span key={name} className="text-[15px] font-semibold tracking-tight text-white/60">
              {name}
            </span>
          ))}
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              className="glass rounded-2xl p-8 hover:bg-white/[0.04] transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              whileHover={{ y: -4 }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#7c5cfc">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              <p className="text-[15px] text-linear-text leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-linear-purple to-linear-blue flex items-center justify-center text-[11px] font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-linear-text">{t.author}</p>
                  <p className="text-[12px] text-linear-text-secondary">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
