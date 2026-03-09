"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type CursorVariant = "default" | "text" | "project" | "link" | "nav";

interface CursorContextType {
  cursorVariant: CursorVariant;
  cursorText: string;
  setCursorVariant: (variant: CursorVariant) => void;
  setCursorText: (text: string) => void;
  onEnter: (variant: CursorVariant, text?: string) => void;
  onLeave: () => void;
}

const CursorContext = createContext<CursorContextType>({
  cursorVariant: "default",
  cursorText: "",
  setCursorVariant: () => {},
  setCursorText: () => {},
  onEnter: () => {},
  onLeave: () => {},
});

export function CursorProvider({ children }: { children: ReactNode }) {
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>("default");
  const [cursorText, setCursorText] = useState("");

  const onEnter = useCallback((variant: CursorVariant, text = "") => {
    setCursorVariant(variant);
    setCursorText(text);
  }, []);

  const onLeave = useCallback(() => {
    setCursorVariant("default");
    setCursorText("");
  }, []);

  return (
    <CursorContext.Provider
      value={{ cursorVariant, cursorText, setCursorVariant, setCursorText, onEnter, onLeave }}
    >
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  return useContext(CursorContext);
}
