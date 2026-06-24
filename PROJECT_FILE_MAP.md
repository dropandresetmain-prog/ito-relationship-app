# Project File Map

**Updated for M1 + M1.5 on `main` (`542e3f2`)**

```
ito-relationship-app/
├── middleware.ts                      # Session refresh + route guards
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
│   │   ├── ScenePageLayout.tsx        # Full-height layout + BottomNav
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
│   ├── BottomNav.tsx                  # Main navigation (lucide icons)
│   ├── ProfileForm.tsx
│   ├── CreateThreadForm.tsx
│   ├── AcceptInviteForm.tsx
│   ├── ThreadCard.tsx
│   ├── SignOutButton.tsx
│   ├── AppShell.tsx                   # Legacy shell (unused; kept for reference)
│   ├── ThreadPulseForm.tsx            # Legacy pulse form (replaced by PulseComposer on detail)
│   ├── TreeIdentityCard.tsx           # Legacy home card (replaced by Thread Garden)
│   ├── CopyInviteLink.tsx             # Invite link copy helper
│   ├── PulseButton.tsx                # Legacy
│   ├── MessageCategoryPicker.tsx      # Legacy
│   └── NotificationInboxItem.tsx      # Legacy inbox item (replaced by InboxPanel)
│
├── lib/
│   ├── auth/
│   │   ├── actions.ts                 # signUp, signIn, magic link, signOut
│   │   └── session.ts                 # requireUser, requireProfile
│   ├── profile/actions.ts             # saveProfile
│   ├── threads/
│   │   ├── actions.ts                 # createThread, acceptInvite, sendPulse
│   │   └── queries.ts                 # getUserThreads, getThreadDetail, inbox
│   ├── scene/                         # Scene config & mapping
│   │   ├── thread-garden.ts           # Home scene config + charm slots
│   │   ├── living-tree.ts             # Detail scene config
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
│   └── legacy/                        # Archived Telegram prototype
│
└── docs/design/
    ├── THREAD_GARDEN_HANDOFF.md       # v0 extraction notes
    └── ARCHIVED_SCENES.md             # Quiet Window archive note
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
