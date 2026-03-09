"use client";

import { useEffect, useRef } from "react";
import type { Motif } from "./motif-data";

interface StaffNotationProps {
  motif: Motif;
  activeNoteIndex: number;
  width?: number;
  height?: number;
}

export default function StaffNotation({
  motif,
  activeNoteIndex,
  width = 600,
  height = 200,
}: StaffNotationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const staffTop = 40;
  const staffSpacing = 12;
  const staffLines = 5;
  const staffHeight = staffSpacing * (staffLines - 1);
  const staffCenter = staffTop + staffHeight / 2;
  const noteSpacing = width / (motif.notes.length + 2);
  const noteStartX = noteSpacing * 1.5;

  // Map staffY to pixel Y (higher staffY = higher pitch = lower Y)
  const yForStaffPos = (pos: number) => staffCenter - pos * (staffSpacing / 2);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-2xl"
      style={{ overflow: "visible" }}
    >
      {/* Staff lines */}
      {Array.from({ length: staffLines }).map((_, i) => (
        <line
          key={`staff-${i}`}
          x1={20}
          y1={staffTop + i * staffSpacing}
          x2={width - 20}
          y2={staffTop + i * staffSpacing}
          stroke="var(--color-staff)"
          strokeWidth={1}
        />
      ))}

      {/* Treble clef hint */}
      <text
        x={30}
        y={staffTop + staffHeight / 2 + 6}
        fontFamily="serif"
        fontSize={38}
        fill="var(--color-muted)"
        opacity={0.5}
      >
        𝄞
      </text>

      {/* Notes */}
      {motif.notes.map((note, i) => {
        const x = noteStartX + i * noteSpacing;
        const y = yForStaffPos(note.staffY);
        const isActive = i === activeNoteIndex;
        const isPast = i < activeNoteIndex;
        const isLong = note.duration >= 0.4;

        // Ledger lines if note is outside staff
        const ledgerLines: number[] = [];
        if (note.staffY > 4) {
          for (let l = 5; l <= Math.ceil(note.staffY); l++) {
            if (l % 1 === 0) ledgerLines.push(l);
          }
        }
        if (note.staffY < -4) {
          for (let l = -5; l >= Math.floor(note.staffY); l--) {
            if (l % 1 === 0) ledgerLines.push(l);
          }
        }

        return (
          <g key={`note-${i}`}>
            {/* Ledger lines */}
            {ledgerLines.map((l) => (
              <line
                key={`ledger-${i}-${l}`}
                x1={x - 12}
                y1={yForStaffPos(l)}
                x2={x + 12}
                y2={yForStaffPos(l)}
                stroke="var(--color-staff)"
                strokeWidth={1}
              />
            ))}

            {/* Stem */}
            <line
              x1={x + 6}
              y1={y}
              x2={x + 6}
              y2={y - 30}
              stroke={
                isActive
                  ? motif.color
                  : isPast
                    ? "var(--color-muted)"
                    : "var(--color-note-idle)"
              }
              strokeWidth={1.5}
              opacity={isActive ? 1 : isPast ? 0.5 : 0.8}
              style={{
                transition: "all 0.15s ease-out",
              }}
            />

            {/* Note head */}
            <ellipse
              cx={x}
              cy={y}
              rx={7}
              ry={5}
              transform={`rotate(-15, ${x}, ${y})`}
              fill={
                isActive
                  ? motif.color
                  : isPast
                    ? "var(--color-muted)"
                    : isLong
                      ? "none"
                      : "var(--color-note-idle)"
              }
              stroke={
                isActive
                  ? motif.color
                  : isPast
                    ? "var(--color-muted)"
                    : "var(--color-note-idle)"
              }
              strokeWidth={isLong ? 2 : 0}
              style={{
                transition: "all 0.15s ease-out",
                filter: isActive
                  ? `drop-shadow(0 0 8px ${motif.color})`
                  : "none",
              }}
            />

            {/* Active glow ring */}
            {isActive && (
              <circle
                cx={x}
                cy={y}
                r={14}
                fill="none"
                stroke={motif.color}
                strokeWidth={2}
                opacity={0.4}
                className="animate-pulse"
              />
            )}

            {/* Note name label */}
            <text
              x={x}
              y={height - 10}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill={
                isActive ? motif.color : isPast ? "var(--color-muted)" : "var(--color-note-idle)"
              }
              opacity={isActive ? 1 : 0.5}
              style={{ transition: "all 0.15s ease-out" }}
            >
              {note.pitch}
            </text>
          </g>
        );
      })}

      {/* Connecting contour line */}
      <path
        d={motif.notes
          .map((note, i) => {
            const x = noteStartX + i * noteSpacing;
            const y = yForStaffPos(note.staffY);
            return `${i === 0 ? "M" : "L"} ${x} ${y - 10}`;
          })
          .join(" ")}
        fill="none"
        stroke={motif.color}
        strokeWidth={1}
        strokeDasharray="4 4"
        opacity={0.25}
      />
    </svg>
  );
}
