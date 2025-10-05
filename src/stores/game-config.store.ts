import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UseGameConfigStore = {
  hoverMode: boolean;
  setHoverMode: (hoverMode: boolean) => void;
};

export const useGameConfigStore = create<UseGameConfigStore>()(
  persist(
    (set): UseGameConfigStore => ({
      hoverMode: false,
      setHoverMode: hoverMode => set({ hoverMode }),
    }),
    { name: 'theme' },
  ),
);
