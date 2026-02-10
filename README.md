## Trello Clone – Next.js 14, Zustand, DnD, SCSS

This is a small Trello-like board built with **Next.js 14 (App Router)** and **TypeScript**, using:

- **Zustand** for global board state + localStorage persistence
- **@dnd-kit** for drag & drop of lists and cards
- **SCSS** for a simple but polished UI
- **Jest + React Testing Library** for tests

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm start` – run built app
- `npm test` – Jest test suite
- `npm run lint` – ESLint / Biome linting

## Architecture & Data Model

The app uses the App Router (`app/` directory) with a single board page:

- `app/layout.tsx` – HTML shell, global SCSS import
- `app/page.tsx` – renders `BoardPage`
- `components/board/*` – board, list, card, modal, DnD wrappers

Board state is normalized and managed in Zustand:

- `Board`: `{ id, title, listOrder: string[] }`
- `List`: `{ id, title, cardIds: string[] }`
- `Card`: `{ id, title, description?, commentIds: string[] }`
- `Comment`: `{ id, cardId, text, createdAt }`

Everything is stored in `store/boardStore.ts` and persisted to `localStorage` via helpers in `lib/storage/localStorage.ts` with guards so it’s safe on the server.

## Drag & Drop

`@dnd-kit/core` and `@dnd-kit/sortable` provide:

- Horizontal list reordering
- Vertical and cross-list card moves

Pure drag-end logic lives in `lib/board/dnd.ts` and is unit-tested in `__tests__/dndHandlers.test.ts`.

## Styles

Global SCSS entry: `app/globals.scss`, which wires:

- `styles/_variables.scss` – color/spacing tokens
- `styles/_mixins.scss` – layout helpers, scrollbar styling
- `styles/board.scss`, `styles/list.scss`, `styles/card.scss`, `styles/modal.scss`

The layout is responsive with horizontal scrolling for lists on smaller viewports.

## Tests

Key tests live under `__tests__/`:

- Store and persistence: `boardStore.test.ts`, `localStorage.test.ts`
- Pure utils: `ordering.test.ts`, `dndHandlers.test.ts`
- UI wiring: `BoardPage.test.tsx`

Run them with:

```bash
npm test
```
