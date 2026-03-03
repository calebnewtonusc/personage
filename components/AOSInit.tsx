'use client';

import { useEffect } from 'react';

export default function AOSInit() {
  useEffect(() => {
    import('aos').then(({ default: AOS }) => {
      AOS.init({
        duration: 700,
        once: true,
        easing: 'ease-out-cubic',
        offset: 40,
      });
    });
  }, []);

  return null;
}
