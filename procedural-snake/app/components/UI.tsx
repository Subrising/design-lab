"use client";

interface UIProps {
  score: number;
  gameOver: boolean;
  started: boolean;
  onStart: () => void;
}

export function UI({ score, gameOver, started, onStart }: UIProps) {
  return (
    <>
      {/* Score */}
      {started && !gameOver && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white font-mono">
          <div className="text-sm tracking-[0.3em] uppercase text-white/50">
            Score
          </div>
          <div className="text-4xl font-bold tracking-wider text-center">
            {score}
          </div>
        </div>
      )}

      {/* Controls hint */}
      {started && !gameOver && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-xs font-mono tracking-wider">
          WASD / Arrow Keys / Mouse to steer
        </div>
      )}

      {/* Start / Game Over screen */}
      {(!started || gameOver) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-2 tracking-tight">
              <span className="text-emerald-400">Procedural</span>{" "}
              <span className="text-amber-400">Snake</span>
            </h1>
            <p className="text-white/50 text-sm font-mono mb-8 tracking-wider">
              Endless WebGL Snake with GLSL Skin Shaders
            </p>

            {gameOver && (
              <div className="mb-8">
                <div className="text-white/40 text-sm tracking-[0.3em] uppercase">
                  Final Score
                </div>
                <div className="text-5xl font-bold text-white">
                  {score}
                </div>
              </div>
            )}

            <button
              onClick={onStart}
              className="px-8 py-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-lg
                font-mono tracking-wider uppercase text-sm
                hover:bg-emerald-500/30 hover:border-emerald-400 transition-all duration-300
                cursor-pointer"
            >
              {gameOver ? "Play Again" : "Start Game"}
            </button>

            <div className="mt-8 text-white/30 text-xs font-mono space-y-1">
              <p>WASD or Arrow Keys to steer</p>
              <p>Move mouse to guide the snake</p>
              <p>Collect orbs to grow longer</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
