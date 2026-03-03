'use client';

import { useEffect, useRef } from 'react';

export default function TypedWelcomeChat() {
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let typed: import('typed.js').default | null = null;

    import('typed.js').then(({ default: Typed }) => {
      if (!elRef.current) return;
      typed = new Typed(elRef.current, {
        strings: [
          'AI Formula<br />Recommendation Engine',
          'Personalized Supplement<br />Protocols.',
          'Evidence-backed<br />Ingredient Guidance.',
        ],
        typeSpeed: 38,
        backSpeed: 20,
        backDelay: 2800,
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
    <h1
      className="font-serif italic font-light text-brand-teal leading-[1.15] mb-3"
      style={{ fontSize: 'clamp(24px, 4vw, 36px)', minHeight: '2.6em' }}
    >
      <span ref={elRef} />
    </h1>
  );
}
