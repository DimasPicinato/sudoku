import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Difficulty } from '@/@types/difficulty';

type UseScoreStore = {
  pastTimes: { time: number; difficulty: Difficulty }[];
  addTime: (time: { time: number; difficulty: Difficulty }) => void;
};

export const useScoreStore = create<UseScoreStore>()(
  persist(
    (set, get): UseScoreStore => ({
      pastTimes: [],
      addTime: (time: { time: number; difficulty: Difficulty }) => set({ pastTimes: [...get().pastTimes, time] }),
    }),
    { name: 'score' },
  ),
);
