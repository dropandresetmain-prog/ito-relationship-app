# Architecture — Ito

## Product metaphors

| Concept | Meaning |
|---------|---------|
| **Tree** | Self / rooted identity (`profiles`) |
| **Thread** | Private relationship connection |
| **Pulse** | Tap-based act of love or attention |
| **Moment** | Ephemeral photo update (not built) |
| **Reaction** | Lightweight response (not built) |

## What Ito is not

Chat, social feed, streaks, guilt-based reminders, public discovery, Telegram-only, couples-only dyads in code.

## M1 implementation

```
Browser (Next.js PWA)
  → @supabase/ssr cookie session
  → Server Components + Server Actions
  → Supabase Postgres with RLS
```

### Auth

- **Email/password** — primary sign-up and login
- **Magic link** — OTP via `signInWithOtp`, callback at `/auth/callback`
- Middleware refreshes session and guards routes
- Profile required before main app (except `/invite/*` for onboarding redirect chain)

### Schema overview

| Table | Purpose |
|-------|---------|
| `profiles` | `id` = `auth.users.id`, `display_name`, optional avatar/timezone |
| `threads` | Relationship mode, status (`pending`/`active`/`archived`), invite code |
| `thread_members` | Membership; designed for N members, M1 enforces max 2 in app + RPC |
| `pulses` | Sent pulses with kind (`default`/`category`/`custom`), optional category/body |

### Relationship modes

`clare`, `romantic`, `mother_son`, `family`, `friends`, `general`

### Pulse categories

`loving`, `caring`, `encouraging`, `grateful`, `missing_you`, `proud_of_you`, `just_because`

### RLS model

- All tables have RLS enabled
- `is_thread_member()` security definer helper avoids policy recursion on `thread_members`
- `get_invite_preview()` / `accept_thread_invite()` — security definer RPCs for invite lookup/accept without exposing all pending threads
- No service role key in the application

### Known RLS limitations

- `opened_at` on pulses is not auto-updated when viewed (inbox “unread” is based on `opened_at IS NULL` but nothing sets it yet)
- Thread updates are broad for any member — no field-level restrictions
- Invite preview RPC is callable by anon (returns only matching code rows)

## Removed prototype

Telegram Mini App (`initData`, `/api/couples/*`, service-role-only access) removed from `main`. See `backup/pre-ito-telegram-prototype` and `supabase/migrations/legacy/`.

## Not built yet

Web Push, Gemini, photo moments, reactions UI, reminders, notification settings, message bank admin, group thread UI, PWA service worker.

## Copy principles

Gentle, invitational language. Avoid guilt framing and “partner” as default generic term.
