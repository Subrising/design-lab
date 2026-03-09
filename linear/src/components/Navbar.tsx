"use client";

import { motion, useScroll, useTransform } from "framer-motion";

const navLinks = ["Product", "Features", "Method", "Customers", "Changelog", "Pricing"];

export default function Navbar() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.8]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.06]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: useTransform(bgOpacity, (v) => `rgba(10, 10, 15, ${v})`),
        borderBottom: useTransform(borderOpacity, (v) => `1px solid rgba(255, 255, 255, ${v})`),
        backdropFilter: useTransform(scrollY, [0, 100], ["blur(0px)", "blur(20px)"]),
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
              <path
                d="M2.4 60.7c-.4-3.5-.4-7.2 0-10.7L27.5 75.2a42.5 42.5 0 0 1-25-14.5zm7-23L48 76.6A42.6 42.6 0 0 1 9.3 37.8zm13.2-16l53 53a42.6 42.6 0 0 1-53-53zm19-8.6l55 55A42.6 42.6 0 0 0 41.6 13zm22-5.3L95 36.3A42.7 42.7 0 0 0 63.5 7.8zm19 11L83 49.3a42.4 42.4 0 0 0-.5-30.5z"
                fill="url(#nav-gradient)"
              />
              <defs>
                <linearGradient id="nav-gradient" x1="0" y1="0" x2="100" y2="100">
                  <stop stopColor="#7c5cfc" />
                  <stop offset="1" stopColor="#5b8def" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-[15px] font-semibold tracking-tight">Linear</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <motion.a
                key={link}
                href="#"
                className="text-[13px] text-linear-text-secondary hover:text-linear-text transition-colors"
                whileHover={{ y: -1 }}
              >
                {link}
              </motion.a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <motion.button
            className="text-[13px] text-linear-text-secondary hover:text-linear-text transition-colors px-3 py-1.5"
            whileHover={{ y: -1 }}
          >
            Log in
          </motion.button>
          <motion.button
            className="text-[13px] font-medium bg-linear-purple hover:bg-linear-purple/90 text-white px-4 py-1.5 rounded-lg transition-colors"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign up
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
