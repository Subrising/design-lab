"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal scroll section
      const panels = panelsRef.current;
      if (!panels) return;

      const panelEls = panels.querySelectorAll(".showcase-panel");

      gsap.to(panels, {
        x: () => -(panels.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${panels.scrollWidth - window.innerWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Individual panel animations
      panelEls.forEach((panel) => {
        const inner = panel.querySelector(".panel-inner");
        const label = panel.querySelector(".panel-label");

        gsap.fromTo(
          inner,
          { scale: 0.85, opacity: 0.3 },
          {
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: gsap.getById(
                "showcaseScroll"
              ) as unknown as gsap.core.Animation,
              start: "left 80%",
              end: "left 30%",
              scrub: true,
            },
          }
        );

        if (label) {
          gsap.fromTo(
            label,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              scrollTrigger: {
                trigger: panel,
                start: "top 70%",
                end: "top 40%",
                scrub: true,
              },
            }
          );
        }
      });

      // Section heading
      const heading = sectionRef.current?.querySelector(".section-heading");
      if (heading) {
        gsap.fromTo(
          heading,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const showcaseItems = [
    {
      title: "Dashboard Analytics",
      subtitle: "Real-time data visualization",
      gradient: "from-[#6366f1] to-[#8b5cf6]",
    },
    {
      title: "Team Collaboration",
      subtitle: "Seamless workflows",
      gradient: "from-[#ec4899] to-[#f43f5e]",
    },
    {
      title: "API Management",
      subtitle: "Developer-first tools",
      gradient: "from-[#14b8a6] to-[#06b6d4]",
    },
    {
      title: "Security Hub",
      subtitle: "Zero-trust architecture",
      gradient: "from-[#f59e0b] to-[#ef4444]",
    },
  ];

  return (
    <section ref={sectionRef} id="showcase" className="section-wrapper">
      <div className="pt-32 px-6 md:px-12 max-w-7xl mx-auto mb-12">
        <p className="section-heading text-sm text-[#6366f1] font-medium tracking-widest uppercase mb-4 opacity-0">
          Showcase
        </p>
        <h2 className="section-heading text-4xl md:text-6xl font-bold tracking-tight opacity-0">
          See it in action.
        </h2>
      </div>

      <div className="overflow-hidden">
        <div ref={panelsRef} className="flex gap-8 pl-6 md:pl-12 pr-24">
          {showcaseItems.map((item, i) => (
            <div
              key={i}
              className="showcase-panel flex-shrink-0 w-[80vw] md:w-[60vw] lg:w-[45vw]"
            >
              <div className="panel-inner">
                <div
                  className={`relative h-[50vh] md:h-[60vh] rounded-2xl bg-gradient-to-br ${item.gradient} overflow-hidden`}
                >
                  {/* Mock UI inside */}
                  <div className="absolute inset-6 md:inset-8 rounded-xl bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                      <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                      <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 w-3/4 rounded bg-white/10" />
                      <div className="h-4 w-1/2 rounded bg-white/10" />
                      <div className="h-32 rounded-lg bg-white/5 mt-4" />
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className="h-20 rounded-lg bg-white/5" />
                        <div className="h-20 rounded-lg bg-white/5" />
                        <div className="h-20 rounded-lg bg-white/5" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="panel-label mt-6">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-[#71717a] text-sm mt-1">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
