import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Cell } from '@/@types/cell';
import type { Difficulty } from '@/@types/difficulty';

type UseGameStore = {
  startGame: (board: Cell[][], difficulty: Difficulty) => void;
  saveBoard: (board: Cell[][]) => void;
  clearGame: () => void;
} & (
  | {
      startedTime: null;
      board: null;
      difficulty: null;
    }
  | {
      startedTime: number;
      board: Cell[][];
      difficulty: Difficulty;
    }
);

export const useGameStore = create<UseGameStore>()(
  persist(
    (set): UseGameStore => ({
      startGame: (board, difficulty) => set({ startedTime: new Date().getTime(), board, difficulty }),
      saveBoard: board => set({ board }),
      clearGame: () => set({ startedTime: null, board: null, difficulty: null }),

      startedTime: null,
      board: null,
      difficulty: null,
    }),
    { name: 'game' },
  ),
);
