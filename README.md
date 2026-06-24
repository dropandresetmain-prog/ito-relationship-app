# Ito

**Ito** is a mobile-first PWA inspired by the red thread of fate — tie private relationship threads and send a small **pulse** when someone crosses your mind.

Ito is **not** a chat app, social feed, or couples-only Telegram Mini App.

## Current state (M1 + M1.5 on `main`)

**Latest commit:** `542e3f2` on `main`, deployed via Vercel.

### M1 — Backend & core flows

- Supabase Auth (email/password primary, magic link secondary)
- User profiles (`display_name`)
- Two-person threads with invite codes
- Pulse send (default, category, custom ≤140 chars)
- Inbox of received pulses
- Row Level Security on all tables

### M1.5 — Scene UI & journey polish

- **Thread Garden** home scene (`/`)
- **Living Tree** relationship detail scene (`/thread/[id]`)
- Scene-styled inbox (`/inbox`)
- Ito auth UX (verification email success state, magic link feedback)
- **ItoPaperShell** utility pages (onboarding, threads, invite, settings)
- Scene assets in `public/scenes/`
- Thread/charm visual layer with anchored red threads
- Quiet Window archived (assets + config only — not routed)

### Not implemented yet

- Web Push, photo moments, reactions, reminders
- AI message generation (Gemini)
- Message bank / non-repeating category pulses (M2)
- Group threads UI (schema supports future expansion)

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (Auth, Postgres, RLS) via `@supabase/ssr` cookie sessions
- **Vercel** — production and preview deployments from GitHub
- **PWA manifest** (`public/manifest.json`) — no service worker yet

## Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Anon/publishable key (client + server) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Magic link redirect base (local: `http://localhost:3000`; production: Vercel URL) |

No service role key is used. All data access goes through authenticated RLS policies.

## Database setup

Apply the M1 migration in Supabase SQL editor or CLI:

```
supabase/migrations/20250624100000_ito_m1_schema.sql
```

**Note:** The migration defines `is_thread_member()` after `thread_members` exists so fresh `supabase db push` succeeds. Legacy prototype schema is archived in `supabase/migrations/legacy/` — do not apply to new Ito databases.

### Supabase Auth settings

- Enable Email provider
- **Redirect URLs** (required):
  - `http://localhost:3000/**`
  - `http://localhost:3000/auth/callback`
  - `https://<your-vercel-domain>/**`
  - `https://<your-vercel-domain>/auth/callback`
  - Preview: `https://*.vercel.app/**` if using branch previews
- Email/password is primary; magic link is secondary
- If email confirmation is enabled, signup shows “Check your email” — users must verify before login

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
| `/auth` | Sign in, create account, magic link (Ito scenic auth card) |
| `/onboarding` | Create profile (display name) |
| `/` | **Thread Garden** — home scene, thread charms, tie-a-thread CTA |
| `/threads` | Thread list (utility shell) |
| `/threads/new` | Tie a thread |
| `/invite/[code]` | Accept invite |
| `/thread/[id]` | **Living Tree** — relationship detail, pulse composer sheet |
| `/inbox` | Received pulses (scene-styled) |
| `/settings` | Account + log out |

## Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [PROJECT_FILE_MAP.md](./PROJECT_FILE_MAP.md)
- [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)
- [TEST_CHECKLIST.md](./TEST_CHECKLIST.md)
- [HANDOFF.md](./HANDOFF.md)
- [docs/design/THREAD_GARDEN_HANDOFF.md](./docs/design/THREAD_GARDEN_HANDOFF.md)
- [docs/design/ARCHIVED_SCENES.md](./docs/design/ARCHIVED_SCENES.md)

## Local-only (not in repo)

- `/v0-design-reference/` — v0 design export; gitignored. Do not commit.

## Legacy

Telegram prototype preserved on branch `backup/pre-ito-telegram-prototype`.
