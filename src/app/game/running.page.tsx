import { Grid3x3, RefreshCw, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useGameConfigStore } from '@/stores/game-config.store';
import { useGameStore } from '@/stores/game.store';
import { useScoreStore } from '@/stores/score.store';
import { toast } from 'sonner';

import type { Cell } from '@/@types/cell';
import type { Difficulty } from '@/@types/difficulty';

import { cn } from '@/lib/utils';

import { generateSudoku } from '@/utils/generate-sudoku';
import { getElapsedTime } from '@/utils/get-elapsed-time';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function RunningPage() {
  const [select, setSelect] = useState<number | null>(null);
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const { difficulty } = useParams();
  const { startGame, startedTime, clearGame, board, saveBoard, difficulty: storedDifficulty } = useGameStore();
  const [currentBoard, setCurrentBoard] = useState<Cell[][]>(board ?? generateSudoku(difficulty as Difficulty));
  const [time, setTime] = useState<Date>(new Date(startedTime ? getElapsedTime(startedTime) : 0));
  const { addTime } = useScoreStore();
  const navigate = useNavigate();
  const { hoverMode, setHoverMode } = useGameConfigStore();

  useEffect(() => {
    if (storedDifficulty !== difficulty) navigate(`/${storedDifficulty}`, { replace: true });
  }, [storedDifficulty, difficulty]);

  // Recupera o estado da partida armazenada no Store ou inicia a partida
  useEffect(() => {
    if (!board) {
      const newBoard = generateSudoku(difficulty as Difficulty);
      setCurrentBoard(newBoard);
      startGame(newBoard, difficulty as Difficulty);
    }
  }, [difficulty, board]);

  // Armazena o estado da partida no Store
  useEffect(() => saveBoard(currentBoard), [currentBoard]);

  // Atualiza o timer da partida
  useEffect(() => {
    if (!startedTime) return;
    const timer = setInterval(() => setTime(getElapsedTime(startedTime)), 1000);
    return () => clearInterval(timer);
  }, [startedTime, currentBoard]);

  // Calcula os números que estão inválidos
  const { invalidNumbers, invalidCells } = useMemo(() => {
    const invalidNumbers = new Set<number>();
    const invalidCells = new Set<`${number}-${number}`>();

    const isDuplicate = (values: (number | undefined)[]) => {
      const seen = new Set<number>();
      const duplicates = new Set<number>();
      for (const v of values) {
        if (!v) continue;
        if (seen.has(v)) duplicates.add(v);
        seen.add(v);
      }
      return duplicates;
    };

    // Verifica duplicatas em linhas
    for (let r = 0; r < 9; r++) {
      const rowValues = currentBoard[r].map(c => c.currentValue);
      const duplicates = isDuplicate(rowValues);
      if (duplicates.size > 0) {
        duplicates.forEach(v => invalidNumbers.add(v));
        currentBoard[r].forEach((c, cIndex) => {
          if (c.currentValue && duplicates.has(c.currentValue)) invalidCells.add(`${r}-${cIndex}`);
        });
      }
    }

    // Verifica duplicatas em colunas
    for (let c = 0; c < 9; c++) {
      const colValues = currentBoard.map(row => row[c].currentValue);
      const duplicates = isDuplicate(colValues);
      if (duplicates.size > 0) {
        duplicates.forEach(v => invalidNumbers.add(v));
        currentBoard.forEach((row, rIndex) => {
          if (row[c].currentValue && duplicates.has(row[c].currentValue as number)) invalidCells.add(`${rIndex}-${c}`);
        });
      }
    }

    // Verifica duplicatas em blocos 3x3
    for (let br = 0; br < 3; br++) {
      for (let bc = 0; bc < 3; bc++) {
        const cells: { value: number | undefined; r: number; c: number }[] = [];
        for (let r = br * 3; r < br * 3 + 3; r++) {
          for (let c = bc * 3; c < bc * 3 + 3; c++) {
            cells.push({ value: currentBoard[r][c].currentValue, r, c });
          }
        }
        const duplicates = isDuplicate(cells.map(c => c.value));
        if (duplicates.size > 0) {
          duplicates.forEach(v => invalidNumbers.add(v));
          cells.forEach(({ value, r, c }) => {
            if (value && duplicates.has(value)) invalidCells.add(`${r}-${c}`);
          });
        }
      }
    }

    return { invalidNumbers, invalidCells };
  }, [currentBoard]);

  // Calcula os números que já foram concluídos
  const completedNumbers = useMemo(() => {
    const counts = Array(10).fill(0);
    for (const row of currentBoard) for (const cell of row) if (cell.currentValue) counts[cell.currentValue]++;

    const set = new Set<number>();
    for (let n = 1; n <= 9; n++) if (!invalidNumbers.has(n)) if (counts[n] === 9) set.add(n);

    return set;
  }, [currentBoard]);

  // Encerra o jogo caso completar o Sudoku
  useEffect(() => {
    if (completedNumbers.size === 9) {
      addTime({ time: time.getTime(), difficulty: difficulty as Difficulty });
      toast.success(
        `Você completou em ${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}.`,
      );
      navigate('/');
    }
  }, [completedNumbers]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
      <table
        className="w-fit border-collapse"
        onMouseLeave={() => {
          setHoverCol(null);
          setHoverRow(null);
        }}
      >
        <tbody>
          {currentBoard.map((v, r) => (
            <tr key={r}>
              {v.map((_, c) => (
                <td
                  key={c}
                  className="size-fit"
                >
                  <div
                    className={cn(
                      'border-foreground/40 border',
                      (r + 1) % 3 == 0 && 'border-b-4',
                      (c + 1) % 3 == 0 && 'border-r-4',
                      r == 0 && 'border-t-4',
                      c == 0 && 'border-l-4',
                      r == 0 && c == 0 && 'rounded-tl-sm',
                      r == 0 && c == 8 && 'rounded-tr-sm',
                      r == 8 && c == 0 && 'rounded-bl-sm',
                      r == 8 && c == 8 && 'rounded-br-sm',
                    )}
                  >
                    <button
                      className={cn(
                        'text-foreground flex size-[min(calc((100dvh-15rem)/9),calc(100dvw/180*16))] items-center justify-center text-[min(calc((55dvh-12rem)/9),calc(55vw/170*16))]',
                        (!select || currentBoard[r][c].fixed) && 'cursor-default',
                        currentBoard[r][c].fixed && 'font-black',
                        hoverMode &&
                          hoverRow === r &&
                          cn('bg-foreground/10', select === currentBoard[r][c].currentValue && 'bg-orange-600/20!'),
                        hoverMode &&
                          hoverCol === c &&
                          cn('bg-foreground/10', select === currentBoard[r][c].currentValue && 'bg-orange-600/20!'),
                        hoverMode &&
                          hoverRow !== null &&
                          hoverCol !== null &&
                          Math.floor(r / 3) === Math.floor(hoverRow / 3) &&
                          Math.floor(c / 3) === Math.floor(hoverCol / 3) &&
                          cn('bg-foreground/10', select === currentBoard[r][c].currentValue && 'bg-orange-600/20!'),
                        hoverRow === r && hoverCol === c && 'bg-foreground/20',
                        select === currentBoard[r][c].currentValue &&
                          cn(
                            'bg-foreground/30',
                            invalidCells.has(`${r}-${c}`) && 'bg-red-600',
                            completedNumbers.has(select) && 'bg-green-600',
                          ),
                      )}
                      onMouseEnter={() => {
                        setHoverRow(r);
                        setHoverCol(c);
                      }}
                      onClick={() => {
                        if (select && !currentBoard[r][c].fixed) {
                          setCurrentBoard(prev => {
                            const newBoard = prev.map(row => row.slice());
                            if (select !== newBoard[r][c]?.currentValue)
                              newBoard[r][c] = {
                                fixed: newBoard[r][c].fixed,
                                correctValue: newBoard[r][c].correctValue,
                                currentValue: select,
                              };
                            else
                              newBoard[r][c] = {
                                fixed: newBoard[r][c].fixed,
                                correctValue: newBoard[r][c].correctValue,
                              };
                            return newBoard;
                          });
                        }
                      }}
                    >
                      {currentBoard[r][c]?.currentValue}
                    </button>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ButtonGroup>
        {Array.from({ length: 9 })
          .map((_, i) => i + 1)
          .map(v => (
            <Button
              key={v}
              onClick={() => {
                if (select === v) setSelect(null);
                else setSelect(v);
              }}
              variant={select === v ? 'default' : 'outline'}
              className={cn(completedNumbers.has(v) && !completedNumbers.has(v - 1) && 'border!')}
              style={
                invalidNumbers.has(v)
                  ? ({ '--primary': 'var(--color-red-600)', '--input': 'var(--color-red-600)' } as React.CSSProperties)
                  : completedNumbers.has(v)
                    ? ({
                        '--primary': 'var(--color-green-600)',
                        '--input': 'var(--color-green-600)',
                      } as React.CSSProperties)
                    : {}
              }
              size="icon"
            >
              {v}
            </Button>
          ))}
      </ButtonGroup>
      {startedTime ? (
        <div className="flex items-center gap-4">
          <h4>
            {time.getMinutes().toString().padStart(2, '0')}:{time.getSeconds().toString().padStart(2, '0')}
          </h4>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant={hoverMode ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setHoverMode(!hoverMode)}
                >
                  <Grid3x3 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{hoverMode ? 'Desativar realce' : 'Ativar realce'}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    clearGame();
                    setTime(new Date(0));
                  }}
                >
                  <RefreshCw />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Resetar</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate('/')}
                >
                  <X />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sair</TooltipContent>
            </Tooltip>
          </div>
        </div>
      ) : null}
    </div>
  );
}
