# Known Issues

**Updated after M1.5 merge (`542e3f2`)**

## M1 limitations (still open)

- **Two-person threads only** — enforced in `accept_thread_invite()` and UI
- **No Web Push** — recipient must open app/inbox to see pulses
- **`opened_at` not updated** — inbox unread state never clears automatically when viewing
- **No reactions, moments, reminders, message bank, or AI (Gemini)**
- **No automated tests**
- **Email confirmation** — if enabled in Supabase, signup requires verify before session; UI now shows “Check your email” but dev testing is still constrained by email limits
- **Magic link** — requires `NEXT_PUBLIC_SITE_URL` and matching Supabase redirect URLs on Vercel

## M1.5 UI risks

- **Charm coordinates** — knot slots in `lib/scene/thread-garden.ts` / `living-tree.ts` may need per-device visual QA; retune `charmSlots` if threads look misaligned
- **Max 6 home charms** — `THREAD_GARDEN.charmSlots` has 6 positions; additional threads are not shown on the garden scene (still accessible via `/threads`)
- **Legacy components** — `AppShell`, `ThreadPulseForm`, `TreeIdentityCard`, `NotificationInboxItem` remain in repo but are unused; safe to remove in a cleanup pass
- **Hydration** — scene particles use client-only mount; watch console on preview/production
- **Scene image weight** — 9 PNGs in `public/scenes/`; monitor Vercel asset delivery and LCP

## RLS / security notes

- `get_invite_preview` is granted to `anon` — only returns data for the exact invite code queried
- `accept_thread_invite` and `is_thread_member` are `SECURITY DEFINER`
- No service role key in app

## Migration

- **Ordering fix applied** — `is_thread_member()` is created after `thread_members` in `20250624100000_ito_m1_schema.sql`
- Remote Supabase may already have schema from earlier apply; editing committed migration is acceptable pre-production but do not re-push blindly to databases with divergent history

## PWA

- Manifest only; no service worker or install icons
- Middleware edge warning about `@supabase/supabase-js` Node API — build succeeds

## Archived / local-only

- **Quiet Window** — assets and config preserved; not routed (closed-window art needs revision before activation). See `docs/design/ARCHIVED_SCENES.md`
- **`/v0-design-reference/`** — gitignored; do not commit

## Legacy

- `supabase/migrations/legacy/` — old Telegram prototype schema
- Branch `backup/pre-ito-telegram-prototype`

## What not to do

- Do not reintroduce v0 mock `CONNECTIONS` / `INBOX` as runtime data
- Do not overwrite scene components with v0 `ito-screen.tsx` monolith
- Do not add chat, comments, or social feed behavior
- Do not change schema without migration review
