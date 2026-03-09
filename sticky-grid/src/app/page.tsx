const IMAGES = [
  { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop", label: "Abstract Flow" },
  { src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=600&fit=crop", label: "Gradient Wave" },
  { src: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600&h=600&fit=crop", label: "Color Bleed" },
  { src: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&h=600&fit=crop", label: "Neon Glow" },
  { src: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=600&h=600&fit=crop", label: "Digital Mesh" },
  { src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=600&fit=crop", label: "Prism Light" },
  { src: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=600&h=600&fit=crop", label: "Silk Thread" },
  { src: "https://images.unsplash.com/photo-1604076913837-52ab5f7c1ac4?w=600&h=600&fit=crop", label: "Crystal Form" },
  { src: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=600&h=600&fit=crop", label: "Deep Space" },
  { src: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop", label: "Liquid Metal" },
  { src: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=600&fit=crop", label: "Grid Pulse" },
  { src: "https://images.unsplash.com/photo-1634017839464-5c339afa60f0?w=600&h=600&fit=crop", label: "Bloom Light" },
];

function GridItem({
  src,
  label,
  className = "",
}: {
  src: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`grid-item ${className}`}>
      <img src={src} alt={label} loading="lazy" />
      <span className="card-label">{label}</span>
    </div>
  );
}

function GridSection({
  sectionClass,
  title,
  subtitle,
}: {
  sectionClass: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className={`scroll-runway ${sectionClass}`}>
      <div className="sticky-stage">
        <div className="section-title title-glow">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-white/60 max-w-md mx-auto">
            {subtitle}
          </p>
        </div>
        <div className="grid-container">
          {IMAGES.map((img, i) => (
            <GridItem
              key={`${sectionClass}-${i}`}
              src={img.src}
              label={img.label}
              className={
                i === 0
                  ? "grid-item--wide"
                  : i === 3
                    ? "grid-item--tall"
                    : i === 7
                      ? "grid-item--wide"
                      : ""
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function StickyGridPage() {
  return (
    <main>
      {/* Scroll progress bar */}
      <div className="scroll-progress" />

      {/* Hero intro */}
      <section className="intro-section">
        <div className="hero-content text-center px-6">
          <p className="text-sm uppercase tracking-[0.3em] text-white/40 mb-6">
            CSS Scroll-Driven Animations
          </p>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-purple-400 via-cyan-300 to-pink-400 bg-clip-text text-transparent">
            Sticky Grid
            <br />
            Scroll
          </h1>
          <p className="text-lg text-white/50 max-w-lg mx-auto mb-10">
            Pure CSS animations bound to scroll position. No JavaScript.
            No animation libraries. Just modern CSS.
          </p>
          <div className="flex items-center justify-center gap-2 text-white/30 text-sm">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="animate-bounce"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
            Scroll to explore
          </div>
        </div>
      </section>

      {/* Section 1: Directional reveals */}
      <GridSection
        sectionClass="section-1"
        title="Reveal"
        subtitle="Items fly in from their nearest edge"
      />

      {/* Section 2: Spiral + zoom */}
      <GridSection
        sectionClass="section-2"
        title="Spiral"
        subtitle="Rotation and scale driven by scroll position"
      />

      {/* Section 3: Staggered cascade */}
      <GridSection
        sectionClass="section-3"
        title="Cascade"
        subtitle="Staggered reveals with CSS custom properties"
      />

      {/* Section 4: Morph + flip */}
      <GridSection
        sectionClass="section-4"
        title="Morph"
        subtitle="Shape-shifting cards with 3D perspective flips"
      />

      {/* Footer */}
      <footer className="h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="text-sm uppercase tracking-[0.3em] text-white/30 mb-4">
          Built with
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Zero JavaScript Animations
        </h2>
        <p className="text-white/40 max-w-md">
          All animations use{" "}
          <code className="text-purple-400 bg-white/5 px-2 py-1 rounded text-sm">
            animation-timeline: scroll()
          </code>{" "}
          — a CSS-native API that binds keyframes to scroll progress.
        </p>
        <div className="mt-10 flex gap-4 text-sm text-white/30">
          <span>CSS Scroll-Driven Animations</span>
          <span>·</span>
          <span>CSS Grid</span>
          <span>·</span>
          <span>Tailwind CSS</span>
        </div>
      </footer>
    </main>
  );
}
