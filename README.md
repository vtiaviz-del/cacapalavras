# Gerador de caça-palavras

Gera caça-palavras a partir de uma lista de palavras. O jogo inteiro vai codificado no hash da URL
(sem backend), então o link pode ser colado no bloco **Embed** do GitBook.

## Rodar

    npm install
    npm run dev

## Publicar

    npm run build

Publique a pasta `dist/`:

- **Netlify:** arraste o `dist/` no painel (o `public/_headers` libera o iframe).
- **Vercel:** o `vercel.json` já libera o iframe.
- **GitHub Pages:** defina `base: '/nome-do-repo/'` no `vite.config.ts`.

## Estrutura

    src/lib/generator.ts   geração da grade (determinística por seed)
    src/lib/share.ts       codificação/decodificação do jogo na URL
    src/components/        Editor, Game, Player, Board, WordList
