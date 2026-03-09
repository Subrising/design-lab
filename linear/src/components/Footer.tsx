"use client";

import { motion } from "framer-motion";

const footerColumns = [
  {
    title: "Product",
    links: ["Features", "Integrations", "Changelog", "Pricing", "Security", "Download"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Customers", "Brand"],
  },
  {
    title: "Resources",
    links: ["Docs", "API Reference", "Community", "Templates", "Import"],
  },
  {
    title: "Connect",
    links: ["Twitter", "GitHub", "Discord", "LinkedIn", "YouTube"],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] pt-16 pb-8 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Logo column */}
          <div className="col-span-2 md:col-span-1">
            <motion.div className="flex items-center gap-2 mb-4" whileHover={{ scale: 1.02 }}>
              <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
                <path
                  d="M2.4 60.7c-.4-3.5-.4-7.2 0-10.7L27.5 75.2a42.5 42.5 0 0 1-25-14.5zm7-23L48 76.6A42.6 42.6 0 0 1 9.3 37.8zm13.2-16l53 53a42.6 42.6 0 0 1-53-53zm19-8.6l55 55A42.6 42.6 0 0 0 41.6 13zm22-5.3L95 36.3A42.7 42.7 0 0 0 63.5 7.8zm19 11L83 49.3a42.4 42.4 0 0 0-.5-30.5z"
                  fill="url(#footer-gradient)"
                />
                <defs>
                  <linearGradient id="footer-gradient" x1="0" y1="0" x2="100" y2="100">
                    <stop stopColor="#7c5cfc" />
                    <stop offset="1" stopColor="#5b8def" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-[14px] font-semibold">Linear</span>
            </motion.div>
            <p className="text-[12px] text-linear-text-secondary leading-relaxed">
              Built for the modern
              <br />
              software team.
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="text-[12px] font-semibold text-linear-text-secondary uppercase tracking-wider mb-4">
                {column.title}
              </h4>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] text-linear-text-secondary hover:text-linear-text transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-linear-text-secondary">
            &copy; {new Date().getFullYear()} Linear. Built as a design experiment.
          </p>
          <div className="flex items-center gap-6 text-[12px] text-linear-text-secondary">
            <a href="#" className="hover:text-linear-text transition-colors">Privacy</a>
            <a href="#" className="hover:text-linear-text transition-colors">Terms</a>
            <a href="#" className="hover:text-linear-text transition-colors">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
