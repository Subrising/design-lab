"use client";

const items = ["Brand Strategy", "Digital Design", "Motion Graphics", "WebGL", "Creative Direction", "Interactive Art"];

export default function MarqueeStrip() {
  return (
    <div className="studio-marquee" style={{ position: "relative", zIndex: 1 }}>
      <div className="studio-marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="studio-marquee-item">
            {item}
            <span className="dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
