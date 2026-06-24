# Architecture — Ito

## Product metaphors

| Concept | Meaning |
|---------|---------|
| **Tree** | Self / rooted identity |
| **Thread** | Private relationship connection |
| **Pulse** | Tap-based act of love or attention |
| **Moment** | Ephemeral photo update (not built) |
| **Reaction** | Lightweight response to a pulse or moment |

## What Ito is not

- Chat or messaging threads
- Social feed, comments, likes, followers
- Streaks or guilt-based reminders
- Telegram-only or couples-only
- Public discovery or family groups

## Current implementation (v0 shell)

```
Browser (PWA-oriented Next.js app)
  → static/placeholder pages
  → mock data in lib/mock/data.ts
  → no server API routes
  → no database
```

All user-visible data is **mock**. Buttons that imply sending or accepting show mock feedback only.

## Planned direction (not implemented)

```
Browser
  → Supabase Auth (session)
  → API routes / RLS-scoped Supabase client
  → Postgres: users, threads, pulses, inbox, moments, reactions
  → Web Push for delivery (later)
  → Gemini for optional message suggestions (later)
```

## Relationship modes (planned)

Clare-specific, Romantic, Mother–Son, Family, Friends, General.

## Copy principles

Use gentle, invitational language:

- “Send a pulse”, “Tie a thread”, “A small pulse can mean a lot.”
- “Send Mum a little warmth?”, “Clare crossed your mind?”

Avoid guilt framing (“You haven’t messaged…”, “Don’t forget her”).

## Removed prototype

The Telegram Mini App (`initData` auth, `/api/couples/*`, `/api/touches/send`, Bot API notifications) was deleted from `main`. See branch `backup/pre-ito-telegram-prototype` and `supabase/migrations/legacy/`.

## Target schema (future)

Not designed in this repo yet. Do not build on the legacy `couples` / `touches` tables.
