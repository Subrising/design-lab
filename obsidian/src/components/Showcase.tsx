"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the showcase section and scale up the panel
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
        },
      });

      tl.from(panelRef.current, {
        scale: 0.8,
        borderRadius: "40px",
        opacity: 0.5,
        duration: 1,
      })
        .to(
          panelRef.current,
          {
            scale: 1,
            borderRadius: "0px",
            opacity: 1,
            duration: 1,
          },
          0
        )
        .from(
          textRef.current,
          {
            y: 60,
            opacity: 0,
            duration: 0.5,
          },
          0.5
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Full-screen showcase panel */}
      <div
        ref={panelRef}
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0c0015 0%, #1a0030 30%, #0d001a 70%, #050510 100%)",
        }}
      >
        {/* Animated grid lines */}
        <div className="absolute inset-0 grid-pattern opacity-40" />

        {/* Glowing orbs */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full orb"
          style={{
            top: "10%",
            right: "-10%",
            background:
              "radial-gradient(circle, rgba(124, 92, 252, 0.2), transparent 60%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full orb-delayed"
          style={{
            bottom: "10%",
            left: "-5%",
            background:
              "radial-gradient(circle, rgba(56, 189, 248, 0.15), transparent 60%)",
            filter: "blur(60px)",
          }}
        />

        {/* Dashboard mockup */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-8">
          <div
            ref={textRef}
            className="gradient-border bg-surface/80 backdrop-blur-xl p-1"
          >
            <div className="bg-[#0a0a0a] rounded-[14px] overflow-hidden">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-white/[0.04] text-xs text-white/30 font-mono">
                    app.obsidian.dev
                  </div>
                </div>
              </div>

              {/* Mock content */}
              <div className="p-8 min-h-[400px]">
                <div className="grid grid-cols-12 gap-6">
                  {/* Sidebar */}
                  <div className="col-span-3 space-y-4">
                    <div className="h-8 w-24 rounded-lg bg-white/[0.04]" />
                    <div className="space-y-2 mt-6">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-8 rounded-lg flex items-center px-3 gap-2 text-xs ${
                            i === 1
                              ? "bg-accent/10 text-accent"
                              : "text-white/30 hover:bg-white/[0.03]"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded ${
                              i === 1
                                ? "bg-accent/30"
                                : "bg-white/[0.06]"
                            }`}
                          />
                          <span>
                            {
                              [
                                "Dashboard",
                                "Analytics",
                                "Projects",
                                "Team",
                                "Settings",
                                "Docs",
                              ][i]
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="col-span-9 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="h-7 w-40 rounded bg-white/[0.08] mb-2" />
                        <div className="h-4 w-64 rounded bg-white/[0.04]" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 w-20 rounded-lg bg-white/[0.04]" />
                        <div className="h-8 w-24 rounded-lg bg-accent/20 text-accent text-xs flex items-center justify-center">
                          + New
                        </div>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: "2,847", label: "Active users", change: "+12%" },
                        { value: "$48.2k", label: "Revenue", change: "+8.3%" },
                        { value: "99.9%", label: "Uptime", change: "stable" },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                        >
                          <div className="text-xs text-white/30 mb-1">
                            {stat.label}
                          </div>
                          <div className="text-xl font-semibold text-white">
                            {stat.value}
                          </div>
                          <div className="text-xs text-green-400 mt-1">
                            {stat.change}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chart placeholder */}
                    <div className="h-40 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-end p-4 gap-1">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t"
                            style={{
                              height: `${h}%`,
                              background: `linear-gradient(to top, rgba(124, 92, 252, ${0.3 + (h / 100) * 0.5}), rgba(192, 132, 252, ${0.1 + (h / 100) * 0.3}))`,
                            }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
