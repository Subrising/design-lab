# Design Lab Audit — Top 5 Experiments
> Audited: 2026-03-09 | Method: `npx serve out/ -l PORT` + Playwright screenshot

---

## Root Issue: basePath Mismatch (Affects All 5)

Every experiment is built with `basePath: "/experiment-name"` in `next.config.ts`, but `out/` is a flat directory — assets live at `/_next/...` while HTML references `/experiment-name/_next/...`. When served from `out/` directly, CSS/JS 404s (or SPA-redirects to index.html), so styles never apply and WebGL never mounts.

**Fix template**: serve from the *parent* of `out/` and navigate to `http://localhost:PORT/experiment-name`, OR rebuild with `basePath: ""`.

---

## Screenshots

| Experiment | Status | What's Visible |
|---|---|---|
| gommage-effect | ⚠️ Broken CSS | Raw HTML labels on white bg — WebGL canvas absent |
| adovasio | ⚠️ Broken CSS | Nav bar only, hero is blank |
| griflan | ✅ Partial | "We craft / digital" typography renders — GSAP animations frozen |
| d2c-rubiks | ❌ Blank | Completely white — pure client-side, no static HTML fallback |
| threejs-paris | ❌ Blank | Completely white — Three.js scene is 100% client-side |

---

## TOP 3 Worth Polishing

### 1. `griflan` — Best Bones, Most Immediately Polish-able
**Why**: It's the only one where text content renders in a static screenshot — the GSAP typography is enormous, bold, and already has the right color treatment (cream "We craft" → red "digital"). Has an `images/` directory with actual assets. The layout skeleton is visibly impressive.

**What it needs to be pixel-perfect**:
- Fix basePath serve issue (serve from parent dir, navigate to `/griflan`)
- Verify GSAP scroll animations fire: `ScrollTrigger` pin/scrub for the rotating headline
- Check `magnetic-cursor` — likely needs pointer events to initialize
- Confirm page transitions (Barba.js or GSAP?) between sections are wired up
- Nav links probably point to `#section` anchors that need to exist in the DOM

---

### 2. `threejs-paris` — Most Impressive Concept, Strongest Static HTML
**Why**: The static export has the most complete non-WebGL structure of any experiment — a full nav (with Geist font loaded), and the body suggests speaker cards and section structure. It's a professional conference site (Three.js Conference Paris 2025, La Gaîte Lyrique). When working, the 3D hero + speaker cards would be portfolio showpiece material.

**What it needs to be pixel-perfect**:
- Fix basePath issue — the nav currently has `transform:translateY(-80px)` (GSAP initial state = hidden), so fix the serve path first to verify
- Three.js hero scene: verify `GLTFLoader` / particle system initializes; check for missing model files in `out/`
- Speaker section: confirm card images are in `out/public/` and paths resolve
- Responsive nav collapse (hidden md breakpoint) needs verification on mobile
- Confirm scroll-based camera animation ties to `ScrollTrigger`

---

### 3. `gommage-effect` — Most Technically Impressive Effect
**Why**: MSDF signed distance field text dissolution into instanced particles with Perlin noise + bloom post-processing is a genuinely rare WebGL technique. The label overlay HTML is properly structured. This is the kind of effect that makes portfolios go viral.

**What it needs to be pixel-perfect**:
- Fix basePath issue first — the body has `bg-[#0a0a0a]` which should be almost-black; once CSS loads the canvas will appear
- Verify Three.js canvas mounts as `position:absolute inset-0` behind the text overlay
- Check MSDF font atlas is in `out/public/` (these are typically `.png` + `.json` descriptor files — easy to miss in static export)
- Confirm `InstancedMesh` particle count (likely 100k+) doesn't OOM on first render
- The `click to dissolve` interaction: test that click event triggers dissolve → reassemble cycle

---

## BROKEN — Fix or Delete

### `adovasio` — Fix (Good Concept, Bad Static Export)
The cinematic photography parallax gallery has strong design DNA (dark nav, multi-section scroll storytelling) but the entire hero is client-side only — no static HTML fallback for images. Fixing basePath will likely reveal it, but image assets need verification. Worth fixing if the asset pipeline is intact.

### `d2c-rubiks` — Fix or Delete
The HTML is `<main><!--$!--><template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING"></template><!--/$--></main>` — the entire page is client-side with zero static fallback. The Rubik's cube concept (face rotation, custom shaders) is interesting but the experiment has the weakest structural foundation. If the Three.js scene works after the basePath fix it's worth keeping; if not, low priority.

---

## Quick Test Command (Correct Way to Preview)

```bash
# To properly test griflan (or any experiment):
# Serve the PARENT directory (design-lab root) not the out/ subdirectory
cd /home/dzgra/clawd/experiments/design-lab
npx serve . -l 4000
# Then visit: http://localhost:4000/griflan/out/
```

Or rebuild without basePath for local testing:
```bash
cd griflan
NEXT_PUBLIC_BASE_PATH="" npx next build
npx serve out/ -l 4000
```
