'use client';

import { useEffect, useRef } from 'react';

export default function GranimBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let granimInstance: { destroy: () => void } | null = null;

    import('granim').then(({ default: Granim }) => {
      if (!canvasRef.current) return;
      granimInstance = new Granim({
        element: canvasRef.current,
        direction: 'diagonal',
        isPausedWhenNotInView: true,
        states: {
          'default-state': {
            gradients: [
              ['#144b50', '#0d3437'],
              ['#1a5c62', '#144b50'],
              ['#0d3437', '#1a5c62'],
            ],
            transitionSpeed: 4000,
          },
        },
      });
    });

    return () => {
      granimInstance?.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
