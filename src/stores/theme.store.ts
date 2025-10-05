import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ThemeMode } from '@/@types/theme-mode';

type UseThemeStore = {
  themeMode: ThemeMode;
  setThemeMode: (themeMode: ThemeMode) => void;
};

export const useThemeStore = create<UseThemeStore>()(
  persist(
    (set): UseThemeStore => ({
      themeMode: 'system',
      setThemeMode: themeMode => set({ themeMode }),
    }),
    { name: 'theme' },
  ),
);
