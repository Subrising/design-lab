"use client";

const items = ["New Arrivals", "SS26", "Runway", "Editorial", "Avant-Garde", "Limited Edition", "Capsule", "Couture"];

export default function MarqueeStrip() {
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="marquee-item">
            {item} <span style={{ color: "var(--accent)", margin: "0 1rem" }}>/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
