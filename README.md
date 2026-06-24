# Ito

**Ito** is a mobile-first PWA inspired by the red thread of fate — tie private relationship threads and send a small **pulse** when someone crosses your mind.

Ito is **not** a chat app, social feed, or couples-only Telegram Mini App.

## Current state (M1)

Implemented:

- Supabase Auth (email/password + magic link)
- User profiles (`display_name`)
- Two-person threads with invite codes
- Pulse send (default, category, custom ≤140 chars)
- Inbox of received pulses
- Row Level Security on all tables

Not implemented yet:

- Web Push, photo moments, reactions, reminders
- AI message generation (Gemini)
- Message bank admin, notification settings
- Group threads UI (schema supports future expansion)

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase (Auth, Postgres, RLS) via `@supabase/ssr` cookie sessions
- PWA manifest (`public/manifest.json`) — no service worker yet

## Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Anon/publishable key (client + server) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Magic link redirect base (e.g. `http://localhost:3000`) |

No service role key is used. All data access goes through authenticated RLS policies.

## Database setup

Apply the M1 migration in Supabase SQL editor or CLI:

```
supabase/migrations/20250624100000_ito_m1_schema.sql
```

Legacy prototype schema is archived in `supabase/migrations/legacy/` — do not apply to new Ito databases.

In Supabase Auth settings:

- Enable Email provider
- Add `http://localhost:3000/auth/callback` to redirect URLs (and production URL when deployed)
- If email confirmation is enabled, users must confirm before login

## Quick start

```bash
npm install
cp .env.example .env.local
# Fill in Supabase values and apply migration
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

## Routes

| Route | Purpose |
|-------|---------|
| `/auth` | Sign up, log in, magic link |
| `/onboarding` | Create profile (display name) |
| `/` | Home — tree, threads preview |
| `/threads` | Thread list |
| `/threads/new` | Tie a thread |
| `/invite/[code]` | Accept invite |
| `/thread/[id]` | Send pulse, share invite if pending |
| `/inbox` | Received pulses |
| `/settings` | Account + log out |

## Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [PROJECT_FILE_MAP.md](./PROJECT_FILE_MAP.md)
- [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)
- [TEST_CHECKLIST.md](./TEST_CHECKLIST.md)
- [HANDOFF.md](./HANDOFF.md)

## Legacy

Telegram prototype preserved on branch `backup/pre-ito-telegram-prototype`.
