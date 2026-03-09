"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
          },
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="py-24 md:py-32 px-6 md:px-24">
      <div className="max-w-6xl mx-auto">
        {/* CTA */}
        <div className="text-center mb-24">
          <p
            className="font-sans text-[10px] tracking-[0.4em] uppercase text-warm-gray mb-6"
            style={{ fontWeight: 300 }}
          >
            Let&apos;s Create Together
          </p>
          <h2
            className="font-serif text-4xl md:text-7xl tracking-wide text-cream/90 mb-8"
            style={{ fontWeight: 300 }}
          >
            Your Story Awaits
          </h2>
          <a
            href="#"
            className="inline-block border border-gold/40 px-10 py-4 font-sans text-xs tracking-[0.3em] uppercase text-cream/70 hover:text-cream hover:border-gold/70 transition-all duration-500"
            style={{ fontWeight: 300 }}
            data-cursor-hover
          >
            Get in Touch
          </a>
        </div>

        <div className="divider mx-auto mb-16" />

        {/* Footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <h3
              className="font-serif text-2xl tracking-[0.1em] text-cream/80 mb-4"
              style={{ fontWeight: 300 }}
            >
              Adovasio
            </h3>
            <p
              className="font-sans text-xs text-warm-gray leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              Italian wedding photography
              <br />
              based in Florence, available worldwide.
            </p>
          </div>

          <div>
            <p
              className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/40 mb-4"
              style={{ fontWeight: 300 }}
            >
              Follow
            </p>
            <div className="flex justify-center md:justify-start gap-6">
              {["Instagram", "Pinterest", "Vimeo"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="font-sans text-xs text-warm-gray hover:text-cream transition-colors duration-500"
                  style={{ fontWeight: 300 }}
                  data-cursor-hover
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div className="text-center md:text-right">
            <p
              className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/40 mb-4"
              style={{ fontWeight: 300 }}
            >
              Contact
            </p>
            <a
              href="#"
              className="font-sans text-xs text-warm-gray hover:text-cream transition-colors duration-500"
              style={{ fontWeight: 300 }}
              data-cursor-hover
            >
              hello@adovasio.com
            </a>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p
            className="font-sans text-[10px] text-cream/20 tracking-widest"
            style={{ fontWeight: 300 }}
          >
            &copy; 2024 Adovasio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
