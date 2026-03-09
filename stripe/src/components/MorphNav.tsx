"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  label: string;
  content: {
    title: string;
    items: { name: string; desc: string; icon: string }[];
  };
}

const navItems: NavItem[] = [
  {
    label: "Products",
    content: {
      title: "Products",
      items: [
        { name: "Payments", desc: "Online payments", icon: "💳" },
        { name: "Terminal", desc: "In-person payments", icon: "📱" },
        { name: "Connect", desc: "Payments for platforms", icon: "🔗" },
        { name: "Billing", desc: "Subscriptions & invoicing", icon: "📄" },
        { name: "Invoicing", desc: "Online invoices", icon: "📨" },
        { name: "Revenue Recognition", desc: "Accounting automation", icon: "📊" },
      ],
    },
  },
  {
    label: "Solutions",
    content: {
      title: "Solutions",
      items: [
        { name: "SaaS", desc: "For software platforms", icon: "☁️" },
        { name: "Marketplaces", desc: "For multi-sided platforms", icon: "🏪" },
        { name: "E-Commerce", desc: "For online retail", icon: "🛒" },
        { name: "Embedded Finance", desc: "For platforms", icon: "🏦" },
      ],
    },
  },
  {
    label: "Developers",
    content: {
      title: "Developers",
      items: [
        { name: "Documentation", desc: "Start integrating", icon: "📖" },
        { name: "API Reference", desc: "Complete reference", icon: "⚡" },
        { name: "API Status", desc: "System status", icon: "🟢" },
      ],
    },
  },
  {
    label: "Resources",
    content: {
      title: "Resources",
      items: [
        { name: "Support", desc: "Contact our team", icon: "💬" },
        { name: "Guides", desc: "Best practices", icon: "📚" },
        { name: "Blog", desc: "Latest updates", icon: "✏️" },
        { name: "Sessions", desc: "Virtual events", icon: "🎥" },
      ],
    },
  },
];

export default function MorphNav() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [morphRect, setMorphRect] = useState({ x: 0, width: 0 });
  const navRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);

  const handleEnter = useCallback((index: number) => {
    clearTimeout(timeoutRef.current);
    setActiveIndex(index);
    const el = navRefs.current[index];
    if (el) {
      const rect = el.getBoundingClientRect();
      const parentRect = el.parentElement?.getBoundingClientRect();
      if (parentRect) {
        setMorphRect({
          x: rect.left - parentRect.left + rect.width / 2,
          width: rect.width,
        });
      }
    }
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActiveIndex(null), 200);
  }, []);

  const handleDropdownEnter = useCallback(() => {
    clearTimeout(timeoutRef.current);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const activeContent = activeIndex !== null ? navItems[activeIndex].content : null;

  // Calculate dropdown width based on content
  const dropdownWidth = activeContent
    ? activeContent.items.length > 4 ? 560 : 380
    : 380;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <svg viewBox="0 0 60 25" className="h-8 w-auto" fill="white">
              <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a12.1 12.1 0 01-4.56.88c-4.02 0-6.83-2.44-6.83-7.14 0-4.23 2.47-7.2 6.23-7.2 3.71 0 6.06 2.82 6.06 6.94 0 .57-.04 1.13-.09 1.6zm-8.09-2.49h4.44c0-1.73-.87-2.75-2.17-2.75-1.25 0-2.13.98-2.27 2.75zM40.95 5.97c1.38 0 2.52.3 3.39.82v3.72a5.42 5.42 0 00-2.93-.88c-2.24 0-3.55 1.57-3.55 3.53 0 2.13 1.35 3.48 3.48 3.48 1.16 0 2.13-.34 3-.88v3.7c-.85.47-2.11.82-3.56.82-4.37 0-7.14-2.86-7.14-7.08 0-4.23 2.89-7.23 7.31-7.23zm-12.46.28l.65 2.78c-2.2-.13-4.03 1.13-4.03 4.2v6.84h-4.26V6.25h3.9l.32 2.4c.82-1.78 1.96-2.55 3.42-2.4zm-9.55-.28c-1.49 0-2.65.38-3.39.82v3.72a5.36 5.36 0 012.93-.88c2.24 0 3.55 1.57 3.55 3.53H18.3v3.72c0 .1.03.16.12.16h3.36c1.15 0 2.13-.34 3-.88v3.7c-.85.47-2.11.82-3.56.82-4.37 0-7.14-2.86-7.14-7.08V5.97h4.26v.28c.6-.18 1.24-.28 1.9-.28zm-8.3 0h4.3v14.1h-4.3V5.97zm0-5.58h4.3V4.2h-4.3V.39zM5.8 13.44l-1.5 6.63H0L4.2.39h5.34l4.24 19.68H9.42l-1.5-6.63H5.8zm1.06-3.78h.4l-.2-3.23-.2 3.23z" />
            </svg>
          </a>

          {/* Nav Items */}
          <div
            className="relative flex items-center gap-1"
            onMouseLeave={handleLeave}
          >
            {navItems.map((item, i) => (
              <button
                key={item.label}
                ref={(el) => { navRefs.current[i] = el; }}
                onMouseEnter={() => handleEnter(i)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                  activeIndex === i
                    ? "text-white bg-white/10"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Morphing Dropdown */}
            <AnimatePresence>
              {activeIndex !== null && activeContent && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    width: dropdownWidth,
                    x: morphRect.x - dropdownWidth / 2,
                  }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    mass: 0.8,
                  }}
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleLeave}
                  className="absolute top-full mt-2 bg-white rounded-xl shadow-2xl overflow-hidden"
                  style={{ transformOrigin: "top center" }}
                >
                  {/* Arrow indicator */}
                  <motion.div
                    className="absolute -top-2 w-4 h-4 bg-white rotate-45 rounded-sm"
                    animate={{ left: dropdownWidth / 2 - 8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />

                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15, delay: 0.05 }}
                    className="p-5"
                  >
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      {activeContent.title}
                    </p>
                    <div className={`grid gap-1 ${activeContent.items.length > 4 ? "grid-cols-2" : "grid-cols-1"}`}>
                      {activeContent.items.map((item, i) => (
                        <motion.a
                          key={item.name}
                          href="#"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 + 0.05 }}
                          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <span className="text-xl w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 group-hover:bg-stripe-purple/10 transition-colors">
                            {item.icon}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-gray-900 group-hover:text-stripe-purple transition-colors">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">
              Sign in
            </a>
            <a
              href="#"
              className="px-4 py-2 text-sm font-medium bg-white text-stripe-blue rounded-full hover:bg-white/90 transition-colors"
            >
              Contact sales →
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
