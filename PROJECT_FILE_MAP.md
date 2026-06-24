# Project File Map

```
ito-relationship-app/
├── app/
│   ├── layout.tsx                 # Root layout, PWA metadata
│   ├── globals.css                # Tailwind + safe-area utilities
│   ├── page.tsx                   # Home (/)
│   ├── onboarding/page.tsx
│   ├── threads/
│   │   ├── page.tsx               # Thread list
│   │   └── new/page.tsx           # Tie a thread (mock)
│   ├── invite/[code]/page.tsx     # Accept invite (mock)
│   ├── thread/[id]/page.tsx       # Pulse screen (mock)
│   ├── inbox/page.tsx
│   └── settings/page.tsx
├── components/
│   ├── AppShell.tsx               # Page chrome + optional back link
│   ├── BottomNav.tsx              # Main tab navigation
│   ├── TreeIdentityCard.tsx
│   ├── ThreadCard.tsx
│   ├── PulseButton.tsx
│   ├── MessageCategoryPicker.tsx
│   ├── NotificationInboxItem.tsx
│   └── ReactionPicker.tsx
├── lib/
│   ├── types.ts                   # Shared TypeScript types
│   ├── labels.ts                  # UI label maps
│   └── mock/data.ts               # Mock threads, inbox, identity
├── public/
│   └── manifest.json              # PWA manifest (no service worker yet)
├── supabase/migrations/legacy/    # Archived prototype SQL — not Ito schema
├── ARCHITECTURE.md
├── README.md
├── KNOWN_ISSUES.md
├── TEST_CHECKLIST.md
└── HANDOFF.md
```

## Data flow (today)

```
Page → mock data (lib/mock/data.ts) → presentational components
```

No API routes. No Supabase client.
