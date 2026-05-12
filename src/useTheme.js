import { useState, useEffect } from 'react';

// ============================================================
// Shared theme hook
//
// One source of truth for "dark" vs "light", persisted to
// localStorage and reflected on document.body so the page
// background never flashes the wrong colour during route swap.
// Both the After Empire essay and the Convergence view consume
// this hook so the toggle in either is global.
// ============================================================

const STORAGE_KEY = 'avt-theme';

const BG = { dark: '#0e1118', light: '#f5f1e8' };
const TEXT = { dark: '#f1ead9', light: '#231d14' };

function readInitial() {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' ? 'light' : 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState(readInitial);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.backgroundColor = BG[theme];
    document.body.style.color = TEXT[theme];
    document.body.style.transition = 'background-color 180ms ease, color 180ms ease';
  }, [theme]);

  return [theme, setTheme];
}
