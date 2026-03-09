"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { generateChartData, Song } from "@/data/generateChartData";
import { useTimeline } from "@/hooks/useTimeline";
import { useAudio } from "@/hooks/useAudio";
import Timeline from "@/components/Timeline";
import SongTooltip from "@/components/SongTooltip";
import GenreLegend from "@/components/GenreLegend";
import StatsPanel from "@/components/StatsPanel";
import AudioPlayer from "@/components/AudioPlayer";

// Dynamic import for Three.js scene (SSR-incompatible)
const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-bg">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-indigo-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/40 text-sm font-mono">
          Loading visualization...
        </p>
      </div>
    </div>
  ),
});

export default function Home() {
  // Generate chart data once
  const songs = useMemo(() => generateChartData(), []);

  // Timeline state
  const {
    currentYear,
    currentDecade,
    isTransitioning,
    navigateToYear,
    navigateToDecade,
  } = useTimeline();

  // Audio state
  const { playSong, isPlaying, waveformData } = useAudio();

  // Hover state
  const [hoveredSong, setHoveredSong] = useState<Song | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Currently playing song
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  const handleHoverSong = useCallback(
    (song: Song | null, position?: { x: number; y: number }) => {
      setHoveredSong(song);
      setTooltipPos(position || null);
    },
    []
  );

  const handleClickSong = useCallback(
    (song: Song) => {
      setCurrentSong(song);
      playSong(song);
    },
    [playSong]
  );

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-bg">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="flex items-start justify-center pt-5">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white/90 tracking-tight">
              50 Years Swiss Music Charts
            </h1>
            <p className="text-white/40 text-xs font-mono mt-1">
              1974 &mdash; 2024 &middot; {songs.length.toLocaleString()} songs
              &middot; Interactive WebGL Visualization
            </p>
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Scene
          songs={songs}
          currentDecade={currentDecade}
          isTransitioning={isTransitioning}
          onHoverSong={handleHoverSong}
          onClickSong={handleClickSong}
        />
      </div>

      {/* UI Overlays */}
      <GenreLegend />
      <StatsPanel songs={songs} currentDecade={currentDecade} />

      {/* Song Tooltip */}
      <SongTooltip song={hoveredSong} position={tooltipPos} />

      {/* Audio Player */}
      <AudioPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        waveformData={waveformData}
      />

      {/* Timeline */}
      <Timeline
        currentYear={currentYear}
        currentDecade={currentDecade}
        onNavigateToYear={navigateToYear}
        onNavigateToDecade={navigateToDecade}
      />

      {/* Instructions overlay (fades after 5s) */}
      <div className="absolute bottom-44 right-4 z-10 animate-pulse">
        <div className="bg-surface/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/5">
          <p className="text-white/30 text-[10px] font-mono">
            Drag to rotate &middot; Scroll to zoom &middot; Hover particles for
            details
          </p>
        </div>
      </div>
    </main>
  );
}
