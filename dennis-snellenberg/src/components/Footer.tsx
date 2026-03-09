"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const socials = [
    { name: "Awwwards", href: "#" },
    { name: "Twitter", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "LinkedIn", href: "#" },
  ];

  return (
    <footer
      ref={footerRef}
      className="border-t border-white/5 bg-[var(--color-bg-light)] px-8 py-12"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex items-center gap-8">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              className="hover-line text-sm text-[var(--color-text-muted)] transition-colors hover:text-white"
              data-magnetic
            >
              {s.name}
            </a>
          ))}
        </div>

        <p className="text-xs text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} Dennis Snellenberg
        </p>
      </div>
    </footer>
  );
}
