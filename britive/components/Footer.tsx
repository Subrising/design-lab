"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = footerRef.current?.querySelectorAll(".footer-reveal");
      if (items) {
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%",
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative py-16 px-6 md:px-12 border-t border-[#27272a] section-wrapper"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
          <div className="footer-reveal col-span-2 md:col-span-1 opacity-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#6366f1] flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-lg font-bold">britive</span>
            </div>
            <p className="text-sm text-[#71717a] leading-relaxed">
              Crafting extraordinary digital experiences with obsessive attention
              to detail.
            </p>
          </div>

          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Changelog", "Docs"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Contact"],
            },
            {
              title: "Legal",
              links: ["Privacy", "Terms", "Security", "Status"],
            },
          ].map((col) => (
            <div key={col.title} className="footer-reveal opacity-0">
              <h4 className="text-sm font-medium mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#71717a] hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-reveal flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#27272a] opacity-0">
          <p className="text-xs text-[#71717a]">
            &copy; 2026 Britive. All rights reserved.
          </p>
          <p className="text-xs text-[#71717a] mt-2 md:mt-0">
            Design experiment — built with Next.js, GSAP, Three.js & Lenis
          </p>
        </div>
      </div>
    </footer>
  );
}
