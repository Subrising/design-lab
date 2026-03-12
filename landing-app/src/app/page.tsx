"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Hero from "@/components/Hero";
import ControlsBar from "@/components/ControlsBar";
import ExperimentCard from "@/components/ExperimentCard";
import experiments from "@/data/experiments.json";

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return experiments.filter((exp) => {
      const matchesCategory = category === "all" || exp.category === category;
      if (!matchesCategory) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        exp.title.toLowerCase().includes(q) ||
        exp.description.toLowerCase().includes(q) ||
        exp.slug.includes(q) ||
        exp.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [search, category]);

  return (
    <>
      <div className="gradient-mesh">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="grid-lines" />
      <div className="noise-overlay" />

      <main className="main-content">
        <Hero count={experiments.length} />

        <ControlsBar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          resultCount={filtered.length}
          totalCount={experiments.length}
        />

        <section className="experiments-section">
          <div className="experiment-grid">
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                filtered.map((exp, i) => (
                  <ExperimentCard key={exp.slug} experiment={exp} index={i} />
                ))
              ) : (
                <motion.div
                  className="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="icon">&#9776;</div>
                  <p>No experiments match your search.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <footer className="footer">
          <p>
            Design Lab &mdash; {experiments.length} experiments and counting.
            Built with Next.js &amp; Framer Motion.
          </p>
        </footer>
      </main>
    </>
  );
}
