import { useEffect, useMemo, useState } from 'react';
import Board from './Board';
import WordList from './WordList';
import { generate, type Placement } from '../lib/generator';
import type { GameConfig } from '../lib/share';
import './Player.css';

const keyOf = (p: Placement) => `${p.row}-${p.col}-${p.base}`;

interface Props {
  config: GameConfig;
  storageKey?: string; // sem chave = sem persistência (ex.: preview do editor)
  compact?: boolean;   // sem altura mínima de tela cheia
}

export default function Game({ config, storageKey, compact }: Props) {
  const puzzle = useMemo(
    () =>
      generate({
        words: config.words,
        seed: config.seed,
        size: config.size,
        directions: config.directions,
      }),
    [config],
  );

  const [foundKeys, setFoundKeys] = useState<string[]>(() => {
    if (!storageKey) return [];
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(foundKeys));
    } catch {
      /* sem persistência: segue funcionando */
    }
  }, [storageKey, foundKeys]);

  // Mantém a ordem em que foram achadas (define a cor do destaque)
  const found = foundKeys
    .map((k) => puzzle.placements.find((p) => keyOf(p) === k))
    .filter((p): p is Placement => Boolean(p));

  const total = puzzle.placements.length;
  const done = total > 0 && found.length === total;
  const foundSet = new Set(found.map(keyOf));

  return (
    <div className={compact ? 'player compact' : 'player'}>
      <h1>{config.title}</h1>

      <Board
        puzzle={puzzle}
        found={found}
        onFound={(p) => setFoundKeys((ks) => (ks.includes(keyOf(p)) ? ks : [...ks, keyOf(p)]))}
      />

      <WordList
        items={puzzle.placements.map((p) => ({ label: p.display, found: foundSet.has(keyOf(p)) }))}
      />

      {done && (
        <div className="player-done">
          <strong>Parabéns! Você encontrou todas as palavras.</strong>
          <button onClick={() => setFoundKeys([])}>Jogar de novo</button>
        </div>
      )}
    </div>
  );
}
