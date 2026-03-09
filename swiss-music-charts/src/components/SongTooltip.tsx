"use client";

import { Song, GENRE_COLORS } from "@/data/generateChartData";

interface SongTooltipProps {
  song: Song | null;
  position: { x: number; y: number } | null;
}

export default function SongTooltip({ song, position }: SongTooltipProps) {
  if (!song || !position) return null;

  const color = GENRE_COLORS[song.genre] || "#ffffff";

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x + 16,
        top: position.y - 10,
        transform: "translateY(-100%)",
      }}
    >
      <div className="bg-surface/95 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 shadow-2xl min-w-[220px]">
        {/* Genre color bar */}
        <div
          className="absolute top-0 left-4 right-4 h-0.5 rounded-full"
          style={{ backgroundColor: color }}
        />

        {/* Song title */}
        <h3 className="text-white font-semibold text-sm mt-1 truncate">
          {song.title}
        </h3>

        {/* Artist */}
        <p className="text-white/60 text-xs mt-0.5">{song.artist}</p>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
          <div>
            <span className="text-white/40 text-[10px] uppercase tracking-wider">
              Year
            </span>
            <p className="text-white/80 text-xs font-mono">{song.year}</p>
          </div>
          <div>
            <span className="text-white/40 text-[10px] uppercase tracking-wider">
              Peak
            </span>
            <p className="text-white/80 text-xs font-mono">
              #{song.peakPosition}
            </p>
          </div>
          <div>
            <span className="text-white/40 text-[10px] uppercase tracking-wider">
              Weeks
            </span>
            <p className="text-white/80 text-xs font-mono">
              {song.weeksOnChart}
            </p>
          </div>
          <div>
            <span className="text-white/40 text-[10px] uppercase tracking-wider">
              Genre
            </span>
            <p className="text-xs font-mono" style={{ color }}>
              {song.genre}
            </p>
          </div>
        </div>

        {/* Click hint */}
        <p className="text-white/30 text-[10px] mt-2 text-center">
          Click to play
        </p>
      </div>
    </div>
  );
}
