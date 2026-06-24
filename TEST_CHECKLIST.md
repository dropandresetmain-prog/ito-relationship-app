# Manual Test Checklist — Ito M1

## Prerequisites

- [ ] Apply `supabase/migrations/20250624100000_ito_m1_schema.sql`
- [ ] Configure `.env.local` with Supabase URL, anon key, `NEXT_PUBLIC_SITE_URL`
- [ ] Supabase Auth: Email enabled; redirect URL includes `/auth/callback`
- [ ] `npm run build` and `npm run lint` pass

## Auth

- [ ] Sign up with email/password → onboarding
- [ ] Set display name → redirected home
- [ ] Log out from settings → `/auth`
- [ ] Log in with email/password
- [ ] Magic link: request link → email received → opens app signed in

## Threads

- [ ] User A: Tie a thread (choose mode, optional name/title)
- [ ] User A: sees invite code/link on pending thread
- [ ] User B: open invite link while logged out → sign in prompt
- [ ] User B: sign up → profile → accept thread
- [ ] Both users: thread status active
- [ ] User B cannot accept own invite / full thread / invalid code

## Pulses

- [ ] Active thread: send simple pulse
- [ ] Send category pulse (each tone selectable)
- [ ] Send custom pulse with note ≤140 chars
- [ ] Pending thread: pulse button disabled
- [ ] Recipient sees pulse in inbox (sender, kind/category/body, time)

## Navigation & copy

- [ ] Bottom nav works
- [ ] No “touch”, “couples”, “partner” as default copy
- [ ] Gentle prompts where appropriate

## Regression

- [ ] No `/api/*` routes
- [ ] No Telegram script
- [ ] No mock data files in use
