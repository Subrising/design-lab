"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For personal projects and prototypes",
    features: [
      "10,000 monthly active users",
      "Pre-built components",
      "Community support",
      "5 social connections",
      "Email/password auth",
    ],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$25",
    period: "/mo",
    description: "For growing applications",
    features: [
      "100,000 monthly active users",
      "Custom domains",
      "Remove Clerk branding",
      "Allowlist / blocklist",
      "Multi-factor auth",
      "Priority support",
      "Advanced analytics",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large-scale deployments",
    features: [
      "Unlimited MAUs",
      "SAML SSO",
      "SLA guarantees",
      "Dedicated support",
      "Custom contracts",
      "SOC 2 report access",
      "HIPAA compliance",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export default function Pricing() {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  return (
    <section className="relative py-32 px-6" id="pricing">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#6C47FF] mb-4 block">PRICING</span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Start free, <span className="gradient-text">scale infinitely</span>
          </h2>
          <p className="text-lg text-[#8B8B9E] max-w-2xl mx-auto">
            No credit card required. Upgrade as you grow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onHoverStart={() => setHoveredPlan(i)}
              onHoverEnd={() => setHoveredPlan(null)}
              className={`relative rounded-2xl p-6 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-gradient-to-b from-[#6C47FF]/20 to-[#131320] border border-[#6C47FF]/30"
                  : "bg-[#131320] border border-white/[0.06]"
              } ${hoveredPlan === i ? "scale-[1.02]" : ""}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-[#6C47FF] text-white text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
              <p className="text-sm text-[#8B8B9E] mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-[#8B8B9E] text-sm">{plan.period}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors mb-6 ${
                  plan.highlighted
                    ? "bg-[#6C47FF] hover:bg-[#5A38E0] text-white"
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                }`}
              >
                {plan.cta}
              </motion.button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-[#8B8B9E]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
                      <path d="M4 8L7 11L12 5" stroke="#6C47FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
