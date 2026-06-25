# Architecture — Ito

**Current:** M1 backend + M1.5 scene UI + M1.6 hotfix + M1.7 core loop on `feat/m1.7-core-loop-glow-reveal`. Deployed on Vercel (`main` at `0ab61ae`).

## Product metaphors

| Concept | Meaning |
|---------|---------|
| **Tree** | Self / rooted identity (`profiles`) |
| **Thread** | Private relationship connection |
| **Pulse** | Tap-based act of love or attention |
| **Charm** | Visual thread anchor on scene (maps to a thread) |
| **Moment** | Ephemeral photo update (not built) |
| **Reaction** | Lightweight response (not built) |

## What Ito is not

Chat, social feed, streaks, guilt-based reminders, public discovery, Telegram-only, couples-only dyads in code.

---

## System overview

```
Browser (Next.js PWA on Vercel)
  → @supabase/ssr cookie session (middleware)
  → Server Components + Server Actions
  → Supabase Postgres with RLS
  → Scene UI layer (client components) over real data
```

### UI layers

| Layer | Used on | Purpose |
|-------|---------|---------|
| **Scene** | `/`, `/thread/[id]`, `/inbox` | Full-bleed scenic backgrounds, charms, bottom sheets |
| **ItoPaperShell** | `/auth`, `/onboarding`, `/threads/*`, `/invite/*`, `/settings` | Warm cream utility pages, Fraunces headings, paper cards |
| **BottomNav** | Scene (`variant="scene"`) + utility pages | Home, Threads, Inbox, Settings |

### Active scenes

| Scene | Route | Config |
|-------|-------|--------|
| Thread Garden | `/` | `lib/scene/thread-garden.ts` |
| Living Tree | `/thread/[id]` | `lib/scene/living-tree.ts` |
| Quiet Window | *(archived)* | `lib/scene/archived-quiet-window.ts` — not routed |

---

## Auth

- **Email/password** — primary sign-up and login
- **Magic link** — `signInWithOtp`, callback at `/auth/callback`
- **Signup with email confirmation** — when `data.session` is null after signUp, UI shows “Check your email” (no silent redirect loop)
- Middleware refreshes session and guards routes
- Profile required before main app (except `/invite/*` for onboarding redirect chain)

### Redirect URLs (Supabase Auth)

Required in Supabase dashboard:

- `http://localhost:3000/**` and `/auth/callback` (local)
- Production Vercel URL `/**` and `/auth/callback`
- Preview wildcard `https://*.vercel.app/**` if using branch previews

`NEXT_PUBLIC_SITE_URL` must match the deployment origin for magic links.

---

## Schema overview

| Table | Purpose |
|-------|---------|
| `profiles` | `id` = `auth.users.id`, `display_name`, optional avatar/timezone |
| `threads` | Relationship mode, status (`pending`/`active`/`archived`), invite code |
| `thread_members` | Membership; M1 enforces max 2 in app + RPC |
| `pulses` | Sent pulses with kind (`default`/`category`/`custom`), optional category/body |

### Relationship modes

`clare`, `romantic`, `mother_son`, `family`, `friends`, `general`

### Pulse categories

`loving`, `caring`, `encouraging`, `grateful`, `missing_you`, `proud_of_you`, `just_because`

### Migration note

1. `20250624100000_ito_m1_schema.sql` — base M1 schema + RLS
2. `20250625120000_allow_thread_creator_select.sql` — `threads_select_creator` for thread create flow

`is_thread_member()` is created **after** `thread_members` exists. Required for clean `supabase db push` on fresh projects.

### RLS model

- All tables have RLS enabled
- `threads_select_member` — members can read threads
- `threads_select_creator` — creators can read own threads before membership row exists
- `is_thread_member()` security definer helper avoids policy recursion
- `get_invite_preview()` / `accept_thread_invite()` — security definer RPCs for invite flow
- No service role key in the application

### Known RLS limitations

- `opened_at` on pulses is not auto-updated when viewed
- Thread updates are broad for any member
- Invite preview RPC is callable by anon (scoped to invite code)

---

## Core loop (M1.7)

```
Account A sends pulse → pulses row (recipient = B)
  → B opens / → pickLatestReceivedPulse(inbox)
  → Thread Garden: thread glow + scene overlay + reveal sheet
  → B pulse back → sendPulse → A sees reveal on Home
```

Inbox remains secondary history. Emotional destination is Home / Thread Garden.

---

## Scene / thread visual layer

```
lib/scene/scene-theme.ts      → isDimScene (evening/night) text treatment
lib/scene/map-threads.ts     → maps ThreadListItem[] to SceneConnection[] (knot slots)
components/pulse/PulseReveal → received-pulse overlay + sheet reveal (serializable props)
components/scene/ThreadLayer → SVG threads + charm buttons + arrived glow
lib/scene/thread-path.ts     → curved path treeAnchor → knot
```

- Threads terminate at **knot** anchors, not tag centers
- Max 6 charms on Thread Garden home (`charmSlots` array)
- Living Tree uses single charm slot for active thread
- `animate-sway` on ThreadLayer root (SVG + charms move together)

---

## Removed prototype

Telegram Mini App removed from `main`. See `backup/pre-ito-telegram-prototype` and `supabase/migrations/legacy/`.

## Database usage

See `docs/audits/DATABASE_USAGE_AUDIT.md`. No UI action persistence; one pulse = one row.

## Not built yet

Web Push, Gemini, photo moments, reactions UI, reminders, message bank, group thread UI, PWA service worker, Quiet Window activation.

## Copy principles

Gentle, invitational language. Avoid guilt framing, “feed”, “likes”, “touch”, “couples”, and “partner” as default generic term.
