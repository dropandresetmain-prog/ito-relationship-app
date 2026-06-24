# Handoff Notes — Milestone 1

## What ships

Minimal MVP loop for LDR couples via Telegram Mini App:

1. Telegram identity from verified `initData`
2. Create/join couple pairing via 6-char invite code
3. Home screen with giant "Thinking of you" button
4. Touch stored in Supabase `touches` table
5. Partner notified via Telegram Bot API message

## What to do first

1. **Supabase** — run migration `supabase/migrations/20250623000000_milestone1_schema.sql`
2. **Env vars** — copy `.env.example` → `.env.local`, fill all values
3. **Bot** — set Mini App URL, test `/start` on both accounts
4. **Deploy** — Vercel, add env vars, update bot URL

## Architecture decisions

| Decision | Rationale |
|----------|-----------|
| Service role in API only | M1 has no Supabase Auth; Telegram initData is the identity layer |
| RLS enabled, no policies | Blocks accidental client access; server bypasses via service role |
| Dev fallback via `DEV_TELEGRAM_USER_ID` | Local testing without Telegram iframe |
| Touch stored even if notify fails | User intent preserved; warning returned to UI |
| `window.location.reload()` after pair | Simple state refresh; replace with client state update in M2 |

## Suggested Milestone 2 items

- Touch history / recent activity feed
- Unpair / regenerate invite
- Supabase Realtime or polling for in-app partner activity
- Proper client auth pattern (JWT or signed session cookie after `/api/me`)
- RLS policies if exposing Supabase client-side

## Key files to read first

1. `lib/telegram/verify-init-data.ts` — identity verification
2. `lib/touches/index.ts` — touch + notification flow
3. `app/page.tsx` — client routing logic
4. `app/api/touches/send/route.ts` — end-to-end API example

## Git commit (when ready)

```bash
git add .
git commit -m "feat: Milestone 1 MVP — Telegram Mini App pairing and touches"
```

Do not commit `.env.local` or secrets.
