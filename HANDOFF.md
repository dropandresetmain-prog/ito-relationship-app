# Handoff — Ito Shell Reset

## What shipped

A clean **Ito PWA frontend shell** with mock data:

- 8 routes (home, onboarding, threads, new thread, invite, thread detail, inbox, settings)
- 8 UI components (AppShell, BottomNav, cards, pulse flow, inbox item, pickers)
- Ito branding, copy, and red-thread color tokens
- `public/manifest.json` (no service worker)
- Docs updated to reflect shell-only state

## What was removed

- Telegram Mini App (`lib/telegram`, initData hook, Web App script)
- Couples/touches API routes and domain logic
- Supabase service-role client (dependency removed from package.json)
- Old UI components (HomeScreen, PairingScreen, ThinkingButton, etc.)

## Preserved elsewhere

- Git branch: `backup/pre-ito-telegram-prototype`
- Legacy SQL: `supabase/migrations/legacy/`

## Recommended next milestone

**M1 — Auth + first real thread**

1. Add Supabase project + **new** schema migration (users, threads, pulses — not legacy tables)
2. Supabase Auth (magic link or OAuth) + session in API routes
3. Wire `/threads/new` and `/invite/[code]` to real invite flow
4. Wire `/thread/[id]` pulse send to database
5. Wire `/inbox` to read received pulses
6. Replace mock identity on home with authenticated profile

### Likely files to touch

- `lib/supabase/` (client + server helpers)
- `app/api/` (new routes)
- `supabase/migrations/` (new Ito schema)
- `.env.example`
- Pages currently importing `lib/mock/data.ts`

### Risks

- Greenfield schema design before multi-thread support is specified
- No test suite — manual QA burden
- PWA install experience needs icons + service worker later

### Do not start yet (per product plan)

- Web Push, Gemini, photo moments, reminder cron, message bank admin
