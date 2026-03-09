"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 120;
const CANVAS_W = 1200;
const CANVAS_H = 800;

function generateFrame(
  ctx: CanvasRenderingContext2D,
  frameIndex: number,
  w: number,
  h: number
) {
  const progress = frameIndex / (FRAME_COUNT - 1);

  // Background - deep black to dark blue shift
  const bgR = Math.round(0 + progress * 8);
  const bgG = Math.round(0 + progress * 12);
  const bgB = Math.round(0 + progress * 30);
  ctx.fillStyle = `rgb(${bgR},${bgG},${bgB})`;
  ctx.fillRect(0, 0, w, h);

  // Subtle radial glow behind phone
  const glowGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 350);
  glowGrad.addColorStop(0, `rgba(0, 113, 227, ${0.03 + progress * 0.12})`);
  glowGrad.addColorStop(0.5, `rgba(100, 80, 200, ${0.02 + progress * 0.06})`);
  glowGrad.addColorStop(1, "transparent");
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, w, h);

  // Phone dimensions and rotation
  const phoneW = 180;
  const phoneH = 380;
  const cx = w / 2;
  const cy = h / 2;

  // 3D rotation effect via perspective scaling
  const rotAngle = -30 + progress * 60; // -30deg to +30deg
  const rotRad = (rotAngle * Math.PI) / 180;
  const scaleX = Math.cos(rotRad);
  const perspective = 0.8 + 0.2 * Math.abs(Math.cos(rotRad));

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scaleX * perspective, perspective);

  // Phone body shadow
  ctx.shadowColor = "rgba(0, 113, 227, 0.3)";
  ctx.shadowBlur = 60 + progress * 40;
  ctx.shadowOffsetX = rotAngle * 0.5;
  ctx.shadowOffsetY = 10;

  // Phone body
  const radius = 28;
  ctx.beginPath();
  ctx.roundRect(-phoneW / 2, -phoneH / 2, phoneW, phoneH, radius);

  // Titanium gradient on phone body
  const bodyGrad = ctx.createLinearGradient(
    -phoneW / 2 + rotAngle * 2,
    -phoneH / 2,
    phoneW / 2 + rotAngle * 2,
    phoneH / 2
  );
  bodyGrad.addColorStop(0, "#1a1a2e");
  bodyGrad.addColorStop(0.3, "#2a2a3e");
  bodyGrad.addColorStop(0.5, "#3a3a4e");
  bodyGrad.addColorStop(0.7, "#2a2a3e");
  bodyGrad.addColorStop(1, "#1a1a2e");
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Phone edge highlight
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.strokeStyle = `rgba(200, 200, 220, ${0.15 + 0.15 * Math.abs(Math.sin(rotRad))})`;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Screen
  const screenInset = 8;
  const screenRadius = 22;
  ctx.beginPath();
  ctx.roundRect(
    -phoneW / 2 + screenInset,
    -phoneH / 2 + screenInset,
    phoneW - screenInset * 2,
    phoneH - screenInset * 2,
    screenRadius
  );

  // Screen gradient - shifts with scroll
  const screenGrad = ctx.createLinearGradient(0, -phoneH / 2, 0, phoneH / 2);
  const hue1 = 220 + progress * 40;
  const hue2 = 260 + progress * 60;
  screenGrad.addColorStop(0, `hsl(${hue1}, 70%, ${12 + progress * 20}%)`);
  screenGrad.addColorStop(0.5, `hsl(${hue2}, 60%, ${8 + progress * 15}%)`);
  screenGrad.addColorStop(1, `hsl(${hue1 + 20}, 50%, ${6 + progress * 10}%)`);
  ctx.fillStyle = screenGrad;
  ctx.fill();

  // Dynamic Island
  const diW = 60 + progress * 20;
  const diH = 16;
  ctx.beginPath();
  ctx.roundRect(-diW / 2, -phoneH / 2 + screenInset + 10, diW, diH, diH / 2);
  ctx.fillStyle = "#000";
  ctx.fill();

  // Screen content - time display
  ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + progress * 0.4})`;
  ctx.font = "bold 32px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const hours = Math.floor(9 + progress * 3);
  const mins = Math.floor(progress * 41);
  ctx.fillText(
    `${hours}:${mins.toString().padStart(2, "0")}`,
    0,
    -phoneH / 2 + 80
  );

  // Screen wallpaper orbs
  for (let i = 0; i < 3; i++) {
    const orbX = Math.sin(progress * Math.PI * 2 + i * 2.1) * 40;
    const orbY = Math.cos(progress * Math.PI * 2 + i * 2.1) * 60 + 20;
    const orbR = 40 + i * 15;
    const orbGrad = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbR);
    const orbHue = (hue1 + i * 60) % 360;
    orbGrad.addColorStop(0, `hsla(${orbHue}, 80%, 50%, 0.4)`);
    orbGrad.addColorStop(1, "transparent");
    ctx.fillStyle = orbGrad;
    ctx.fillRect(-phoneW / 2 + screenInset, -phoneH / 2 + screenInset, phoneW - screenInset * 2, phoneH - screenInset * 2);
  }

  // Camera island (top-left back, visible via rotation)
  if (scaleX > 0.3) {
    const camOffset = rotAngle * 0.3;
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.roundRect(-phoneW / 2 + 12 + camOffset, -phoneH / 2 + 12, 55, 55, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(100, 100, 120, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Camera lenses
    const lenses = [
      { x: 0, y: 0 },
      { x: 22, y: 0 },
      { x: 11, y: 22 },
    ];
    for (const lens of lenses) {
      const lx = -phoneW / 2 + 22 + lens.x + camOffset;
      const ly = -phoneH / 2 + 22 + lens.y;
      ctx.beginPath();
      ctx.arc(lx, ly, 7, 0, Math.PI * 2);
      const lensGrad = ctx.createRadialGradient(lx - 1, ly - 1, 0, lx, ly, 7);
      lensGrad.addColorStop(0, `rgba(30, 40, 80, ${0.8 + progress * 0.2})`);
      lensGrad.addColorStop(0.5, "#0a0a1a");
      lensGrad.addColorStop(1, "#000");
      ctx.fillStyle = lensGrad;
      ctx.fill();

      // Lens reflection
      ctx.beginPath();
      ctx.arc(lx - 2, ly - 2, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + progress * 0.15})`;
      ctx.fill();
    }
  }

  ctx.restore();

  // Particle effects
  const particleCount = Math.floor(progress * 30);
  for (let i = 0; i < particleCount; i++) {
    const seed = i * 7919;
    const px = (Math.sin(seed) * 0.5 + 0.5) * w;
    const py = (Math.cos(seed * 1.3) * 0.5 + 0.5) * h;
    const pSize = 1 + (Math.sin(seed * 0.7) * 0.5 + 0.5) * 2;
    const pAlpha = (Math.sin(progress * Math.PI + seed * 0.3) * 0.5 + 0.5) * 0.3;
    ctx.beginPath();
    ctx.arc(px, py, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(100, 140, 255, ${pAlpha})`;
    ctx.fill();
  }
}

export default function ScrollVideoScrub() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<ImageData[]>([]);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;

    // Pre-generate all frames
    const frames: ImageData[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      generateFrame(ctx, i, CANVAS_W, CANVAS_H);
      frames.push(ctx.getImageData(0, 0, CANVAS_W, CANVAS_H));
    }
    framesRef.current = frames;

    // Draw first frame
    ctx.putImageData(frames[0], 0, 0);

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          FRAME_COUNT - 1,
          Math.floor(self.progress * FRAME_COUNT)
        );
        if (frameIndex !== currentFrameRef.current && frames[frameIndex]) {
          ctx.putImageData(frames[frameIndex], 0, 0);
          currentFrameRef.current = frameIndex;
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ height: "400vh" }}>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
        {/* Title above canvas */}
        <div className="absolute top-[8vh] left-0 right-0 text-center z-10">
          <h2
            className="text-gradient-apple font-display tracking-tight"
            style={{ fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 700, lineHeight: 1.05 }}
          >
            iPhone 16 Pro
          </h2>
          <p className="text-[#86868b] mt-3" style={{ fontSize: "clamp(18px, 2.5vw, 28px)", fontWeight: 600 }}>
            Scroll to explore
          </p>
        </div>

        <canvas
          ref={canvasRef}
          className="max-w-full max-h-[70vh] object-contain"
          style={{ width: "min(90vw, 1200px)", height: "auto", aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}
        />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
