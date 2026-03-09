"use client";

import { useEffect, useState, useRef } from "react";

interface BlendIndicatorProps {
  mouseRef: React.RefObject<{ x: number; y: number } | null>;
}

export default function BlendIndicator({ mouseRef }: BlendIndicatorProps) {
  const [weights, setWeights] = useState({ metal: 1, glass: 0, organic: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const internalWeights = { metal: 1, glass: 0, organic: 0 };

    const update = () => {
      const mouse = mouseRef.current;
      if (mouse) {
        const mx = mouse.x;
        const my = mouse.y;

        const metalTarget = Math.max(0, -mx * 0.5 + my * 0.5 + 0.5);
        const glassTarget = Math.max(0, mx * 0.5 + my * 0.5 + 0.5);
        const organicTarget = Math.max(0, -my * 0.8 + 0.4);

        const lerp = 0.04;
        internalWeights.metal += (metalTarget - internalWeights.metal) * lerp;
        internalWeights.glass += (glassTarget - internalWeights.glass) * lerp;
        internalWeights.organic += (organicTarget - internalWeights.organic) * lerp;

        const total = internalWeights.metal + internalWeights.glass + internalWeights.organic;
        if (total > 0.001) {
          setWeights({
            metal: internalWeights.metal / total,
            glass: internalWeights.glass / total,
            organic: internalWeights.organic / total,
          });
        }
      }
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mouseRef]);

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6 pointer-events-none select-none">
      <MaterialBar label="Metallic" value={weights.metal} color="#d4cfc8" />
      <MaterialBar label="Glass" value={weights.glass} color="#8bb8e8" />
      <MaterialBar label="Organic" value={weights.organic} color="#6db87a" />
    </div>
  );
}

function MaterialBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex flex-col items-center gap-2 w-28">
      <div className="text-xs font-mono tracking-wider uppercase text-white/60">
        {label}
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-none"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            opacity: 0.8 + value * 0.2,
          }}
        />
      </div>
      <div className="text-[10px] font-mono text-white/40">{pct}%</div>
    </div>
  );
}
