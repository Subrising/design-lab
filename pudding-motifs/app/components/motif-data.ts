// Musical motif data — real motifs from classical compositions
// Frequencies in Hz, durations in seconds

export interface Note {
  pitch: string;
  freq: number;
  duration: number;
  // SVG staff position (0 = middle line, positive = up, negative = down)
  staffY: number;
}

export interface Motif {
  id: string;
  composer: string;
  piece: string;
  year: number;
  description: string;
  color: string;
  notes: Note[];
  // Analysis metrics
  intervalPattern: number[]; // semitone intervals between notes
  rhythmicDensity: number; // notes per second
  range: number; // semitone range
  contour: ("up" | "down" | "same")[]; // melodic contour
}

// Beethoven's 5th — the most famous motif in all of music
const beethoven5th: Motif = {
  id: "beethoven-5th",
  composer: "Beethoven",
  piece: "Symphony No. 5",
  year: 1808,
  description:
    "Four notes that changed music forever. The iconic 'fate knocking at the door' motif — three short G's followed by a long E♭ — is perhaps the most recognizable musical phrase ever written.",
  color: "var(--color-beethoven)",
  notes: [
    { pitch: "G4", freq: 392.0, duration: 0.2, staffY: 2 },
    { pitch: "G4", freq: 392.0, duration: 0.2, staffY: 2 },
    { pitch: "G4", freq: 392.0, duration: 0.2, staffY: 2 },
    { pitch: "Eb4", freq: 311.13, duration: 0.8, staffY: 0 },
    { pitch: "F4", freq: 349.23, duration: 0.2, staffY: 1 },
    { pitch: "F4", freq: 349.23, duration: 0.2, staffY: 1 },
    { pitch: "F4", freq: 349.23, duration: 0.2, staffY: 1 },
    { pitch: "D4", freq: 293.66, duration: 0.8, staffY: -1 },
  ],
  intervalPattern: [0, 0, -4, 2, 0, 0, -3],
  rhythmicDensity: 2.7,
  range: 5,
  contour: ["same", "same", "down", "up", "same", "same", "down"],
};

// Bach — Toccata and Fugue in D minor
const bachToccata: Motif = {
  id: "bach-toccata",
  composer: "Bach",
  piece: "Toccata & Fugue in D minor",
  year: 1708,
  description:
    "The dramatic descending figure that opens Bach's most famous organ work. A cascading trill followed by a plunging diminished chord — pure theatrical brilliance from the Baroque master.",
  color: "var(--color-bach)",
  notes: [
    { pitch: "A5", freq: 880.0, duration: 0.15, staffY: 8 },
    { pitch: "G5", freq: 783.99, duration: 0.15, staffY: 7 },
    { pitch: "A5", freq: 880.0, duration: 0.4, staffY: 8 },
    { pitch: "G5", freq: 783.99, duration: 0.2, staffY: 7 },
    { pitch: "F5", freq: 698.46, duration: 0.2, staffY: 6 },
    { pitch: "E5", freq: 659.26, duration: 0.2, staffY: 5 },
    { pitch: "D5", freq: 587.33, duration: 0.2, staffY: 4 },
    { pitch: "C#5", freq: 554.37, duration: 0.6, staffY: 3.5 },
    { pitch: "D5", freq: 587.33, duration: 0.8, staffY: 4 },
  ],
  intervalPattern: [-2, 2, -2, -2, -1, -2, -1, 1],
  rhythmicDensity: 3.2,
  range: 10,
  contour: ["down", "up", "down", "down", "down", "down", "down", "up"],
};

// Mozart — Eine kleine Nachtmusik
const mozartNachtmusik: Motif = {
  id: "mozart-nachtmusik",
  composer: "Mozart",
  piece: "Eine kleine Nachtmusik",
  year: 1787,
  description:
    "Elegant, symmetrical, and perfectly balanced. Mozart's serenade opens with a rising arpeggio that embodies Classical-era grace — each note placed with mathematical precision yet seemingly effortless.",
  color: "var(--color-mozart)",
  notes: [
    { pitch: "G4", freq: 392.0, duration: 0.3, staffY: 2 },
    { pitch: "D4", freq: 293.66, duration: 0.15, staffY: -1 },
    { pitch: "D4", freq: 293.66, duration: 0.3, staffY: -1 },
    { pitch: "G4", freq: 392.0, duration: 0.3, staffY: 2 },
    { pitch: "D4", freq: 293.66, duration: 0.15, staffY: -1 },
    { pitch: "D4", freq: 293.66, duration: 0.3, staffY: -1 },
    { pitch: "G4", freq: 392.0, duration: 0.15, staffY: 2 },
    { pitch: "B4", freq: 493.88, duration: 0.15, staffY: 3 },
    { pitch: "D5", freq: 587.33, duration: 0.4, staffY: 4 },
  ],
  intervalPattern: [-7, 0, 7, -7, 0, 7, 4, 5],
  rhythmicDensity: 3.9,
  range: 12,
  contour: ["down", "same", "up", "down", "same", "up", "up", "up"],
};

// Debussy — Clair de Lune
const debussyClair: Motif = {
  id: "debussy-clair",
  composer: "Debussy",
  piece: "Clair de Lune",
  year: 1905,
  description:
    "Impressionist moonlight captured in sound. Debussy's delicate descending phrase floats with an ethereal quality — notes dissolving into each other like watercolors bleeding on wet paper.",
  color: "var(--color-debussy)",
  notes: [
    { pitch: "Db5", freq: 554.37, duration: 0.5, staffY: 4 },
    { pitch: "Ab4", freq: 415.3, duration: 0.4, staffY: 2.5 },
    { pitch: "Gb4", freq: 369.99, duration: 0.3, staffY: 1.5 },
    { pitch: "Ab4", freq: 415.3, duration: 0.3, staffY: 2.5 },
    { pitch: "Bb4", freq: 466.16, duration: 0.5, staffY: 3 },
    { pitch: "Ab4", freq: 415.3, duration: 0.4, staffY: 2.5 },
    { pitch: "Gb4", freq: 369.99, duration: 0.5, staffY: 1.5 },
    { pitch: "Eb4", freq: 311.13, duration: 0.7, staffY: 0 },
  ],
  intervalPattern: [-6, -2, 2, 2, -2, -2, -4],
  rhythmicDensity: 2.2,
  range: 8,
  contour: ["down", "down", "up", "up", "down", "down", "down"],
};

export const motifs: Motif[] = [
  beethoven5th,
  bachToccata,
  mozartNachtmusik,
  debussyClair,
];

// Utility: get note name without octave
export function noteName(pitch: string): string {
  return pitch.replace(/\d+/, "");
}

// Utility: calculate total duration of a motif
export function motifDuration(motif: Motif): number {
  return motif.notes.reduce((sum, n) => sum + n.duration, 0);
}

// Comparative analysis data for D3 charts
export interface ComparativeMetric {
  composer: string;
  color: string;
  rhythmicDensity: number;
  range: number;
  avgInterval: number;
  noteCount: number;
  totalDuration: number;
  year: number;
}

export function getComparativeData(): ComparativeMetric[] {
  return motifs.map((m) => ({
    composer: m.composer,
    color: m.color,
    rhythmicDensity: m.rhythmicDensity,
    range: m.range,
    avgInterval:
      m.intervalPattern.reduce((s, v) => s + Math.abs(v), 0) /
      m.intervalPattern.length,
    noteCount: m.notes.length,
    totalDuration: motifDuration(m),
    year: m.year,
  }));
}
