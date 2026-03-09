"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="relative z-10 py-40 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-20">Contact</h2>

        <h3 ref={headingRef} className="text-4xl md:text-7xl font-extralight tracking-tight mb-16 opacity-0">
          Let&apos;s create
          <br />
          something{" "}
          <span className="italic text-purple-300/80">extraordinary</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-3">General</p>
            <a href="mailto:hello@lusion.co" className="text-lg text-white/60 hover:text-white transition-colors" data-cursor-hover>
              hello@lusion.co
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-3">New Business</p>
            <a href="mailto:work@lusion.co" className="text-lg text-white/60 hover:text-white transition-colors" data-cursor-hover>
              work@lusion.co
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-3">Social</p>
            <div className="flex gap-6">
              {["Twitter", "Instagram", "Dribbble"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-sm text-white/40 hover:text-white transition-colors"
                  data-cursor-hover
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-40 pt-8 border-t border-white/10 flex items-center justify-between">
        <p className="text-xs text-white/20">&copy; 2024 Lusion. All rights reserved.</p>
        <p className="text-xs text-white/20">Crafted with WebGL</p>
      </div>
    </section>
  );
}
