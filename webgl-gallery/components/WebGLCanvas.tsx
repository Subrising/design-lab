'use client';

import { useEffect, useRef } from 'react';
import WebGLManager from '@/lib/webgl/WebGLManager';

/**
 * Persistent fixed canvas that Three.js renders into.
 *
 * Sits in the root layout so it survives Next.js route changes.
 * pointer-events: none lets all DOM clicks pass through to page content.
 * z-index: 1 places it above the background but below interactive overlays.
 */
export default function WebGLCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      WebGLManager.instance.init(canvasRef.current);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
