# Project File Map

**Updated for M1.6 on `main` (`9ada271` + hotfix branch)**

```
ito-relationship-app/
├── middleware.ts                      # Session refresh + route guards
├── tailwind.config.ts                 # Must include ./lib/** in content
├── app/
│   ├── layout.tsx                     # Root layout, Fraunces font
│   ├── globals.css                    # Ito tokens, scene keyframes, utilities
│   ├── page.tsx                       # Thread Garden home (server → ThreadGardenHome)
│   ├── auth/
│   │   ├── page.tsx                   # Scenic auth page
│   │   └── callback/route.ts          # Magic link / OAuth callback
│   ├── onboarding/page.tsx            # Profile setup (ItoPaperShell)
│   ├── threads/page.tsx               # Thread list
│   ├── threads/new/page.tsx           # Tie a thread
│   ├── invite/[code]/page.tsx         # Accept invite
│   ├── thread/[id]/page.tsx           # Living Tree detail (server → LivingTreeScene)
│   ├── inbox/page.tsx                 # Scene-styled inbox
│   └── settings/page.tsx              # Account settings
│
├── components/
│   ├── scene/                         # M1.5 scenic UI
│   │   ├── ThreadGardenHome.tsx       # Home scene client shell
│   │   ├── LivingTreeScene.tsx        # Detail scene + pulse sheets
│   │   ├── SceneShell.tsx             # Background, tint, header, bird
│   │   ├── ThreadLayer.tsx            # SVG threads + charm buttons
│   │   ├── ScenePageLayout.tsx        # Full-height layout + scene BottomNav
│   │   ├── SceneInboxButton.tsx       # Header inbox link + unread dot
│   │   ├── BottomSheet.tsx            # Slide-up sheet container
│   │   ├── Bird.tsx                   # Tappable bird animation
│   │   └── Particles.tsx              # Ambient motes
│   ├── pulse/
│   │   └── PulseComposer.tsx          # Category + note composer (sendPulse action)
│   ├── inbox/
│   │   ├── InboxPanel.tsx             # Real inbox list
│   │   └── InboxScene.tsx             # Inbox over Thread Garden backdrop
│   ├── ItoPaperShell.tsx              # Utility page layout (cream/paper)
│   ├── AuthForm.tsx                   # Sign in / signup / magic link + success states
│   ├── BottomNav.tsx                  # Main navigation (default | scene variant)
│   ├── ProfileForm.tsx
│   ├── CreateThreadForm.tsx
│   ├── AcceptInviteForm.tsx
│   ├── ThreadCard.tsx
│   └── SignOutButton.tsx
│
├── lib/
│   ├── auth/
│   │   ├── actions.ts                 # signUp, signIn, magic link, signOut
│   │   └── session.ts                 # requireUser, requireProfile
│   ├── profile/actions.ts             # saveProfile
│   ├── threads/
│   │   ├── actions.ts                 # createThread, acceptInvite, sendPulse
│   │   └── queries.ts                 # getUserThreads, getThreadDetail, inbox
│   ├── scene/
│   │   ├── thread-garden.ts           # Home scene config + charm slots
│   │   ├── living-tree.ts             # Detail scene config
│   │   ├── scene-theme.ts             # isDimScene, hero text classes (evening/night)
│   │   ├── archived-quiet-window.ts   # Archived scene (not routed)
│   │   ├── map-threads.ts             # DB threads → SceneConnection[]
│   │   ├── thread-path.ts             # SVG path builder
│   │   ├── time-of-day.ts             # Scene time + image selection
│   │   ├── pulse-categories.ts        # UI categories (maps to MessageCategory)
│   │   └── types.ts                   # Point, SceneConnection, etc.
│   ├── ito-ui.ts                      # Shared input/button/card class strings
│   ├── utils.ts                       # cn() helper
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── constants.ts
│   └── types.ts
│
├── public/
│   ├── manifest.json
│   └── scenes/                        # Scene PNGs (thread-garden, living-tree, quiet-window)
│
├── supabase/migrations/
│   ├── 20250624100000_ito_m1_schema.sql
│   ├── 20250625120000_allow_thread_creator_select.sql   # M1.6 thread create RLS fix
│   └── legacy/                        # Archived Telegram prototype
│
└── docs/
    ├── design/
    │   ├── THREAD_GARDEN_HANDOFF.md
    │   └── ARCHIVED_SCENES.md
    └── audits/
        ├── UI_PORTING_AUDIT_FOR_CODEX.md
        └── DATABASE_USAGE_AUDIT.md
```

## Gitignored (local only)

- `/v0-design-reference/` — v0 design export
- `.worktrees/` — temporary git worktrees
- `supabase/.temp/` — Supabase CLI cache
- `.env.local`

## Data flow

```
Auth (Supabase) → profile row → thread create/join → pulse insert → inbox read
                         ↓
              map-threads → SceneConnection[] → ThreadLayer charms
```

All via anon key + RLS. Server Actions use server Supabase client with user session cookies. Scene UI receives real data from server components — no v0 mock arrays.

## Key dependencies

`next`, `react`, `@supabase/ssr`, `@supabase/supabase-js`, `lucide-react`, `clsx`, `tailwind-merge`
