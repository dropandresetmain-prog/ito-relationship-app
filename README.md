# Ito

**Ito** is a mobile-first PWA inspired by the red thread of fate — a quiet way to tie private relationship threads and send a small **pulse** when someone crosses your mind.

Ito is **not** a chat app, social feed, or Telegram Mini App.

## Current state

This repo is a **clean frontend shell only**:

- Placeholder routes and UI with mock data
- No backend API routes
- No Supabase Auth or database (target schema not implemented)
- No Web Push, AI message generation, or photo moments yet

The previous Telegram couples prototype was removed from `main`. It is preserved on branch `backup/pre-ito-telegram-prototype`.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- PWA-oriented layout (`public/manifest.json`)
- Planned: Supabase, Web Push, Gemini (later milestones)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm start` | Run production server |

## Routes (shell)

| Route | Purpose |
|-------|---------|
| `/` | Home — tree identity, threads preview |
| `/onboarding` | Product introduction |
| `/threads` | Thread list |
| `/threads/new` | Tie a thread (mock) |
| `/invite/[code]` | Accept invite (mock) |
| `/thread/[id]` | Send a pulse (mock) |
| `/inbox` | Notification inbox (mock) |
| `/settings` | Settings placeholder |

## Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — metaphors, constraints, planned direction
- [PROJECT_FILE_MAP.md](./PROJECT_FILE_MAP.md) — file layout
- [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) — limitations
- [TEST_CHECKLIST.md](./TEST_CHECKLIST.md) — manual QA
- [HANDOFF.md](./HANDOFF.md) — next milestone handoff

## Legacy database

`supabase/migrations/legacy/` holds the old prototype schema (`couples`, `touches`). **Not** the Ito target schema.
