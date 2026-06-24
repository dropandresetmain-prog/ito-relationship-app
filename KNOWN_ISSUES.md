# Known Issues

**Updated after M1.6 hotfix branch (`hotfix/thread-create-rls-contrast-db-audit`)**

## Fixed in M1.6 hotfix

- **Thread create RLS failure** — `createThread()` `insert().select("id")` failed because only `threads_select_member` existed; creator not yet in `thread_members`. Fixed via `threads_select_creator` migration.
- **Evening scene text contrast** — dark `text-foreground` on orange evening backdrop; header, empty state, Living Tree back link unreadable. Fixed via `isDimScene` (evening + night) in `lib/scene/scene-theme.ts`.
- **BottomNav on scene pages** — improved contrast with `variant="scene"` on `ScenePageLayout`.
- **Legacy components** — removed in `9ada271` (`AppShell`, `ThreadPulseForm`, etc.)

## M1 limitations (still open)

- **Two-person threads only** — enforced in `accept_thread_invite()` and UI
- **No Web Push** — recipient must open app/inbox to see pulses
- **`opened_at` not updated** — inbox unread state never clears automatically when viewing
- **No reactions, moments, reminders, message bank, or AI (Gemini)**
- **No automated tests**
- **Email confirmation** — dev testing constrained by Supabase email limits
- **Magic link** — requires `NEXT_PUBLIC_SITE_URL` and matching Supabase redirect URLs

## M1.5 / UI risks

- **Charm coordinates** — may need per-device visual QA
- **Max 6 home charms** — extra threads only on `/threads`
- **Hydration** — particles client-only; watch console
- **Night time** — reuses evening PNG + night tint

## Database / efficiency (audit)

- **Duplicate profile reads** — `requireProfile()` called multiple times per page (home, thread detail)
- **Full inbox fetch** — home and thread detail load full inbox for unread counts
- See `docs/audits/DATABASE_USAGE_AUDIT.md` — no noisy UI writes found

## RLS / security

- `get_invite_preview` granted to `anon`
- `accept_thread_invite` and `is_thread_member` are `SECURITY DEFINER`
- `threads_select_creator` — creators can SELECT own threads only (`created_by = auth.uid()`)
- No service role key in app

## Migrations

Apply in order:

1. `20250624100000_ito_m1_schema.sql`
2. `20250625120000_allow_thread_creator_select.sql` (**new — required for thread create**)

## PWA

- Manifest only; no service worker
- Middleware edge warning about `@supabase/supabase-js` Node API — build succeeds

## Archived / local-only

- **Quiet Window** — not routed. See `docs/design/ARCHIVED_SCENES.md`
- **`/v0-design-reference/`** — gitignored

## What not to do

- Do not start M2 until M1.6 merged and production smoke test passes
- Do not reintroduce v0 mock data at runtime
- Do not add usage/analytics tables for trivial UI events
