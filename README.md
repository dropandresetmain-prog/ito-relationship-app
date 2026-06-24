# LDR Couples App

A Telegram Mini App for long-distance couples. Milestone 1 delivers the core loop: open from bot → pair with partner → tap "Thinking of you" → partner gets a Telegram notification.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind
- **Supabase** (Postgres) for users, couples, and touches
- **Telegram Mini App** (`initData` verification) + **Bot API** (notifications)
- Deployable on **Vercel**

## Quick start

### 1. Clone and install

```bash
npm install
cp .env.example .env.local
```

### 2. Configure environment

Edit `.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (not used by API yet; reserved) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; used in API routes |
| `TELEGRAM_BOT_TOKEN` | From [@BotFather](https://t.me/BotFather) |
| `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` | Bot username (no `@`) |

**Local dev only** (never set in production):

| Variable | Description |
|----------|-------------|
| `DEV_TELEGRAM_USER_ID` | Mock Telegram user ID |
| `DEV_TELEGRAM_USERNAME` | Optional mock username |
| `DEV_TELEGRAM_FIRST_NAME` | Optional mock first name |

### 3. Run Supabase migration

Apply `supabase/migrations/20250623000000_milestone1_schema.sql` in the Supabase SQL editor or via CLI:

```bash
supabase db push
```

### 4. Configure Telegram bot

1. Create a bot with [@BotFather](https://t.me/BotFather).
2. Set the Mini App URL: `/setmenubutton` or Bot Settings → Menu Button → your Vercel URL.
3. Users must **start the bot** (`/start`) before notifications can be delivered (Telegram requires an open chat).

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without Telegram, set `DEV_TELEGRAM_USER_ID` in `.env.local`.

### 6. Deploy to Vercel

1. Push to GitHub and import in Vercel.
2. Add all env vars (except `DEV_*`).
3. Set the bot Mini App URL to your production domain.

## API routes

| Route | Purpose |
|-------|---------|
| `POST /api/me` | Verify initData, upsert user, return couple status |
| `POST /api/couples/create` | Create invite code |
| `POST /api/couples/join` | Join with invite code |
| `POST /api/touches/send` | Store touch + notify partner |

All routes expect `{ "initData": "..." }` in the JSON body.

## Security

- Telegram `initData` is verified server-side (HMAC-SHA256 per Telegram docs).
- `TELEGRAM_BOT_TOKEN` and `SUPABASE_SERVICE_ROLE_KEY` are server-only.
- RLS is enabled on all tables; no client policies — access is via service role in API routes only.

## Docs

- [PROJECT_FILE_MAP.md](./PROJECT_FILE_MAP.md) — file layout
- [TEST_CHECKLIST.md](./TEST_CHECKLIST.md) — manual QA steps
- [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) — limitations and risks
- [HANDOFF.md](./HANDOFF.md) — handoff notes for next milestone
