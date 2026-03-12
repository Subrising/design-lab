"use client";

import { Canvas } from "@react-three/fiber";
import { Snake } from "./Snake";
import { Environment } from "./Environment";
import { Particles } from "./Particles";
import { UI } from "./UI";
import { useState, useCallback, useRef } from "react";

export default function SnakeGame() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const scoreRef = useRef(0);
  const snakeRef = useRef<{ reset: () => void }>(null);

  const onScore = useCallback((pts: number) => {
    scoreRef.current += pts;
    setScore(scoreRef.current);
  }, []);

  const onGameOver = useCallback(() => {
    setGameOver(true);
  }, []);

  const handleStart = useCallback(() => {
    setStarted(true);
    setGameOver(false);
    setScore(0);
    scoreRef.current = 0;
    snakeRef.current?.reset();
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      <Canvas
        camera={{ fov: 60, near: 0.1, far: 500, position: [0, 8, -15] }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#050510"]} />
        <fog attach="fog" args={["#050510", 30, 120]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 20, 10]} intensity={1.2} color="#8866ff" />
        <directionalLight position={[-10, 10, -10]} intensity={0.5} color="#ff6644" />
        <pointLight position={[0, 5, 0]} intensity={2} color="#44ffaa" distance={30} />

        <Snake
          ref={snakeRef}
          started={started}
          gameOver={gameOver}
          onScore={onScore}
          onGameOver={onGameOver}
        />
        <Environment />
        <Particles />
      </Canvas>
      <UI
        score={score}
        gameOver={gameOver}
        started={started}
        onStart={handleStart}
      />
    </div>
  );
}
