"use client";

import { useRef, useCallback, useState } from "react";
import type { Song } from "@/data/generateChartData";

// Map genres to musical characteristics
const genreFrequencies: Record<string, number[]> = {
  Pop: [440, 523, 659, 784],
  Rock: [220, 330, 440, 550],
  Electronic: [330, 440, 660, 880],
  "Hip-Hop": [110, 165, 220, 330],
  "R&B": [262, 330, 392, 523],
  Jazz: [277, 370, 466, 554],
  Classical: [262, 330, 392, 523],
  Folk: [294, 370, 440, 554],
  Metal: [147, 220, 294, 370],
  Reggae: [196, 247, 294, 392],
};

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveformData, setWaveformData] = useState<Uint8Array | null>(null);
  const animFrameRef = useRef<number>(0);
  const activeOscillators = useRef<OscillatorNode[]>([]);

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
      analyserRef.current = ctxRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.connect(ctxRef.current.destination);
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return { ctx: ctxRef.current, analyser: analyserRef.current! };
  }, []);

  const stopAll = useCallback(() => {
    activeOscillators.current.forEach((osc) => {
      try { osc.stop(); } catch { /* already stopped */ }
    });
    activeOscillators.current = [];
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsPlaying(false);
  }, []);

  const playSong = useCallback(
    (song: Song) => {
      stopAll();
      const { ctx, analyser } = getContext();

      const frequencies = genreFrequencies[song.genre] || genreFrequencies.Pop;
      const now = ctx.currentTime;
      const duration = 2.0;

      // Create a chord based on genre
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
      gainNode.connect(analyser);

      // Seeded variation based on song ID
      const variation = (song.id % 100) / 100;

      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const waveTypes: OscillatorType[] = [
          "sine",
          "triangle",
          "square",
          "sawtooth",
        ];

        // Different wave types per genre feel
        if (song.genre === "Electronic" || song.genre === "Metal") {
          osc.type = i % 2 === 0 ? "sawtooth" : "square";
        } else if (song.genre === "Jazz" || song.genre === "Classical") {
          osc.type = "sine";
        } else {
          osc.type = waveTypes[i % waveTypes.length];
        }

        // Slight detune for richness
        osc.frequency.setValueAtTime(
          freq * (1 + variation * 0.05),
          now
        );
        osc.frequency.linearRampToValueAtTime(
          freq * (1 + variation * 0.1),
          now + duration * 0.5
        );

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(
          i === 0 ? 0.4 : 0.2 / (i + 1),
          now
        );
        osc.connect(oscGain);
        oscGain.connect(gainNode);

        osc.start(now + i * 0.05);
        osc.stop(now + duration);
        activeOscillators.current.push(osc);
      });

      setIsPlaying(true);

      // Animate waveform data
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateWaveform = () => {
        analyser.getByteFrequencyData(dataArray);
        setWaveformData(new Uint8Array(dataArray));
        if (ctx.currentTime < now + duration) {
          animFrameRef.current = requestAnimationFrame(updateWaveform);
        } else {
          setIsPlaying(false);
          setWaveformData(null);
        }
      };
      animFrameRef.current = requestAnimationFrame(updateWaveform);

      // Auto-stop
      setTimeout(() => {
        setIsPlaying(false);
      }, duration * 1000);
    },
    [getContext, stopAll]
  );

  return { playSong, stopAll, isPlaying, waveformData };
}
