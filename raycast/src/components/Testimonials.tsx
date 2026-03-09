"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const testimonials = [
  {
    quote:
      "Raycast has completely replaced Spotlight for me. The speed and extensibility are unmatched.",
    author: "Sarah Chen",
    role: "Staff Engineer at Vercel",
    gradient: "from-ray-pink to-ray-purple",
  },
  {
    quote:
      "The AI integration is mind-blowing. I can search, summarize, and act on information without leaving my flow.",
    author: "Marcus Webb",
    role: "Design Lead at Linear",
    gradient: "from-ray-purple to-ray-blue",
  },
  {
    quote:
      "Finally a launcher that respects keyboard power users. Every interaction feels instant and intentional.",
    author: "Yuki Tanaka",
    role: "Founder at Craft",
    gradient: "from-ray-blue to-ray-green",
  },
];

export default function Testimonials() {
  return (
    <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            Loved by <span className="gradient-text-warm">developers</span>
          </h2>
          <p className="text-ray-muted text-lg">
            Join thousands of developers who ship faster with Raycast.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <ScrollReveal key={t.author} delay={i * 0.1}>
            <div className="glass-card p-6 sm:p-8 h-full flex flex-col">
              <div
                className={`w-10 h-1 rounded-full bg-gradient-to-r ${t.gradient} mb-6`}
              />
              <p className="text-sm sm:text-base text-ray-text leading-relaxed mb-6 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-bold text-white`}
                >
                  {t.author[0]}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {t.author}
                  </div>
                  <div className="text-xs text-ray-muted">{t.role}</div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Stats */}
      <ScrollReveal>
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: "500K+", label: "Active users" },
            { value: "2,000+", label: "Extensions" },
            { value: "4ms", label: "Avg search time" },
            { value: "4.9★", label: "App Store rating" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-4xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-ray-muted">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
