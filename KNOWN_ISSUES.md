# Known Issues & Limitations

## Milestone 1 scope

- **No real-time sync** — partner does not see touches in-app until a future inbox/history feature.
- **Placeholder actions** — Locked Note and Locked Photo are UI-only.
- **Single couple per user** — a user cannot be in multiple couples.
- **No unpair / leave** — couples persist once created.

## Telegram notifications

- Partner must have **started the bot** (`/start`) or notifications fail with "bot can't initiate conversation".
- Notification failures are **logged in API response** (`warning` field) but the touch is still stored.
- No retry queue for failed notifications.

## Security & auth

- All DB access uses **service role** server-side; RLS blocks direct client access but there is no per-user Supabase auth yet.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is configured but unused in M1 — reserved for future client reads with RLS policies.

## Development

- `DEV_TELEGRAM_USER_ID` bypasses initData verification **only when `NODE_ENV !== 'production'`**.
- Testing two users locally requires two different `DEV_TELEGRAM_USER_ID` values (two browser profiles or env swap) — there is no multi-user dev UI.

## Deployment

- Vercel serverless cold starts may add latency on first tap.
- `initData` expires after 24 hours; user must reopen Mini App from Telegram to refresh.

## Data

- No touch history UI — events are stored but not displayed.
- Invite codes are 6 characters; collision retry is limited to 5 attempts.
