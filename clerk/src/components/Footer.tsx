"use client";

import { motion } from "framer-motion";

const footerLinks = [
  {
    title: "Product",
    links: ["Authentication", "User Management", "Organizations", "Session Management", "Webhooks"],
  },
  {
    title: "Developers",
    links: ["Documentation", "Quickstarts", "API Reference", "SDKs", "Changelog"],
  },
  {
    title: "Resources",
    links: ["Blog", "Community", "Support", "Status", "Security"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact", "Privacy", "Terms"],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mb-16 p-12 rounded-2xl bg-gradient-to-br from-[#6C47FF]/20 to-[#17CCFC]/10 border border-white/[0.06] text-center overflow-hidden"
        >
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <h2 className="relative z-10 text-3xl sm:text-4xl font-bold mb-4">
            Ready to ship auth?
          </h2>
          <p className="relative z-10 text-[#8B8B9E] mb-8 max-w-lg mx-auto">
            Join thousands of developers building with Clerk. Get started in minutes.
          </p>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(108,71,255,0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="relative z-10 px-8 py-3.5 bg-[#6C47FF] hover:bg-[#5A38E0] text-white font-medium rounded-xl transition-colors"
          >
            Start building for free
          </motion.button>
        </motion.div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="6" fill="#6C47FF" />
                <path d="M14 6L20 10V18L14 22L8 18V10L14 6Z" stroke="white" strokeWidth="1.5" fill="none" />
                <circle cx="14" cy="12" r="2.5" fill="white" />
                <path d="M10 18C10 15.8 11.8 14 14 14C16.2 14 18 15.8 18 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-lg font-semibold">clerk</span>
            </div>
            <p className="text-sm text-[#8B8B9E] leading-relaxed">
              The most comprehensive user management platform.
            </p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-medium text-sm mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-[#8B8B9E] hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#8B8B9E]">
            &copy; {new Date().getFullYear()} Clerk, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Twitter", "GitHub", "Discord", "YouTube"].map((social) => (
              <a key={social} href="#" className="text-xs text-[#8B8B9E] hover:text-white transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
