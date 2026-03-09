// Web Audio API engine for synthesizing musical motifs
// Uses oscillators with ADSR envelopes for a warm, piano-like tone

import type { Motif } from "./motif-data";

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private isPlaying = false;
  private scheduledSources: OscillatorNode[] = [];

  init() {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.3;

    // Create simple reverb via feedback delay
    const delay = this.ctx.createDelay(0.5);
    delay.delayTime.value = 0.15;
    const feedback = this.ctx.createGain();
    feedback.gain.value = 0.3;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2000;

    this.masterGain.connect(this.ctx.destination);
    this.masterGain.connect(delay);
    delay.connect(feedback);
    feedback.connect(filter);
    filter.connect(delay);
    filter.connect(this.ctx.destination);
  }

  async resume() {
    if (this.ctx?.state === "suspended") {
      await this.ctx.resume();
    }
  }

  stop() {
    this.scheduledSources.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        // already stopped
      }
    });
    this.scheduledSources = [];
    this.isPlaying = false;
  }

  // Play a single note with warm timbre
  playNote(freq: number, duration: number, startTime: number): OscillatorNode | null {
    if (!this.ctx || !this.masterGain) return null;

    const now = startTime;

    // Fundamental
    const osc = this.ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;

    // Soft harmonic for warmth
    const osc2 = this.ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2;

    const noteGain = this.ctx.createGain();
    const harmGain = this.ctx.createGain();

    // ADSR envelope
    const attack = 0.02;
    const decay = 0.1;
    const sustain = 0.6;
    const release = Math.min(duration * 0.3, 0.2);

    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.8, now + attack);
    noteGain.gain.linearRampToValueAtTime(sustain, now + attack + decay);
    noteGain.gain.setValueAtTime(sustain, now + duration - release);
    noteGain.gain.linearRampToValueAtTime(0, now + duration);

    harmGain.gain.setValueAtTime(0, now);
    harmGain.gain.linearRampToValueAtTime(0.15, now + attack);
    harmGain.gain.linearRampToValueAtTime(0.08, now + attack + decay);
    harmGain.gain.linearRampToValueAtTime(0, now + duration);

    osc.connect(noteGain);
    osc2.connect(harmGain);
    noteGain.connect(this.masterGain);
    harmGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.05);
    osc2.start(now);
    osc2.stop(now + duration + 0.05);

    return osc;
  }

  // Play a full motif with timing
  playMotif(motif: Motif, onNoteStart?: (index: number) => void): void {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    this.stop();
    this.isPlaying = true;

    void this.resume().then(() => {
      let offset = this.ctx!.currentTime + 0.1;

      motif.notes.forEach((note, i) => {
        const osc = this.playNote(note.freq, note.duration, offset);
        if (osc) {
          this.scheduledSources.push(osc);
        }

        // Schedule callback for animation sync
        if (onNoteStart) {
          const delay = (offset - this.ctx!.currentTime) * 1000;
          setTimeout(() => {
            if (this.isPlaying) onNoteStart(i);
          }, Math.max(0, delay));
        }

        offset += note.duration + 0.05;
      });
    });
  }

  // Play a single note immediately (for scroll interactions)
  ping(freq: number, duration = 0.15) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    void this.resume().then(() => {
      this.playNote(freq, duration, this.ctx!.currentTime);
    });
  }

  destroy() {
    this.stop();
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
  }
}
