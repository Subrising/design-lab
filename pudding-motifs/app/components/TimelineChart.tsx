"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { motifs } from "./motif-data";

interface TimelineChartProps {
  isVisible: boolean;
}

export default function TimelineChart({ isVisible }: TimelineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!svgRef.current || !isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 700;
    const height = 200;
    const margin = { top: 30, right: 40, bottom: 40, left: 40 };

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const x = d3
      .scaleLinear()
      .domain([1700, 1920])
      .range([0, innerW]);

    // Timeline axis
    g.append("line")
      .attr("x1", 0)
      .attr("x2", innerW)
      .attr("y1", innerH / 2)
      .attr("y2", innerH / 2)
      .attr("stroke", "var(--color-staff)")
      .attr("stroke-width", 1);

    // Era labels
    const eras = [
      { start: 1700, end: 1750, label: "Baroque" },
      { start: 1750, end: 1820, label: "Classical" },
      { start: 1820, end: 1900, label: "Romantic" },
      { start: 1900, end: 1920, label: "Impressionist" },
    ];

    eras.forEach((era) => {
      g.append("rect")
        .attr("x", x(era.start))
        .attr("y", innerH / 2 + 12)
        .attr("width", x(era.end) - x(era.start))
        .attr("height", 20)
        .attr("fill", "var(--color-staff)")
        .attr("opacity", 0.15)
        .attr("rx", 3);

      g.append("text")
        .attr("x", (x(era.start) + x(era.end)) / 2)
        .attr("y", innerH / 2 + 26)
        .attr("text-anchor", "middle")
        .attr("font-size", 9)
        .attr("font-family", "var(--font-mono)")
        .attr("fill", "var(--color-muted)")
        .text(era.label);
    });

    // Tick marks
    d3.range(1700, 1930, 25).forEach((year) => {
      g.append("line")
        .attr("x1", x(year))
        .attr("x2", x(year))
        .attr("y1", innerH / 2 - 4)
        .attr("y2", innerH / 2 + 4)
        .attr("stroke", "var(--color-staff)")
        .attr("stroke-width", 1);

      if (year % 50 === 0) {
        g.append("text")
          .attr("x", x(year))
          .attr("y", innerH / 2 + 48)
          .attr("text-anchor", "middle")
          .attr("font-size", 10)
          .attr("font-family", "var(--font-mono)")
          .attr("fill", "var(--color-muted)")
          .text(year);
      }
    });

    // Motif markers
    motifs.forEach((motif, i) => {
      const cx = x(motif.year);
      const cy = innerH / 2;

      // Line from center
      g.append("line")
        .attr("x1", cx)
        .attr("x2", cx)
        .attr("y1", cy)
        .attr("y2", cy - 45)
        .attr("stroke", motif.color)
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "3 2")
        .attr("opacity", 0)
        .transition()
        .duration(600)
        .delay(i * 200)
        .attr("opacity", 0.6);

      // Circle
      g.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", 0)
        .attr("fill", motif.color)
        .transition()
        .duration(500)
        .delay(i * 200)
        .attr("r", 8);

      // Year label
      g.append("text")
        .attr("x", cx)
        .attr("y", cy - 52)
        .attr("text-anchor", "middle")
        .attr("font-size", 11)
        .attr("font-weight", 600)
        .attr("font-family", "var(--font-sans)")
        .attr("fill", motif.color)
        .attr("opacity", 0)
        .text(motif.year)
        .transition()
        .duration(400)
        .delay(i * 200 + 200)
        .attr("opacity", 1);

      // Composer label
      g.append("text")
        .attr("x", cx)
        .attr("y", cy - 65)
        .attr("text-anchor", "middle")
        .attr("font-size", 12)
        .attr("font-weight", 500)
        .attr("font-family", "var(--font-serif)")
        .attr("fill", "var(--color-ink)")
        .attr("opacity", 0)
        .text(motif.composer)
        .transition()
        .duration(400)
        .delay(i * 200 + 300)
        .attr("opacity", 1);
    });
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) hasAnimated.current = false;
  }, [isVisible]);

  return (
    <svg
      ref={svgRef}
      className="w-full max-w-3xl mx-auto"
      style={{ overflow: "visible" }}
    />
  );
}
