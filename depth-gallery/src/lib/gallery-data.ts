export interface GalleryItem {
  id: number;
  title: string;
  subtitle: string;
  // CSS hex for background gradient
  bg1: string;
  bg2: string;
  // Shader colors: normalized 0-1 RGB
  col1: [number, number, number]; // shadows / deep tones
  col2: [number, number, number]; // midtones
  col3: [number, number, number]; // highlights / accent
}

export const ITEMS: GalleryItem[] = [
  {
    id: 0,
    title: "Nocturne",
    subtitle: "Deep violet",
    bg1: "#060610",
    bg2: "#0f0a28",
    col1: [0.02, 0.02, 0.06],
    col2: [0.08, 0.05, 0.2],
    col3: [0.48, 0.22, 0.98],
  },
  {
    id: 1,
    title: "Ember",
    subtitle: "Warm amber",
    bg1: "#100804",
    bg2: "#221006",
    col1: [0.06, 0.03, 0.01],
    col2: [0.3, 0.1, 0.03],
    col3: [0.98, 0.52, 0.08],
  },
  {
    id: 2,
    title: "Pelagic",
    subtitle: "Ocean deep",
    bg1: "#040c14",
    bg2: "#081c2c",
    col1: [0.02, 0.05, 0.09],
    col2: [0.05, 0.16, 0.3],
    col3: [0.12, 0.68, 0.98],
  },
  {
    id: 3,
    title: "Verdant",
    subtitle: "Forest green",
    bg1: "#060e08",
    bg2: "#0c2012",
    col1: [0.02, 0.05, 0.03],
    col2: [0.06, 0.2, 0.09],
    col3: [0.22, 0.85, 0.44],
  },
  {
    id: 4,
    title: "Ash",
    subtitle: "Neutral silver",
    bg1: "#0a0a0c",
    bg2: "#14141c",
    col1: [0.05, 0.05, 0.06],
    col2: [0.16, 0.16, 0.2],
    col3: [0.78, 0.78, 0.85],
  },
  {
    id: 5,
    title: "Helios",
    subtitle: "Solar gold",
    bg1: "#100c02",
    bg2: "#1e1604",
    col1: [0.07, 0.05, 0.01],
    col2: [0.26, 0.19, 0.03],
    col3: [0.98, 0.88, 0.18],
  },
  {
    id: 6,
    title: "Bloom",
    subtitle: "Magenta rose",
    bg1: "#10060e",
    bg2: "#1e0c1c",
    col1: [0.06, 0.02, 0.06],
    col2: [0.22, 0.06, 0.2],
    col3: [0.92, 0.18, 0.78],
  },
  {
    id: 7,
    title: "Glacial",
    subtitle: "Arctic cyan",
    bg1: "#060c14",
    bg2: "#0c1a28",
    col1: [0.03, 0.05, 0.09],
    col2: [0.08, 0.15, 0.25],
    col3: [0.42, 0.84, 1.0],
  },
];

// Three.js units between planes on the Z axis
export const SPACING = 4;

// How far ahead of the current plane the camera sits
export const CAMERA_OFFSET = 2.5;
