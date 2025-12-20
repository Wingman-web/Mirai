'use client';

import { useEffect } from 'react';

export default function LoadingOverlay() {
  useEffect(() => {
    const el = document.getElementById('initial-loading-overlay');
    if (!el) return;

    // Fade out the server-rendered overlay after hydration; keep the loader visible briefly
    el.style.transition = 'opacity 500ms ease, visibility 500ms ease';
    el.style.opacity = '0';
    el.style.visibility = 'hidden';

    // Remove element from DOM after animation
    const t = setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 600);

    return () => clearTimeout(t);
  }, []);

  return (
    // Keep this client component so we can extend loader behavior later if needed
    null
  );
}
