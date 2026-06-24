# Manual Test Checklist — Ito M1 + M1.5

**Target:** `main` (`542e3f2`) — local or Vercel production/preview

## Prerequisites

- [ ] Migration `supabase/migrations/20250624100000_ito_m1_schema.sql` applied
- [ ] `.env.local` or Vercel env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`
- [ ] Supabase Auth: Email enabled; redirect URLs include `/auth/callback` for localhost and Vercel
- [ ] `npm run build` and `npm run lint` pass

## Auth

- [ ] `/auth` looks like Ito (scenic background, paper card, Fraunces heading)
- [ ] Create account → **“Check your email”** shown when confirmation required (not silent redirect)
- [ ] Verify email → sign in with password
- [ ] Sign in with email/password works
- [ ] Magic link option present; success message after send (test once to save email quota)
- [ ] Login errors display clearly; buttons show loading state
- [ ] Log out from settings → `/auth`

## Onboarding & utility pages

- [ ] `/onboarding` uses ItoPaperShell; “Create your Ito profile” copy
- [ ] Set display name → redirected home (Thread Garden)
- [ ] `/threads`, `/threads/new`, `/settings`, `/invite/[code]` feel consistent (cream/paper, thread red accents)

## Threads

- [ ] User A: Tie a thread at `/threads/new`
- [ ] User A: sees invite on pending thread (Living Tree or invite code)
- [ ] User B: open invite while logged out → sign in prompt
- [ ] User B: profile → accept thread
- [ ] Thread becomes **active** with two members
- [ ] User B cannot accept own invite / full thread / invalid code

## Thread Garden home (`/`)

- [ ] Renders Thread Garden scene (not old list home)
- [ ] **Empty home:** no floating charms/threads; clear “Tie a thread” CTA
- [ ] **With threads:** charms from real Supabase data (max 6 on scene)
- [ ] Red threads anchored to tree knots and charms — no floating connector marks
- [ ] Tap charm → `/thread/[id]`
- [ ] Bird tap works (visual only)
- [ ] No hydration warnings in console
- [ ] Mobile viewport usable

## Living Tree detail (`/thread/[id]`)

- [ ] Living Tree scene renders
- [ ] Pulse composer opens as bottom sheet
- [ ] Send default pulse (real Supabase insert)
- [ ] Send category pulse
- [ ] Send custom pulse ≤140 chars
- [ ] >140 chars blocked
- [ ] Pending thread: pulse disabled with clear reason
- [ ] Success state after send

## Inbox (`/inbox`)

- [ ] Scene-styled inbox (Thread Garden backdrop)
- [ ] Real received pulses (sender, category/kind/body, time)
- [ ] No v0 mock data
- [ ] Unread indicator visible (note: `opened_at` not auto-cleared yet)

## Navigation & copy

- [ ] Bottom nav works on home, threads, inbox, settings
- [ ] No “touch”, “couples”, “feed”, “likes” as product copy
- [ ] Uses Ito voice: “Tie a thread”, “Send a pulse”, “A small pulse can mean a lot.”

## Regression

- [ ] No `/api/*` routes
- [ ] No Telegram script
- [ ] No mock data files in production paths
- [ ] `/v0-design-reference/` not in git
- [ ] Scene assets load on Vercel (`/scenes/*.png`)

## Email-saving tips (dev)

- Reuse 1–2 password test accounts
- Test magic link once
- Second user: incognito or separate browser profile
- Disable “Confirm email” in Supabase for dev if needed
