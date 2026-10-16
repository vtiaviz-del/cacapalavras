import { useMemo, useState } from 'react';
import Game from './Game';
import { generate } from '../lib/generator';
import { encodeGame, type GameConfig } from '../lib/share';
import './Editor.css';

const EXAMPLE = 'afiar\ncamas\ngás\nlaca\nlagoa\nleis\nmau\npalma\nsalto\nsega\nsoma\nóleos';
const newSeed = () => Math.floor(Math.random() * 2 ** 31);
const SIZES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20];

export default function Editor() {
  const [title, setTitle] = useState('Caça-palavras');
  const [text, setText] = useState(EXAMPLE);
  const [size, setSize] = useState<number | 'auto'>('auto');
  const [directions, setDirections] = useState<'simple' | 'all'>('all');
  const [seed, setSeed] = useState(newSeed);
  const [copied, setCopied] = useState<'link' | 'iframe' | null>(null);

  const words = useMemo(
    () => text.split(/[\n,;]+/).map((w) => w.trim()).filter(Boolean),
    [text],
  );

  const config: GameConfig = useMemo(
    () => ({
      title: title.trim() || 'Caça-palavras',
      words,
      seed,
      size: size === 'auto' ? undefined : size,
      directions,
    }),
    [title, words, seed, size, directions],
  );

  const puzzle = useMemo(() => generate(config), [config]);
  const hash = useMemo(() => encodeGame(config), [config]);

  const url = `${window.location.origin}${window.location.pathname}#${hash}`;
  const iframe = `<iframe src="${url}" width="100%" height="760" style="border:0" loading="lazy" allowfullscreen></iframe>`;

  const ignored = words.length - puzzle.placements.length - puzzle.skipped.length;
  const hasGame = puzzle.placements.length > 0;

  const copy = async (kind: 'link' | 'iframe', value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      window.prompt('Copie manualmente:', value);
    }
  };

  return (
    <div className="editor">
      <h1>Gerador de caça-palavras</h1>

      <div className="editor-grid">
        <section className="editor-form">
          <label>
            Título
            <input value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} />
          </label>

          <label>
            Palavras (uma por linha, ou separadas por vírgula)
            <textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} />
          </label>

          <div className="editor-row">
            <label>
              Tamanho da grade
              <select
                value={size}
                onChange={(e) => setSize(e.target.value === 'auto' ? 'auto' : Number(e.target.value))}
              >
                <option value="auto">Automático</option>
                {SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s} × {s}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Direções
              <select value={directions} onChange={(e) => setDirections(e.target.value as 'simple' | 'all')}>
                <option value="all">Todas (8 direções)</option>
                <option value="simple">Só → e ↓ (mais fácil)</option>
              </select>
            </label>
          </div>

          <button type="button" onClick={() => setSeed(newSeed())}>
            🔀 Gerar de novo
          </button>

          {puzzle.skipped.length > 0 && (
            <p className="editor-warn">
              Não couberam na grade: {puzzle.skipped.join(', ')}. Aumente o tamanho ou use menos palavras.
            </p>
          )}
          {ignored > 0 && (
            <p className="editor-warn">
              {ignored} palavra(s) ignorada(s): precisam ter pelo menos 3 letras e não podem se repetir.
            </p>
          )}
          {words.length > 100 && <p className="editor-warn">Só as 100 primeiras palavras serão usadas no link.</p>}
        </section>

        <section className="editor-side">
          {hasGame ? (
            <>
              <Game key={hash} config={config} compact />

              <div className="editor-share">
                <h2>Compartilhar</h2>
                <label>
                  Link (cole no bloco Embed do GitBook)
                  <input readOnly value={url} onFocus={(e) => e.target.select()} />
                </label>
                <div className="editor-row">
                  <button type="button" onClick={() => copy('link', url)}>
                    {copied === 'link' ? 'Copiado!' : 'Copiar link'}
                  </button>
                  <button type="button" onClick={() => copy('iframe', iframe)}>
                    {copied === 'iframe' ? 'Copiado!' : 'Copiar iframe'}
                  </button>
                  <a href={url} target="_blank" rel="noreferrer">
                    Abrir jogo ↗
                  </a>
                </div>
                {url.length > 2000 && (
                  <p className="editor-warn">Link muito longo ({url.length} caracteres): alguns serviços podem cortá-lo.</p>
                )}
              </div>
            </>
          ) : (
            <p className="editor-warn">Digite pelo menos uma palavra com 3 letras ou mais.</p>
          )}
        </section>
      </div>
    </div>
  );
}
