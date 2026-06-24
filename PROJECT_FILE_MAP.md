# Project File Map

```
ldr-couples-app/
├── app/
│   ├── api/
│   │   ├── me/route.ts              # POST: verify identity, upsert user, couple status
│   │   ├── couples/
│   │   │   ├── create/route.ts      # POST: create invite code
│   │   │   └── join/route.ts        # POST: join with invite code
│   │   └── touches/
│   │       └── send/route.ts        # POST: send touch + Telegram notification
│   ├── globals.css                  # Tailwind + base styles
│   ├── layout.tsx                   # Root layout, Telegram WebApp script
│   └── page.tsx                     # Main app entry (pairing or home)
├── components/
│   ├── HomeScreen.tsx               # Giant button + placeholder footer actions
│   ├── PairingScreen.tsx            # Create/join couple flow
│   ├── PlaceholderAction.tsx        # Locked Note / Locked Photo placeholders
│   └── ThinkingButton.tsx           # Circular "Thinking of you" button
├── lib/
│   ├── couples/index.ts             # User upsert, couple create/join/status
│   ├── hooks/use-telegram-app.ts    # Client hook: initData, apiFetch
│   ├── supabase/server.ts           # Service-role Supabase client
│   ├── telegram/
│   │   ├── send-message.ts          # Telegram Bot API sendMessage
│   │   └── verify-init-data.ts      # initData HMAC verification + dev fallback
│   └── touches/index.ts             # Store touch + notify partner
├── supabase/
│   └── migrations/
│       └── 20250623000000_milestone1_schema.sql
├── .env.example
├── README.md
├── PROJECT_FILE_MAP.md
├── TEST_CHECKLIST.md
├── KNOWN_ISSUES.md
└── HANDOFF.md
```

## Data flow

```
Telegram Mini App (client)
  → initData in POST body
  → API route verifies initData
  → service-role Supabase writes
  → (touches) Telegram Bot API notify partner
```
