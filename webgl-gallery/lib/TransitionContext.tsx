'use client';

/**
 * TransitionContext — Barba.js-inspired cross-route transition state.
 *
 * Barba.js is incompatible with Next.js App Router because Barba fetches
 * raw HTML and swaps [data-barba="container"] elements, but Next.js RSC
 * responses are streaming JSON + React payloads, not parseable HTML.
 *
 * This context replicates Barba's transition hook contract:
 *   beforeLeave → capture element state (DOMRect) before navigation
 *   afterLeave  → router.push() causes unmount
 *   beforeEnter → new page mounts, state is retrieved from ref
 *   afterEnter  → Flip animation runs, clearTransition() called
 *
 * Using a ref (not state) means we never re-render the provider on
 * navigation, which avoids tearing with the Three.js canvas.
 */

import {
  createContext,
  useContext,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';

export interface TransitionState {
  slug: string;
  fromRect: { top: number; left: number; width: number; height: number };
  imageUrl: string;
}

interface TransitionContextValue {
  transitionRef: React.MutableRefObject<TransitionState | null>;
  setTransition: (state: TransitionState) => void;
  clearTransition: () => void;
}

const Ctx = createContext<TransitionContextValue | null>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const transitionRef = useRef<TransitionState | null>(null);

  const setTransition = useCallback((state: TransitionState) => {
    transitionRef.current = state;
  }, []);

  const clearTransition = useCallback(() => {
    transitionRef.current = null;
  }, []);

  return (
    <Ctx.Provider value={{ transitionRef, setTransition, clearTransition }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTransitionCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTransitionCtx must be inside TransitionProvider');
  return ctx;
}
