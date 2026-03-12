"use client";

import { motion } from "framer-motion";

interface Experiment {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  url: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  flagship: "linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)",
  "site-recreation": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "studio-portfolio": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "3d-webgl": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  typography: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "scroll-layout": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "visual-effects": "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
};

const CATEGORY_LABELS: Record<string, string> = {
  flagship: "Flagship",
  "site-recreation": "Site Recreation",
  "studio-portfolio": "Studio & Portfolio",
  "3d-webgl": "3D / WebGL",
  typography: "Typography",
  "scroll-layout": "Scroll & Layout",
  "visual-effects": "Visual Effects",
};

export default function ExperimentCard({
  experiment,
  index,
}: {
  experiment: Experiment;
  index: number;
}) {
  const glowBg = CATEGORY_COLORS[experiment.category] || CATEGORY_COLORS["visual-effects"];

  return (
    <motion.a
      href={experiment.url}
      className="experiment-card"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
    >
      <div className="card-glow" style={{ background: `${glowBg}`, opacity: 0.06 }} />
      <div className="card-content">
        <div className="card-header">
          <span className="card-category">
            {CATEGORY_LABELS[experiment.category] || experiment.category}
          </span>
          <span className="card-arrow">&#8599;</span>
        </div>
        <h3 className="card-title">{experiment.title}</h3>
        <p className="card-description">{experiment.description}</p>
        <div className="card-tags">
          {experiment.tags.map((tag) => (
            <span key={tag} className="tech-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}
