"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

interface TextScrambleProps {
  phrases: string[];
  className?: string;
}

export default function TextScramble({ phrases, className = "" }: TextScrambleProps) {
  const [display, setDisplay] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);

  const scramble = useCallback((target: string, onComplete: () => void) => {
    const length = target.length;
    const duration = 30; // frames per character
    let frame = 0;

    const update = () => {
      const progress = frame / (length * 2);
      const revealed = Math.floor(progress * length);

      let result = "";
      for (let i = 0; i < length; i++) {
        if (i < revealed) {
          result += target[i];
        } else if (target[i] === " ") {
          result += " ";
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setDisplay(result);
      frame++;

      if (revealed >= length) {
        setDisplay(target);
        onComplete();
        return;
      }

      rafRef.current = requestAnimationFrame(update);
    };

    frameRef.current = 0;
    update();
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const nextPhrase = () => {
      scramble(phrases[phraseIndex], () => {
        timeout = setTimeout(() => {
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 3000);
      });
    };

    nextPhrase();

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timeout);
    };
  }, [phraseIndex, phrases, scramble]);

  return (
    <span className={className}>
      {display.split("").map((char, i) => (
        <span
          key={`${phraseIndex}-${i}`}
          className="inline-block"
          style={{
            color: char === display[i] && phrases[phraseIndex][i] === char
              ? "inherit"
              : "rgba(99, 102, 241, 0.6)",
            transition: "color 0.1s ease",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
