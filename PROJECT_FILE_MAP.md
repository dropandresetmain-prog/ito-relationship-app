# Project File Map

```
ito-relationship-app/
├── middleware.ts                    # Session refresh + route guards
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx                     # Home
│   ├── auth/
│   │   ├── page.tsx                 # Login / signup / magic link
│   │   └── callback/route.ts        # OAuth/magic link callback
│   ├── onboarding/page.tsx          # Profile setup
│   ├── threads/page.tsx
│   ├── threads/new/page.tsx
│   ├── invite/[code]/page.tsx
│   ├── thread/[id]/page.tsx
│   ├── inbox/page.tsx
│   └── settings/page.tsx
├── components/
│   ├── AppShell.tsx
│   ├── BottomNav.tsx
│   ├── AuthForm.tsx
│   ├── ProfileForm.tsx
│   ├── CreateThreadForm.tsx
│   ├── AcceptInviteForm.tsx
│   ├── CopyInviteLink.tsx
│   ├── ThreadPulseForm.tsx
│   ├── TreeIdentityCard.tsx
│   ├── ThreadCard.tsx
│   ├── PulseButton.tsx
│   ├── MessageCategoryPicker.tsx
│   ├── NotificationInboxItem.tsx
│   └── SignOutButton.tsx
├── lib/
│   ├── auth/
│   │   ├── actions.ts               # signUp, signIn, magic link, signOut
│   │   └── session.ts               # requireUser, requireProfile
│   ├── profile/actions.ts           # saveProfile
│   ├── threads/
│   │   ├── actions.ts               # createThread, acceptInvite, sendPulse
│   │   └── queries.ts               # getUserThreads, getThreadDetail, inbox
│   ├── supabase/
│   │   ├── client.ts                # Browser client
│   │   ├── server.ts                # Server client (cookies)
│   │   └── middleware.ts            # Session update logic
│   ├── constants.ts                 # Labels and enum lists
│   └── types.ts
├── supabase/migrations/
│   ├── 20250624100000_ito_m1_schema.sql
│   └── legacy/                      # Archived Telegram prototype
└── public/manifest.json
```

## Data flow

```
Auth (Supabase) → profile row → thread create/join → pulse insert → inbox read
```

All via anon key + RLS. Server Actions use server Supabase client with user session cookies.
