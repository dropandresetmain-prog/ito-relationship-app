# Known Issues

## M1 limitations

- **Two-person threads only** — enforced in `accept_thread_invite()` and UI; schema allows more members later
- **No Web Push** — recipient must open app/inbox to see pulses
- **`opened_at` not updated** — inbox unread state never clears automatically when viewing
- **No reactions, moments, reminders, or AI**
- **No automated tests**
- **Email confirmation** — if enabled in Supabase, sign-up may require email verify before session works
- **Magic link** — requires `NEXT_PUBLIC_SITE_URL` and matching Supabase redirect URL config

## RLS / security notes

- `get_invite_preview` is granted to `anon` — only returns data for the exact invite code queried
- `accept_thread_invite` and `is_thread_member` are `SECURITY DEFINER` — required for invite accept and policy recursion avoidance
- No service role key in app — complex admin operations not available server-side yet

## PWA

- Manifest only; no service worker or install icons
- Middleware edge warning about `@supabase/supabase-js` Node API — build succeeds; monitor if edge runtime issues arise

## Legacy

- `supabase/migrations/legacy/` is the old Telegram prototype — not the Ito schema
- Full prototype on `backup/pre-ito-telegram-prototype`
