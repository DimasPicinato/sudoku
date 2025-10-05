import type { Cell } from '@/@types/cell';
import type { Difficulty } from '@/@types/difficulty';

export function generateSudoku(difficulty: Difficulty): Cell[][] {
  const size = 9;
  const board: number[][] = Array.from({ length: size }, () => Array(size).fill(0));

  // Função auxiliar para verificar se um número pode ser colocado na célula
  function isValid(board: number[][], row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  }

  // Função recursiva para preencher o tabuleiro com solução válida
  function fillBoard(board: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of numbers) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (fillBoard(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  // Embaralha um array (Fisher–Yates)
  function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Gera o tabuleiro completo
  fillBoard(board);

  // Define quantas células remover com base na dificuldade
  const removeCounts = {
    easy: 35,
    medium: 45,
    hard: 55,
  };
  let toRemove = removeCounts[difficulty];

  const cells: Cell[][] = board.map(row =>
    row.map(value => ({
      fixed: true,
      correctValue: value,
      currentValue: value,
    })),
  );

  // Remove números aleatoriamente
  while (toRemove > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    const cell = cells[row][col];
    if (cell.fixed) {
      cell.fixed = false;
      delete cell.currentValue;
      toRemove--;
    }
  }

  return cells;
}
