# Handoff — Ito (M1 + M1.5 + M1.6 + M1.7)

**Branch:** `feat/m1.7-core-loop-glow-reveal` (from `main` at `0ab61ae`)  
**Latest on main before M1.7:** `0ab61ae` — *Fix production crash: stop passing Lucide icons from server to client*  
**Deployed:** Vercel (connected to GitHub `main`)

---

## What shipped

### M1 — Supabase backend & core flows

- Email/password + magic link auth (`@supabase/ssr` cookies)
- Profiles with required `display_name`
- Thread create with invite code; accept via `/invite/[code]`
- Two-person threads (`pending` → `active`)
- Pulse send (default / category / custom ≤140 chars)
- Inbox of received pulses (real Supabase data)
- RLS on all tables; no service role key
- Migration ordering fix: `is_thread_member()` created after `thread_members` table

### M1.5 — Thread Garden UI & journey polish

- **Thread Garden** (`/`) — immersive home scene with thread charms from real data
- **Living Tree** (`/thread/[id]`) — relationship detail scene + pulse composer bottom sheet
- **Inbox** (`/inbox`) — Thread Garden backdrop + `InboxPanel`
- **Auth** — scenic card, signup verification success state, magic link feedback
- **ItoPaperShell** — utility layout for onboarding, threads, invite, settings
- Scene components, PNGs, Fraunces + warm tokens
- `lib/ito-ui.ts` + Tailwind `content` includes `./lib/**`

### M1.6 hotfix (this branch)

- **Thread create RLS** — `threads_select_creator` policy so `insert().select("id")` works before `thread_members` row exists
- **Scene contrast** — evening/night (`isDimScene`) light text + scrims; scene `BottomNav` variant; stronger bottom sheets
- **Database usage audit** — `docs/audits/DATABASE_USAGE_AUDIT.md`
- **Legacy components removed** (prior hotfix): `AppShell`, `ThreadPulseForm`, etc.

### Mobile UI hotfix (`9ada271`, merged)

- Auth CTA tap targets + Tailwind purge fix for `lib/ito-ui.ts`
- Home scene layout collapse fix (`ScenePageLayout` absolute inset)

### M1.7 — core loop + Home glow reveal

- **Received pulse reveal** — Home (`/`) surfaces latest unread/recent received pulse via `pickLatestReceivedPulse()`; scene overlay + bottom sheet show “[Sender] is thinking of you.” with pulse-back CTA
- **Thread detail reveal** — Living Tree shows same reveal when opening a thread with a received pulse (`pickReceivedPulseForThread()`)
- **Gentler send UX** — soft glow CTA (`itoButtonSoftGlowClass`); thread charm tap opens composer; no giant red send button on relationship sheet
- **No schema changes** — uses existing `pulses` + `opened_at` read state; no new DB writes for UI
- **Serializable props only** — `ReceivedPulseReveal` type passed server → client; icons stay client-side

---

## Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (client + server) |
| `NEXT_PUBLIC_SITE_URL` | Magic link redirect base (`/auth/callback`) |

---

## Supabase setup checklist

1. Apply `supabase/migrations/20250624100000_ito_m1_schema.sql`
2. Apply `supabase/migrations/20250625120000_allow_thread_creator_select.sql` (**required for thread create**)
3. Enable Email auth provider
4. Configure redirect URLs (localhost + Vercel production + preview wildcard)

---

## Key routes

| Route | Scene / shell | Data source |
|-------|---------------|-------------|
| `/` | Thread Garden | `getUserThreads`, `getInboxPulses`, `pickLatestReceivedPulse` |
| `/thread/[id]` | Living Tree | `getThreadDetail`, `pickReceivedPulseForThread`, `sendPulse` action |
| `/inbox` | Inbox scene | `getInboxPulses` |
| `/auth` | Scenic auth card | Supabase Auth actions |
| `/onboarding` | ItoPaperShell | `saveProfile` |
| `/threads`, `/threads/new` | ItoPaperShell | thread queries/actions |
| `/invite/[code]` | ItoPaperShell | `get_invite_preview`, `accept_thread_invite` |
| `/settings` | ItoPaperShell | profile + sign out |

---

## What not to change

- Do not commit `/v0-design-reference/` or `.env.local`
- Do not use v0 mock `CONNECTIONS` / `INBOX` as production data
- Do not overwrite scene layer with v0 monolith wholesale
- Do not change schema casually — use migrations
- Do not add chat, feed, likes, analytics/presence tracking
- Do not add service role key to the frontend

---

## Known risks

See [KNOWN_ISSUES.md](./KNOWN_ISSUES.md). Summary:

- `opened_at` on pulses not auto-updated when viewed
- Max 6 home charm slots
- M2 **not started** — no `message_bank` table yet

---

## Recommended next milestone — M2

**Message bank seed + non-repeating category pulses** (after M1.7 merged + two-account production smoke test)

See `docs/audits/DATABASE_USAGE_AUDIT.md` for persistence guidance.

---

## Testing

See [TEST_CHECKLIST.md](./TEST_CHECKLIST.md).

---

## Audits

- [UI_PORTING_AUDIT_FOR_CODEX.md](./docs/audits/UI_PORTING_AUDIT_FOR_CODEX.md)
- [DATABASE_USAGE_AUDIT.md](./docs/audits/DATABASE_USAGE_AUDIT.md)

---

## Git history (recent)

```
9ada271 Fix mobile auth CTA and home scene layout
acb62c2 Fix mobile auth CTA and home empty state
b89d711 Update handoff after Thread Garden merge
542e3f2 Ignore local validation artifacts
a7a8609 Polish full Ito MVP journey
46d9487 Polish Ito auth and integrate Thread Garden UI
99f3658 feat: Ito M1 — Supabase auth, threads, pulses, and inbox
```
