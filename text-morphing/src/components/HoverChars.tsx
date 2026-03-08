"use client";

interface HoverCharsProps {
  text: string;
  className?: string;
}

export default function HoverChars({ text, className = "" }: HoverCharsProps) {
  return (
    <span className={`hover-word ${className}`}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="scramble-char inline-block cursor-default"
          style={{
            transitionDelay: `${i * 15}ms`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
