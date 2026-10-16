import { useMemo } from 'react';
import Game from './Game';
import { decodeGame } from '../lib/share';
import './Player.css';

export default function Player() {
  const hash = window.location.hash.slice(1);
  const config = useMemo(() => decodeGame(hash), [hash]);

  if (!config) {
    return (
      <div className="player">
        <p className="player-error">Link do jogo inválido ou corrompido.</p>
      </div>
    );
  }

  return <Game config={config} storageKey={`cacapalavras:${hash}`} />;
}
