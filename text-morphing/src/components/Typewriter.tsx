"use client";

import { useEffect, useState, useRef } from "react";

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  className?: string;
}

export default function Typewriter({
  words,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseTime = 2000,
  className = "",
}: TypewriterProps) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const tick = () => {
      if (isDeleting) {
        setText(currentWord.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        setText(currentWord.substring(0, text.length + 1));
        if (text.length === currentWord.length) {
          timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseTime);
          return;
        }
      }
    };

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    timeoutRef.current = setTimeout(tick, speed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className={className}>
      {text}
      <span className="type-cursor" />
    </span>
  );
}
