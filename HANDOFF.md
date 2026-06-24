# Handoff — Ito M1

## What shipped

Supabase-backed M1:

- Email/password + magic link auth (`@supabase/ssr` cookies)
- Profiles with required `display_name`
- Thread create with invite code; accept via `/invite/[code]`
- Two-person threads (`pending` → `active`)
- Pulse send (default / category / custom)
- Inbox of received pulses
- RLS on all tables; no service role key

## Apply before testing

1. Run migration `supabase/migrations/20250624100000_ito_m1_schema.sql`
2. Configure `.env.local` and Supabase Auth redirect URLs
3. See [TEST_CHECKLIST.md](./TEST_CHECKLIST.md)

## Recommended next milestone (M2)

**Delivery + polish**

1. Mark pulses read (`opened_at` update on inbox view)
2. Web Push notification on new pulse
3. PWA icons + service worker
4. Thread list refresh / optimistic UI after send
5. Unarchive / leave thread flows
6. Basic error boundaries and empty-state polish

### Do not start yet

- Photo moments, reactions, Gemini, reminders, message bank admin
- Group thread UI (schema ready; keep M1 two-person enforcement until product ready)

## Git

Changes are local only — not pushed per instruction.
