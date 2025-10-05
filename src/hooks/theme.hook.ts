import { useEffect } from 'react';

import { useThemeStore } from '@/stores/theme.store';

export function useTheme() {
  const { themeMode, setThemeMode } = useThemeStore();

  useEffect(() => {
    const el = document.querySelector('html');
    if (!el) return;

    const applySystemTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      el.style.colorScheme = isDark ? 'dark' : 'light';
      el.classList.toggle('dark', isDark);
      el.classList.toggle('light', !isDark);
    };

    if (themeMode === 'system') {
      applySystemTheme();
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applySystemTheme);
      return () => mediaQuery.removeEventListener('change', () => applySystemTheme());
    }

    el.style.colorScheme = themeMode;
    el.classList.toggle('dark', themeMode === 'dark');
    el.classList.toggle('light', themeMode === 'light');
  }, [themeMode]);

  return { themeMode, setThemeMode };
}
