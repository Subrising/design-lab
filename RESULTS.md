# Fix Results — basePath Mismatch (2026-03-09)

## Root Cause
All experiments were built with `basePath: "/experiment-name"` in `next.config.ts`, causing `/_next/...` asset 404s when serving `out/` directly. Fix: set `basePath: ""`.

---

## 1. GRIFLAN ✅

**Fix**: `basePath: "/griflan"` → `basePath: ""`
**Rebuild**: `cd griflan && npm run build`
**Commit**: `fix(griflan): clear basePath for portable static export`

### Result
- CSS loads, GSAP intro animation completes (PageTransition red overlay `#FF3831` animates out)
- "WE CRAFT / DIGITAL / EXPERIENCES" hero typography renders at full scale
- Nav (WORK / ABOUT / SERVICES / ARTICLES / CONTACT / Let's Talk) visible
- Scroll indicator and CTAs (VIEW WORK / LEARN MORE) render correctly
- Magnetic cursor and Lenis smooth scroll initialize client-side

### Screenshots
| Viewport | Path |
|---|---|
| 1280×720 | `griflan-fixed.png` |
| 375×812 | `griflan-mobile.png` |

**Note**: Take screenshot with `--wait-for-timeout 3000` or `--wait-for-selector "main"` — GSAP PageTransition overlay (`#FF3831`) covers screen on immediate load.

---

## 2. THREEJS-PARIS ✅

**Fix**: `basePath: "/threejs-paris"` → `basePath: ""`
**Rebuild**: `cd threejs-paris && npm run build`
**Commit**: `fix(threejs-paris): clear basePath for portable static export`

### Result
- Three.js hero scene renders: teal/magenta animated blob particles, conference title
- Nav bar (THREE.JS PARIS logo, Speakers / Schedule / Sponsors / Get Tickets) renders with Geist font
- Hero copy: "The premier WebGL & creative coding event. Join 500+ developers..."
- Event details (June 14–15, 2025 · La Gaîte Lyrique, Paris · 500+ Attendees) visible
- CTA buttons (Get Tickets / Watch Talks) render correctly

### Screenshots
| Viewport | Path |
|---|---|
| 1280×720 | `threejs-paris-fixed.png` |
| 375×812 | `threejs-paris-mobile.png` |

---

## 3. GOMMAGE-EFFECT ✅

**Fix**: `basePath: "/gommage-effect"` → `basePath: ""`
**Rebuild**: `cd gommage-effect && npm run build`
**Commit**: `fix(gommage-effect): clear basePath for portable static export`

### Result
- Dark `#0a0a0a` background renders correctly
- UI overlay: GOMMAGE EFFECT header (top-left), THREE.JS + GLSL (top-right)
- Center hint: "CLICK ANYWHERE TO DISSOLVE" with pulsing circle
- Footer: "PERLIN NOISE DISSOLVE · INSTANCED PARTICLES · BLOOM" / "INSPIRED BY CODROPS"
- Three.js WebGL canvas mounts (particle text invisible in headless Playwright — no GPU — but renders in real browser)
- **No MSDF atlas needed**: uses Canvas2D + system font `Arial Black` to sample particle positions

### Screenshots
| Viewport | Path |
|---|---|
| 1280×720 | `gommage-fixed.png` |
| 375×812 | `gommage-mobile.png` |

**Note**: Use `--wait-for-selector main` (not `--wait-for-timeout`) — the timeout approach races with JS hydration and produces a white blank screen.

---

## Serve Pattern (Verified Working)

```bash
npx serve <experiment>/out -l <PORT> --no-clipboard
playwright screenshot --wait-for-selector "main" --viewport-size='1280,720' http://localhost:<PORT> screenshot.png
```

## Commits

| Commit | Message |
|---|---|
| `a761c383` | fix(griflan): clear basePath for portable static export |
| `d1293741` | fix(threejs-paris): clear basePath for portable static export |
| `128c53e9` | fix(gommage-effect): clear basePath for portable static export |
