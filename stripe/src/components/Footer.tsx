"use client";

import { motion } from "framer-motion";

const footerLinks = {
  Products: ["Payments", "Billing", "Connect", "Invoicing", "Terminal", "Financial Connections"],
  Solutions: ["SaaS", "E-Commerce", "Marketplaces", "Platforms", "Creator Economy"],
  Developers: ["Documentation", "API Reference", "API Status", "API Changelog", "Build a Stripe App"],
  Resources: ["Support Center", "Guides", "Blog", "Annual Conference", "Contact Sales"],
  Company: ["About", "Customers", "Enterprise", "Partners", "Jobs", "Newsroom"],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      {/* CTA Section */}
      <div className="mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-white/50 mb-8 max-w-xl mx-auto">
            Explore Stripe Docs, or create an account instantly and start accepting payments.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="px-8 py-4 bg-stripe-purple text-white font-semibold rounded-full hover:bg-stripe-purple/80 transition-colors">
              Start now →
            </a>
            <a href="#" className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 transition-colors">
              Contact sales
            </a>
          </div>
        </motion.div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <svg viewBox="0 0 60 25" className="h-6 w-auto" fill="white" opacity="0.4">
              <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a12.1 12.1 0 01-4.56.88c-4.02 0-6.83-2.44-6.83-7.14 0-4.23 2.47-7.2 6.23-7.2 3.71 0 6.06 2.82 6.06 6.94 0 .57-.04 1.13-.09 1.6zm-8.09-2.49h4.44c0-1.73-.87-2.75-2.17-2.75-1.25 0-2.13.98-2.27 2.75zM40.95 5.97c1.38 0 2.52.3 3.39.82v3.72a5.42 5.42 0 00-2.93-.88c-2.24 0-3.55 1.57-3.55 3.53 0 2.13 1.35 3.48 3.48 3.48 1.16 0 2.13-.34 3-.88v3.7c-.85.47-2.11.82-3.56.82-4.37 0-7.14-2.86-7.14-7.08 0-4.23 2.89-7.23 7.31-7.23z" />
            </svg>
            <span className="text-sm text-white/30">© Stripe Replica — Design Lab Experiment</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
