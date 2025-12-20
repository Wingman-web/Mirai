'use client';

import { useEffect } from 'react';

export default function LoadingOverlay() {
  useEffect(() => {
    const overlay = document.getElementById('initial-loading-overlay');
    if (!overlay) return;

    const hide = () => {
      overlay.classList.add('opacity-0');
      // allow transition to finish before removing
      setTimeout(() => {
        overlay.remove();
      }, 500);
    };

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide);
      // safety: hide after 10s in case load never fires
      const timeout = setTimeout(hide, 10000);
      return () => {
        window.removeEventListener('load', hide);
        clearTimeout(timeout);
      };
    }
  }, []);

  return null;
}
