"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import GradientMesh from "./GradientMesh";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      <GradientMesh />

      {/* Floating grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-lg text-white/60 mb-6"
          >
            Financial infrastructure for the internet
          </motion.p>

          <h1 className="text-6xl md:text-8xl font-bold leading-[0.95] tracking-tight mb-8">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="block"
            >
              Payments
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="block gradient-text"
            >
              infrastructure
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="block"
            >
              for the internet
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="text-xl text-white/60 max-w-2xl mb-10 leading-relaxed"
          >
            Millions of companies of all sizes use Stripe&apos;s software and APIs
            to accept payments, send payouts, and manage their businesses online.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#"
              className="group relative px-8 py-4 bg-white text-stripe-blue font-semibold rounded-full overflow-hidden transition-transform hover:scale-105"
            >
              <span className="relative z-10">Start now →</span>
              <div className="absolute inset-0 bg-gradient-to-r from-stripe-purple to-stripe-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute inset-0 z-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                Start now →
              </span>
            </a>
            <a
              href="#"
              className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              Contact sales
            </a>
          </motion.div>
        </motion.div>

        {/* Floating code snippet decoration */}
        <motion.div
          initial={{ opacity: 0, x: 60, y: 40 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 w-[420px]"
        >
          <div className="glass-card p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-white/40 text-xs">payment.js</span>
            </div>
            <CodeLine delay={1.2} color="text-stripe-cyan">
              {"const stripe = require('stripe');"}
            </CodeLine>
            <CodeLine delay={1.4} color="text-white/50">{""}</CodeLine>
            <CodeLine delay={1.6} color="text-stripe-green">
              {"const payment = await stripe.paymentIntents"}
            </CodeLine>
            <CodeLine delay={1.8} color="text-stripe-green">
              {"  .create({"}
            </CodeLine>
            <CodeLine delay={2.0} color="text-white/70">
              {"    amount: "}
              <span className="text-stripe-orange">2000</span>,
            </CodeLine>
            <CodeLine delay={2.2} color="text-white/70">
              {"    currency: "}
              <span className="text-stripe-green">&apos;usd&apos;</span>,
            </CodeLine>
            <CodeLine delay={2.4} color="text-stripe-green">
              {"  });"}
            </CodeLine>
            <CodeLine delay={2.8} color="text-stripe-purple">
              {"// ✓ Payment successful"}
            </CodeLine>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function CodeLine({ children, delay, color }: { children: React.ReactNode; delay: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`${color} leading-7`}
    >
      {children}
    </motion.div>
  );
}
