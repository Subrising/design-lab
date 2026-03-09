"use client";

import { GENRES, GENRE_COLORS } from "@/data/generateChartData";

export default function GenreLegend() {
  return (
    <div className="absolute top-4 right-4 z-20">
      <div className="bg-surface/80 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10">
        <h3 className="text-white/50 text-[10px] uppercase tracking-wider mb-2 font-mono">
          Genres
        </h3>
        <div className="space-y-1.5">
          {GENRES.map((genre) => (
            <div key={genre} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shadow-sm"
                style={{
                  backgroundColor: GENRE_COLORS[genre],
                  boxShadow: `0 0 6px ${GENRE_COLORS[genre]}80`,
                }}
              />
              <span className="text-white/60 text-xs font-mono">{genre}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
