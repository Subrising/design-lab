"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { Motif } from "./motif-data";

interface IntervalChartProps {
  motif: Motif;
  isVisible: boolean;
}

export default function IntervalChart({ motif, isVisible }: IntervalChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!svgRef.current || !isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 500;
    const height = 180;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const g = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const data = motif.intervalPattern;
    const maxAbs = Math.max(...data.map(Math.abs), 1);

    const x = d3
      .scaleBand<number>()
      .domain(d3.range(data.length))
      .range([0, innerW])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([-maxAbs - 1, maxAbs + 1])
      .range([innerH, 0]);

    // Zero line
    g.append("line")
      .attr("x1", 0)
      .attr("x2", innerW)
      .attr("y1", y(0))
      .attr("y2", y(0))
      .attr("stroke", "var(--color-staff)")
      .attr("stroke-dasharray", "4 2");

    // Labels
    g.append("text")
      .attr("x", -8)
      .attr("y", y(maxAbs))
      .attr("text-anchor", "end")
      .attr("font-size", 9)
      .attr("fill", "var(--color-muted)")
      .attr("font-family", "var(--font-mono)")
      .text("↑ up");

    g.append("text")
      .attr("x", -8)
      .attr("y", y(-maxAbs))
      .attr("text-anchor", "end")
      .attr("font-size", 9)
      .attr("fill", "var(--color-muted)")
      .attr("font-family", "var(--font-mono)")
      .text("↓ down");

    // Bars
    g.selectAll(".interval-bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (_, i) => x(i)!)
      .attr("width", x.bandwidth())
      .attr("y", y(0))
      .attr("height", 0)
      .attr("rx", 3)
      .attr("fill", (d) => (d >= 0 ? motif.color : "var(--color-muted)"))
      .attr("opacity", 0.8)
      .transition()
      .duration(600)
      .delay((_, i) => i * 80)
      .attr("y", (d) => (d >= 0 ? y(d) : y(0)))
      .attr("height", (d) => Math.abs(y(d) - y(0)));

    // Interval labels
    g.selectAll(".interval-label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (_, i) => x(i)! + x.bandwidth() / 2)
      .attr("y", (d) => (d >= 0 ? y(d) - 5 : y(d) + 14))
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .attr("font-family", "var(--font-mono)")
      .attr("fill", "var(--color-ink)")
      .attr("opacity", 0)
      .text((d) => (d > 0 ? `+${d}` : `${d}`))
      .transition()
      .duration(400)
      .delay((_, i) => i * 80 + 300)
      .attr("opacity", 1);
  }, [motif, isVisible]);

  // Reset when not visible
  useEffect(() => {
    if (!isVisible) {
      hasAnimated.current = false;
    }
  }, [isVisible]);

  return (
    <svg
      ref={svgRef}
      className="w-full max-w-lg"
      style={{ overflow: "visible" }}
    />
  );
}
