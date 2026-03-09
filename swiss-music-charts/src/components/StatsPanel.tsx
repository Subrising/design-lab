"use client";

import { useMemo } from "react";
import { Song, GENRES, GENRE_COLORS, getDecadeStats } from "@/data/generateChartData";

interface StatsPanelProps {
  songs: Song[];
  currentDecade: number;
}

export default function StatsPanel({ songs, currentDecade }: StatsPanelProps) {
  const stats = useMemo(
    () => getDecadeStats(songs, currentDecade),
    [songs, currentDecade]
  );

  const maxGenreCount = Math.max(...Object.values(stats.genreCounts));

  return (
    <div className="absolute top-4 left-4 z-20">
      <div className="bg-surface/80 backdrop-blur-md rounded-xl px-5 py-4 border border-white/10 w-[260px]">
        <h3 className="text-white/50 text-[10px] uppercase tracking-wider mb-1 font-mono">
          Decade Overview
        </h3>
        <h2 className="text-white text-xl font-bold font-mono mb-3">
          {currentDecade}s
        </h2>

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <span className="text-white/40 text-[10px] uppercase tracking-wider block">
              Total Songs
            </span>
            <span className="text-white text-lg font-mono font-bold">
              {stats.totalSongs.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-white/40 text-[10px] uppercase tracking-wider block">
              Avg Weeks
            </span>
            <span className="text-white text-lg font-mono font-bold">
              {stats.avgWeeks}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-white/40 text-[10px] uppercase tracking-wider block">
              Top Genre
            </span>
            <span
              className="text-lg font-mono font-bold"
              style={{
                color:
                  GENRE_COLORS[stats.topGenre as keyof typeof GENRE_COLORS] ||
                  "#fff",
              }}
            >
              {stats.topGenre}
            </span>
          </div>
        </div>

        {/* Genre distribution bars */}
        <div className="space-y-1.5">
          <span className="text-white/40 text-[10px] uppercase tracking-wider block mb-1">
            Distribution
          </span>
          {GENRES.map((genre) => {
            const count = stats.genreCounts[genre] || 0;
            const width = maxGenreCount > 0 ? (count / maxGenreCount) * 100 : 0;
            return (
              <div key={genre} className="flex items-center gap-2">
                <span className="text-white/40 text-[9px] font-mono w-16 text-right truncate">
                  {genre}
                </span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${width}%`,
                      backgroundColor: GENRE_COLORS[genre],
                      boxShadow: `0 0 4px ${GENRE_COLORS[genre]}60`,
                    }}
                  />
                </div>
                <span className="text-white/30 text-[9px] font-mono w-6">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Top songs */}
        <div className="mt-4">
          <span className="text-white/40 text-[10px] uppercase tracking-wider block mb-2">
            Top Hits
          </span>
          {stats.topSongs.slice(0, 3).map((song, i) => (
            <div key={song.id} className="flex items-start gap-2 mb-1.5">
              <span className="text-white/20 text-[10px] font-mono mt-0.5">
                #{song.peakPosition}
              </span>
              <div className="min-w-0">
                <p className="text-white/70 text-[11px] font-medium truncate">
                  {song.title}
                </p>
                <p className="text-white/40 text-[10px] truncate">
                  {song.artist} ({song.year})
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
