# Handoff — Ito (M1 + M1.5)

**Branch:** `main`  
**Latest commit:** `542e3f2`  
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
- **Auth** — scenic card, signup verification success state, magic link feedback, loading states
- **ItoPaperShell** — consistent utility layout for onboarding, threads, invite, settings
- Scene components: `ThreadLayer`, `SceneShell`, `Bird`, `Particles`, `BottomSheet`
- Charm/thread anchor fix (knot-based paths, no floating connector marks)
- Scene PNGs in `public/scenes/` (Thread Garden, Living Tree, Quiet Window archived)
- Design docs: `docs/design/THREAD_GARDEN_HANDOFF.md`, `docs/design/ARCHIVED_SCENES.md`
- Dependencies: `lucide-react`, `clsx`, `tailwind-merge`
- Gitignore: `/v0-design-reference/`, `.worktrees/`, `supabase/.temp/`

---

## Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (client + server) |
| `NEXT_PUBLIC_SITE_URL` | Magic link redirect base (`/auth/callback`) |

Set in `.env.local` (local) and Vercel project settings (Production + Preview).

---

## Supabase setup checklist

1. Apply `supabase/migrations/20250624100000_ito_m1_schema.sql`
2. Enable Email auth provider
3. Configure redirect URLs (localhost + Vercel production + preview wildcard)
4. For dev: consider disabling “Confirm email” or use dashboard-confirmed test accounts to avoid email limits

---

## Key routes

| Route | Scene / shell | Data source |
|-------|---------------|-------------|
| `/` | Thread Garden | `getUserThreads`, `getInboxPulses` |
| `/thread/[id]` | Living Tree | `getThreadDetail`, `sendPulse` action |
| `/inbox` | Inbox scene | `getInboxPulses` |
| `/auth` | Scenic auth card | Supabase Auth actions |
| `/onboarding` | ItoPaperShell | `saveProfile` |
| `/threads`, `/threads/new` | ItoPaperShell | thread queries/actions |
| `/invite/[code]` | ItoPaperShell | `get_invite_preview`, `accept_thread_invite` |
| `/settings` | ItoPaperShell | profile + sign out |

---

## What not to change

- **Do not** reintroduce `/v0-design-reference/` into the repo (gitignored local reference only)
- **Do not** overwrite scene components with v0 monolith wholesale — adapt incrementally
- **Do not** change schema casually — migrations are live on Supabase
- **Do not** add chat threads, comments, social feed, or likes
- **Do not** use mock `CONNECTIONS` / `INBOX` from v0 as production data
- **Do not** add service role key to the frontend

---

## Known risks

See [KNOWN_ISSUES.md](./KNOWN_ISSUES.md). Summary:

- Email confirmation may block dev testing without dashboard tweaks
- Charm coordinates may need visual QA per device/scene
- Max **6** home charm slots (`THREAD_GARDEN.charmSlots`)
- No Web Push, message bank, Gemini, or photo moments yet
- `opened_at` on pulses not auto-updated when viewed

---

## Recommended next milestone — M2

**Message bank seed + non-repeating category pulses**

1. Seed `message_bank` (or equivalent) table with category-aligned copy
2. Pulse send picks non-repeating lines per thread/category
3. Keep gentle Ito copy voice; no guilt framing

### Do not start yet (post-M2 unless reprioritized)

- Web Push delivery
- Photo moments, reactions, reminders UI
- Gemini / AI generation
- Group thread UI
- Quiet Window activation (needs open-window art revision)

---

## Testing

See [TEST_CHECKLIST.md](./TEST_CHECKLIST.md).

**Email-saving tip:** Reuse 1–2 password test accounts; test magic link once; use incognito for second-user invite flow.

---

## Git history (M1.5 merge)

Feature branch `ui/thread-garden-v0-integration` fast-forward merged into `main`:

- `46d9487` — Integrate Thread Garden UI
- `a7a8609` — Polish full Ito MVP journey
- `542e3f2` — Ignore local validation artifacts
