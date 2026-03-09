"use client";

interface ControlPanelProps {
  cellSize: number;
  onCellSizeChange: (v: number) => void;
  distortionStrength: number;
  onDistortionChange: (v: number) => void;
  sceneMode: "spheres" | "torus" | "terrain";
  onSceneModeChange: (v: "spheres" | "torus" | "terrain") => void;
  colorMode: "green" | "cyan" | "rainbow";
  onColorModeChange: (v: "green" | "cyan" | "rainbow") => void;
}

export default function ControlPanel({
  cellSize,
  onCellSizeChange,
  distortionStrength,
  onDistortionChange,
  sceneMode,
  onSceneModeChange,
  colorMode,
  onColorModeChange,
}: ControlPanelProps) {
  const scenes: Array<{ value: "spheres" | "torus" | "terrain"; label: string }> = [
    { value: "spheres", label: "SPHERES" },
    { value: "torus", label: "TORUS KNOT" },
    { value: "terrain", label: "TERRAIN" },
  ];

  const colors: Array<{ value: "green" | "cyan" | "rainbow"; label: string; color: string }> = [
    { value: "green", label: "MATRIX", color: "#00ff41" },
    { value: "cyan", label: "CYBER", color: "#00d4ff" },
    { value: "rainbow", label: "PRISM", color: "#ff6b00" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-end gap-6">
      {/* Main controls */}
      <div className="bg-black/80 backdrop-blur-md border border-green/20 rounded-lg px-6 py-4 flex items-center gap-8">
        {/* Cell size / density */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] tracking-[0.2em] text-green-dim/60 uppercase">
            Density
          </label>
          <input
            type="range"
            min={4}
            max={24}
            step={1}
            value={cellSize}
            onChange={(e) => onCellSizeChange(Number(e.target.value))}
            className="w-28 accent-green h-1 bg-muted rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green [&::-webkit-slider-thumb]:cursor-crosshair"
          />
          <span className="text-[10px] text-muted text-center font-mono">{cellSize}px</span>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-green/10" />

        {/* Distortion */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] tracking-[0.2em] text-green-dim/60 uppercase">
            Distort
          </label>
          <input
            type="range"
            min={0}
            max={3}
            step={0.1}
            value={distortionStrength}
            onChange={(e) => onDistortionChange(Number(e.target.value))}
            className="w-28 accent-green h-1 bg-muted rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green [&::-webkit-slider-thumb]:cursor-crosshair"
          />
          <span className="text-[10px] text-muted text-center font-mono">
            {distortionStrength.toFixed(1)}x
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-green/10" />

        {/* Scene mode */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] tracking-[0.2em] text-green-dim/60 uppercase">
            Shape
          </label>
          <div className="flex gap-1">
            {scenes.map((s) => (
              <button
                key={s.value}
                onClick={() => onSceneModeChange(s.value)}
                className={`text-[10px] px-2.5 py-1 rounded border transition-all ${
                  sceneMode === s.value
                    ? "bg-green/20 border-green/40 text-green"
                    : "bg-transparent border-muted/30 text-muted hover:border-green/20 hover:text-green-dim"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-green/10" />

        {/* Color mode */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] tracking-[0.2em] text-green-dim/60 uppercase">
            Palette
          </label>
          <div className="flex gap-1">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => onColorModeChange(c.value)}
                className={`text-[10px] px-2.5 py-1 rounded border transition-all ${
                  colorMode === c.value
                    ? "border-opacity-40 text-opacity-100"
                    : "bg-transparent border-muted/30 text-muted hover:text-opacity-60"
                }`}
                style={{
                  borderColor: colorMode === c.value ? c.color + "66" : undefined,
                  backgroundColor: colorMode === c.value ? c.color + "22" : undefined,
                  color: colorMode === c.value ? c.color : undefined,
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
