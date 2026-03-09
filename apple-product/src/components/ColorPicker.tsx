"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const colors = [
  { name: "Natural Titanium", hex: "#86868b", body: "#2a2a2e" },
  { name: "Blue Titanium", hex: "#394d6d", body: "#1a2a3e" },
  { name: "White Titanium", hex: "#e3ddd6", body: "#3a3834" },
  { name: "Black Titanium", hex: "#3a3a3c", body: "#1a1a1c" },
  { name: "Desert Titanium", hex: "#c2a875", body: "#2e2820" },
];

export default function ColorPicker() {
  const [selected, setSelected] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 600;

    function draw() {
      if (!ctx || !canvas) return;
      const color = colors[selected];
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Background glow
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 250);
      bgGrad.addColorStop(0, color.hex + "22");
      bgGrad.addColorStop(1, "transparent");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Phone body
      const phoneW = 160;
      const phoneH = 340;
      const cx = w / 2;
      const cy = h / 2;

      ctx.save();
      ctx.translate(cx, cy);

      // Shadow
      ctx.shadowColor = color.hex + "44";
      ctx.shadowBlur = 60;
      ctx.shadowOffsetY = 20;

      ctx.beginPath();
      ctx.roundRect(-phoneW / 2, -phoneH / 2, phoneW, phoneH, 26);
      const bodyGrad = ctx.createLinearGradient(-phoneW / 2, 0, phoneW / 2, 0);
      bodyGrad.addColorStop(0, color.body);
      bodyGrad.addColorStop(0.5, lighten(color.body, 20));
      bodyGrad.addColorStop(1, color.body);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Frame highlight
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = color.hex + "44";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Screen
      const si = 7;
      ctx.beginPath();
      ctx.roundRect(-phoneW / 2 + si, -phoneH / 2 + si, phoneW - si * 2, phoneH - si * 2, 20);
      const screenGrad = ctx.createLinearGradient(0, -phoneH / 2, 0, phoneH / 2);
      screenGrad.addColorStop(0, "#0a0a1a");
      screenGrad.addColorStop(1, "#050510");
      ctx.fillStyle = screenGrad;
      ctx.fill();

      // Dynamic island
      ctx.beginPath();
      ctx.roundRect(-30, -phoneH / 2 + si + 8, 60, 14, 7);
      ctx.fillStyle = "#000";
      ctx.fill();

      // Screen content - wallpaper gradient
      ctx.beginPath();
      ctx.roundRect(-phoneW / 2 + si + 1, -phoneH / 2 + si + 30, phoneW - si * 2 - 2, phoneH - si * 2 - 31, [0, 0, 19, 19]);
      const wallGrad = ctx.createLinearGradient(0, -phoneH / 2, 0, phoneH / 2);
      wallGrad.addColorStop(0, color.hex + "33");
      wallGrad.addColorStop(0.5, "#0a0a1a");
      wallGrad.addColorStop(1, color.hex + "11");
      ctx.fillStyle = wallGrad;
      ctx.fill();

      ctx.restore();
    }

    draw();
  }, [selected]);

  // Scroll animation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      }
    );
  }, []);

  return (
    <section ref={containerRef} className="py-28 md:py-36 px-6 opacity-0">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="font-display tracking-tight text-white"
            style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, lineHeight: 1.07 }}
          >
            Pick your favorite.
          </h2>
          <p className="text-[#86868b] mt-3 text-xl">{colors[selected].name}</p>
        </div>

        <div className="flex flex-col items-center gap-10">
          <canvas
            ref={canvasRef}
            className="max-w-[400px] w-full"
            style={{ aspectRatio: "1/1" }}
          />

          <div className="flex gap-4">
            {colors.map((color, i) => (
              <button
                key={color.name}
                onClick={() => setSelected(i)}
                className="w-8 h-8 rounded-full transition-all duration-300 border-2"
                style={{
                  backgroundColor: color.hex,
                  borderColor: i === selected ? "#fff" : "transparent",
                  transform: i === selected ? "scale(1.2)" : "scale(1)",
                  boxShadow: i === selected ? `0 0 20px ${color.hex}44` : "none",
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
  const b = Math.min(255, (num & 0x0000ff) + amount);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
}
