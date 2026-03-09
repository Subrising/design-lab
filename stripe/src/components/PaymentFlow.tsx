"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const steps = [
  { id: "init", label: "Customer initiates", icon: "🛒", time: "0ms" },
  { id: "auth", label: "Card authenticated", icon: "🔒", time: "120ms" },
  { id: "process", label: "Payment processed", icon: "⚡", time: "340ms" },
  { id: "confirm", label: "Confirmation sent", icon: "✅", time: "450ms" },
];

export default function PaymentFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const [activeStep, setActiveStep] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    const timers: NodeJS.Timeout[] = [];
    steps.forEach((_, i) => {
      timers.push(setTimeout(() => setActiveStep(i), (i + 1) * 800));
    });
    timers.push(setTimeout(() => setIsComplete(true), steps.length * 800 + 600));

    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-stripe-purple/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-stripe-cyan font-semibold mb-4 text-lg">Built for speed</p>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            See a payment in <span className="gradient-text">real time</span>
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Watch how Stripe processes a payment in milliseconds — from initiation to confirmation.
          </p>
        </motion.div>

        {/* Payment flow visualization */}
        <div className="max-w-4xl mx-auto">
          {/* Credit card */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 15 }}
            animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-80 mb-16 perspective-[800px]"
          >
            <div className="relative bg-gradient-to-br from-stripe-purple via-[#8b5cf6] to-stripe-cyan rounded-2xl p-6 h-48 overflow-hidden shimmer">
              <div className="absolute top-4 right-4 flex gap-1">
                <div className="w-6 h-6 rounded-full bg-red-400 opacity-80" />
                <div className="w-6 h-6 rounded-full bg-orange-400 opacity-80 -ml-2" />
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex gap-3 mb-4 font-mono text-lg tracking-[0.2em] text-white/90">
                  <span>4242</span><span>4242</span><span>4242</span><span>4242</span>
                </div>
                <div className="flex justify-between text-sm text-white/60">
                  <span>JENNY ROSEN</span>
                  <span>12/28</span>
                </div>
              </div>
              {/* Holographic effect */}
              <motion.div
                animate={{ x: [-200, 400], opacity: [0, 0.3, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                className="absolute inset-0 w-40 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
            </div>
          </motion.div>

          {/* Timeline steps */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

            <motion.div
              className="absolute left-1/2 top-0 w-px bg-gradient-to-b from-stripe-purple to-stripe-cyan -translate-x-1/2"
              initial={{ height: 0 }}
              animate={isInView ? { height: `${Math.min(100, ((activeStep + 1) / steps.length) * 100)}%` } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            <div className="space-y-16">
              {steps.map((step, i) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0 }}
                  animate={activeStep >= i ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4 }}
                  className={`relative flex items-center gap-8 ${i % 2 === 0 ? "" : "flex-row-reverse"}`}
                >
                  {/* Node */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={activeStep >= i ? { scale: 1 } : {}}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-12 h-12 rounded-full bg-stripe-blue border-2 border-stripe-purple flex items-center justify-center text-lg"
                    >
                      {activeStep >= i ? step.icon : ""}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <motion.div
                    initial={{ x: i % 2 === 0 ? -30 : 30, opacity: 0 }}
                    animate={activeStep >= i ? { x: 0, opacity: 1 } : {}}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className={`flex-1 ${i % 2 === 0 ? "text-right pr-16" : "text-left pl-16"}`}
                  >
                    <p className="font-semibold text-lg">{step.label}</p>
                    <p className="text-sm text-stripe-cyan font-mono">{step.time}</p>
                  </motion.div>

                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Success state */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mt-16 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-stripe-green to-stripe-cyan mx-auto flex items-center justify-center mb-4"
                >
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    />
                  </svg>
                </motion.div>
                <p className="text-2xl font-bold text-stripe-green">Payment Complete</p>
                <p className="text-white/40 mt-1">Total processing time: 450ms</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
