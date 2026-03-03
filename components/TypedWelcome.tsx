'use client';

import { useEffect, useRef } from 'react';

export default function TypedWelcome() {
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let typed: import('typed.js').default | null = null;

    import('typed.js').then(({ default: Typed }) => {
      if (!elRef.current) return;
      typed = new Typed(elRef.current, {
        strings: [
          'Personalized supplement formulas.',
          'Evidence-backed recommendations.',
          'Built for practitioners.',
        ],
        typeSpeed: 42,
        backSpeed: 22,
        backDelay: 2200,
        loop: true,
        showCursor: true,
        cursorChar: '|',
      });
    });

    return () => {
      typed?.destroy();
    };
  }, []);

  return (
    <p
      className="text-brand-peach/60 text-[9px] tracking-[0.3em] uppercase font-bold mb-5 select-none h-4"
      aria-hidden
    >
      <span ref={elRef} />
    </p>
  );
}
