/**
 * Scans sibling experiment directories for metadata and generates a JSON data file.
 * Runs as a prebuild step: reads each experiment's layout.tsx for title/description.
 */
import { readdirSync, readFileSync, statSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..", "..");
const outFile = join(__dirname, "..", "src", "data", "experiments.json");

const SKIP = new Set(["landing", "landing-app", "references", "node_modules", ".github", ".git"]);

const CATEGORIES = {
  "product-launch": "flagship",
  "fashion-runway": "flagship",
  "dark-machine": "flagship",
  "immersive-story": "flagship",
  "creative-studio": "flagship",
  stripe: "site-recreation",
  linear: "site-recreation",
  raycast: "site-recreation",
  clerk: "site-recreation",
  "lando-norris": "site-recreation",
  "cartier-watches": "site-recreation",
  britive: "site-recreation",
  "messenger-meta": "site-recreation",
  "apple-scroll": "site-recreation",
  "apple-product": "site-recreation",
  "dennis-snellenberg": "studio-portfolio",
  "unseen-studio": "studio-portfolio",
  "studio-dialect": "studio-portfolio",
  "jason-bergh": "studio-portfolio",
  "igloo-inc": "studio-portfolio",
  mindmarket: "studio-portfolio",
  "active-theory": "studio-portfolio",
  adovasio: "studio-portfolio",
  "bdsn-club": "studio-portfolio",
  griflan: "studio-portfolio",
  lusion: "studio-portfolio",
  "bubble-metaballs": "3d-webgl",
  "ohzi-interactive": "3d-webgl",
  "bruno-simon": "3d-webgl",
  "voxelized-physics": "3d-webgl",
  "utsubo-expo": "3d-webgl",
  "immersive-garden": "3d-webgl",
  "gen-02-samsy": "3d-webgl",
  "blended-shader": "3d-webgl",
  "reactive-depth-tube": "3d-webgl",
  "wavy-carousels": "3d-webgl",
  "d2c-rubiks": "3d-webgl",
  "threejs-paris": "3d-webgl",
  "kinetic-typography": "typography",
  "text-morphing": "typography",
  "text-destruction": "typography",
  "neon-rated": "typography",
  "gommage-effect": "typography",
  "parallax-scrollytelling": "scroll-layout",
  "zajno-motion": "scroll-layout",
  "horizontal-gallery": "scroll-layout",
  "sticky-grid": "scroll-layout",
  "bento-grid": "scroll-layout",
  "ascii-dithering": "scroll-layout",
  "pudding-motifs": "scroll-layout",
  "ponpon-mania": "scroll-layout",
  "svg-mask-scroll": "scroll-layout",
  "liquid-glass": "visual-effects",
  "magnetic-cursor": "visual-effects",
  aurora: "visual-effects",
  obsidian: "visual-effects",
  "depth-gallery": "visual-effects",
  "rive-app": "visual-effects",
  "webgl-gallery": "visual-effects",
};

const TECH_HINTS = {
  "3d-webgl": ["Three.js", "WebGL", "GLSL"],
  typography: ["GSAP", "Canvas", "CSS"],
  "scroll-layout": ["GSAP", "ScrollTrigger", "CSS"],
  "visual-effects": ["WebGL", "GSAP", "CSS"],
  flagship: ["GSAP", "Three.js", "Scroll"],
  "site-recreation": ["React", "GSAP", "CSS"],
  "studio-portfolio": ["GSAP", "Three.js", "Motion"],
};

function extractMetadata(layoutPath) {
  try {
    const content = readFileSync(layoutPath, "utf-8");
    const titleMatch = content.match(/title:\s*["'](.+?)["']/);
    const descMatch = content.match(/description:\s*\n?\s*["'](.+?)["']/s);
    // Handle multiline description with template literals or concatenation
    const descMatch2 = content.match(/description:\s*["'`]([^"'`]+)["'`]/);
    return {
      title: titleMatch?.[1] || null,
      description: descMatch?.[1] || descMatch2?.[1] || null,
    };
  } catch {
    return { title: null, description: null };
  }
}

function inferTechTags(slug, description) {
  const tags = new Set();
  const desc = (description || "").toLowerCase();
  const techKeywords = {
    "Three.js": ["three.js", "threejs", "3d", "webgl"],
    GLSL: ["glsl", "shader", "raymarching", "sdf"],
    GSAP: ["gsap", "scrolltrigger", "scroll-driven"],
    "Framer Motion": ["framer", "motion"],
    WebGL: ["webgl"],
    Canvas: ["canvas"],
    "CSS Animation": ["css animation", "keyframe"],
    "Scroll Animation": ["scroll", "parallax", "scrollytelling"],
    Physics: ["physics", "rapier", "cannon"],
    Particles: ["particle"],
    R3F: ["r3f", "react-three", "fiber"],
  };

  for (const [tag, keywords] of Object.entries(techKeywords)) {
    if (keywords.some((kw) => desc.includes(kw) || slug.includes(kw))) {
      tags.add(tag);
    }
  }

  // Add category-based defaults if we found nothing specific
  if (tags.size === 0) {
    const cat = CATEGORIES[slug] || "visual-effects";
    (TECH_HINTS[cat] || []).forEach((t) => tags.add(t));
  }

  return [...tags].slice(0, 4);
}

const experiments = [];

for (const entry of readdirSync(rootDir)) {
  if (SKIP.has(entry)) continue;
  const entryPath = join(rootDir, entry);
  if (!statSync(entryPath).isDirectory()) continue;
  if (!existsSync(join(entryPath, "package.json"))) continue;

  // Find layout file
  const layoutPaths = [
    join(entryPath, "src", "app", "layout.tsx"),
    join(entryPath, "app", "layout.tsx"),
  ];
  let meta = { title: null, description: null };
  for (const lp of layoutPaths) {
    if (existsSync(lp)) {
      meta = extractMetadata(lp);
      break;
    }
  }

  const title = meta.title || entry.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const description = meta.description || `Web design experiment: ${entry}`;
  const category = CATEGORIES[entry] || "visual-effects";
  const tags = inferTechTags(entry, description);

  experiments.push({
    slug: entry,
    title: title.replace(/ — Design Lab$/, "").replace(/ — .*$/, ""),
    description,
    category,
    tags,
    url: `/design-lab/${entry}/`,
  });
}

experiments.sort((a, b) => {
  const order = ["flagship", "site-recreation", "studio-portfolio", "3d-webgl", "typography", "scroll-layout", "visual-effects"];
  return order.indexOf(a.category) - order.indexOf(b.category);
});

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(experiments, null, 2));
console.log(`Generated ${experiments.length} experiments → src/data/experiments.json`);
