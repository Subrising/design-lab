"use client";

import { motion } from "framer-motion";

const companies = [
  "Vercel", "Stripe", "Linear", "Notion", "Figma", "GitHub", "Slack", "Discord",
];

export default function LogoCloud() {
  return (
    <section className="py-20 border-t border-border/50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-muted uppercase tracking-widest mb-10"
        >
          Trusted by teams at
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {companies.map((company, i) => (
            <motion.span
              key={company}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="text-sm font-medium text-muted/50 hover:text-muted transition-colors cursor-default"
            >
              {company}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
