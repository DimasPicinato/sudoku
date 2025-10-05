import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useGameStore } from '@/stores/game.store';
import { useScoreStore } from '@/stores/score.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function StartPage() {
  const navigate = useNavigate();
  const { clearGame } = useGameStore();
  const { pastTimes } = useScoreStore();

  useEffect(clearGame, []);

  const schema = z.object({
    difficulty: z.enum(['easy', 'medium', 'hard'], 'Selecione o nível de dificuldade correto!'),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      difficulty: pastTimes[pastTimes.length - 1]?.difficulty ?? 'easy',
    },
  });

  type BestTimeType = { hard: Date | null; medium: Date | null; easy: Date | null };
  const bestTimes = useMemo((): BestTimeType => {
    const difficulties: BestTimeType = {
      hard: null,
      medium: null,
      easy: null,
    };

    for (const time of pastTimes) {
      switch (time.difficulty) {
        case 'hard':
          if (!difficulties.hard) difficulties.hard = new Date(time.time);
          else if (time.time <= difficulties.hard.getTime()) difficulties.hard = new Date(time.time);
          break;
        case 'medium':
          if (!difficulties.medium) difficulties.medium = new Date(time.time);
          else if (time.time <= difficulties.medium.getTime()) difficulties.medium = new Date(time.time);
          break;
        case 'easy':
          if (!difficulties.easy) difficulties.easy = new Date(time.time);
          else if (time.time <= difficulties.easy.getTime()) difficulties.easy = new Date(time.time);
          break;
      }
    }

    return difficulties;
  }, [pastTimes]);

  return (
    <div className="flex size-full flex-col items-center justify-center gap-8 p-8">
      <div className="flex w-full flex-col items-center gap-4">
        <h2>Novo Jogo</h2>
        <Form {...form}>
          <form
            className="flex w-full flex-col justify-between gap-4 sm:w-fit"
            onSubmit={form.handleSubmit(v => navigate(`/${v.difficulty}`))}
          >
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dificuldade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">Fácil</SelectItem>
                      <SelectItem value="medium">Médio</SelectItem>
                      <SelectItem value="hard">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Selecione o nível de dificuldade para o jogo.</FormDescription>
                </FormItem>
              )}
            />
            <Button className="w-full">Começar</Button>
          </form>
        </Form>
      </div>

      <hr />

      <div className="flex w-full flex-col items-center gap-4 sm:w-fit">
        <h2>Melhores Jogos</h2>
        {!pastTimes.length ? (
          'Nenhum jogo ainda!'
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dificuldade</TableHead>
                <TableHead>Tempo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bestTimes.hard ? (
                <TableRow>
                  <TableCell>Díficil</TableCell>
                  <TableCell>
                    {bestTimes.hard.getMinutes()}:{bestTimes.hard.getSeconds()}
                  </TableCell>
                </TableRow>
              ) : null}
              {bestTimes.medium ? (
                <TableRow>
                  <TableCell>Médio</TableCell>
                  <TableCell>
                    {bestTimes.medium.getMinutes()}:{bestTimes.medium.getSeconds()}
                  </TableCell>
                </TableRow>
              ) : null}
              {bestTimes.easy ? (
                <TableRow>
                  <TableCell>Fácil</TableCell>
                  <TableCell>
                    {bestTimes.easy.getMinutes()}:{bestTimes.easy.getSeconds()}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
