"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { getComparativeData } from "./motif-data";

interface ComparisonRadarProps {
  isVisible: boolean;
}

export default function ComparisonRadar({ isVisible }: ComparisonRadarProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!svgRef.current || !isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 400;
    const radius = 140;
    const center = { x: width / 2, y: height / 2 };

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const data = getComparativeData();
    const axes = [
      { key: "rhythmicDensity", label: "Density", max: 5 },
      { key: "range", label: "Range", max: 15 },
      { key: "avgInterval", label: "Avg Leap", max: 6 },
      { key: "noteCount", label: "Notes", max: 10 },
      { key: "totalDuration", label: "Duration", max: 5 },
    ] as const;

    const angleSlice = (Math.PI * 2) / axes.length;

    const g = svg
      .append("g")
      .attr("transform", `translate(${center.x},${center.y})`);

    // Grid circles
    const levels = 4;
    for (let l = 1; l <= levels; l++) {
      const r = (radius / levels) * l;
      g.append("circle")
        .attr("r", r)
        .attr("fill", "none")
        .attr("stroke", "var(--color-staff)")
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.5);
    }

    // Axes
    axes.forEach((axis, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "var(--color-staff)")
        .attr("stroke-width", 0.5);

      g.append("text")
        .attr("x", Math.cos(angle) * (radius + 20))
        .attr("y", Math.sin(angle) * (radius + 20))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", 11)
        .attr("font-family", "var(--font-sans)")
        .attr("fill", "var(--color-muted)")
        .text(axis.label);
    });

    // Data polygons
    data.forEach((d, di) => {
      const points = axes.map((axis, i) => {
        const val = d[axis.key as keyof typeof d] as number;
        const r = (val / axis.max) * radius;
        const angle = angleSlice * i - Math.PI / 2;
        return {
          x: Math.cos(angle) * r,
          y: Math.sin(angle) * r,
        };
      });

      const line = d3
        .lineRadial<{ x: number; y: number }>()
        .angle((_, i) => angleSlice * i)
        .radius((p) => Math.sqrt(p.x * p.x + p.y * p.y))
        .curve(d3.curveLinearClosed);

      const pathStr = points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
        .join(" ") + " Z";

      const area = g
        .append("path")
        .attr("d", pathStr)
        .attr("fill", d.color)
        .attr("fill-opacity", 0)
        .attr("stroke", d.color)
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0);

      area
        .transition()
        .duration(800)
        .delay(di * 200)
        .attr("fill-opacity", 0.1)
        .attr("stroke-opacity", 0.8);

      // Dots at vertices
      points.forEach((p, i) => {
        g.append("circle")
          .attr("cx", p.x)
          .attr("cy", p.y)
          .attr("r", 0)
          .attr("fill", d.color)
          .transition()
          .duration(400)
          .delay(di * 200 + i * 60)
          .attr("r", 4);
      });
    });

    // Legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 100}, 20)`);

    data.forEach((d, i) => {
      const row = legend.append("g").attr("transform", `translate(0, ${i * 22})`);
      row
        .append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("rx", 2)
        .attr("fill", d.color)
        .attr("opacity", 0.8);
      row
        .append("text")
        .attr("x", 18)
        .attr("y", 10)
        .attr("font-size", 12)
        .attr("font-family", "var(--font-sans)")
        .attr("fill", "var(--color-ink)")
        .text(d.composer);
    });
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) hasAnimated.current = false;
  }, [isVisible]);

  return (
    <svg
      ref={svgRef}
      className="w-full max-w-md mx-auto"
      style={{ overflow: "visible" }}
    />
  );
}
