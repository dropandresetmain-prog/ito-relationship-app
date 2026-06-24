# Manual Test Checklist

## Prerequisites

- [ ] Supabase migration applied
- [ ] `.env.local` configured (or Vercel env vars for production)
- [ ] Telegram bot created and Mini App URL set
- [ ] Two Telegram accounts (or one real + one dev mock)

---

## Local dev (mock user)

- [ ] Set `DEV_TELEGRAM_USER_ID`, `DEV_TELEGRAM_FIRST_NAME` in `.env.local`
- [ ] `npm run dev` → open http://localhost:3000
- [ ] See "Dev mode — mock Telegram user" banner
- [ ] Pairing screen loads without error
- [ ] Create invite code → home shows code, button disabled
- [ ] Second browser/profile with different `DEV_TELEGRAM_USER_ID` joins code
- [ ] Both users see "Connected with …"
- [ ] Tap button → "Sent 💕" (notification may fail without real Telegram chat)

---

## Telegram Mini App (production-like)

- [ ] Deploy to Vercel with production env vars (no `DEV_*`)
- [ ] Set bot menu button URL to deployed app
- [ ] User A opens Mini App from bot
- [ ] User A creates invite code
- [ ] User B opens Mini App, joins with code
- [ ] User A taps "Thinking of you"
- [ ] User B receives Telegram bot message
- [ ] User B taps button → User A receives message

---

## API error cases

- [ ] Join invalid code → 404 error shown
- [ ] Join when couple full → 409 error shown
- [ ] Create couple when already in one → 409 error shown
- [ ] Send touch before paired → button disabled / 409 from API
- [ ] Missing initData in production → 401

---

## Notification failure path

- [ ] Partner has NOT started bot → touch saves, API returns `warning`
- [ ] Warning displayed in UI (amber/error text)

---

## UI / UX

- [ ] Mobile viewport: button centered, readable text
- [ ] Button press animation (scale)
- [ ] Footer placeholders show "Soon"
- [ ] Errors visible (not silent)

---

## Build

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
