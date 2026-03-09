"use client";

import { useEffect, useRef } from "react";
import { Song, GENRE_COLORS } from "@/data/generateChartData";

interface AudioPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  waveformData: Uint8Array | null;
}

export default function AudioPlayer({
  currentSong,
  isPlaying,
  waveformData,
}: AudioPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw waveform visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (!waveformData || !currentSong) {
      // Draw idle state — flat line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      return;
    }

    const color = GENRE_COLORS[currentSong.genre] || "#6366f1";
    const barCount = Math.min(waveformData.length, 64);
    const barWidth = width / barCount;

    // Gradient
    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, `${color}20`);
    gradient.addColorStop(1, `${color}cc`);

    ctx.fillStyle = gradient;

    for (let i = 0; i < barCount; i++) {
      const value = waveformData[i] / 255;
      const barHeight = value * height * 0.8;
      const x = i * barWidth;
      const y = height - barHeight;

      // Rounded bars
      const radius = Math.min(barWidth * 0.3, 2);
      ctx.beginPath();
      ctx.roundRect(
        x + 1,
        y,
        barWidth - 2,
        barHeight,
        [radius, radius, 0, 0]
      );
      ctx.fill();
    }

    // Glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
  }, [waveformData, currentSong]);

  if (!currentSong && !isPlaying) return null;

  return (
    <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-20">
      <div className="bg-surface/90 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10 flex items-center gap-4 min-w-[300px]">
        {/* Now playing indicator */}
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-indigo-400 rounded-full animate-pulse"
                  style={{
                    height: `${40 + Math.random() * 60}%`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="w-4 h-4 rounded-full border border-white/20" />
          )}
        </div>

        {/* Song info */}
        <div className="min-w-0 flex-1">
          <p className="text-white text-xs font-medium truncate">
            {currentSong?.title || "—"}
          </p>
          <p className="text-white/50 text-[10px] truncate">
            {currentSong?.artist || "—"} ({currentSong?.year})
          </p>
        </div>

        {/* Waveform canvas */}
        <canvas
          ref={canvasRef}
          width={120}
          height={32}
          className="opacity-80"
        />
      </div>
    </div>
  );
}
