# UI Porting Audit for Codex

**Generated:** 2025-06-24  
**Purpose:** Compare v0 design reference vs current Ito app; diagnose production UX bugs; guide fix implementation without schema changes.  
**Audience:** Codex / implementation agents  
**Scope:** Visual/UI/UX only — no RLS, no new features.

---

## 1. Current Git State

| Item | Value |
|------|-------|
| **Current branch** | `hotfix/mobile-auth-and-home-empty-state` |
| **Latest commit (this branch)** | `acb62c2` — *Fix mobile auth CTA and home empty state* |
| **`main` tip (production baseline)** | `b89d711` — *Update handoff after Thread Garden merge* |
| **Working tree** | Clean (audit written on clean tree after report creation) |
| **`v0-design-reference/` in git** | **Ignored** — `.gitignore` line 44: `/v0-design-reference/` |
| **Push status** | Hotfix branch was pushed earlier in session; **this audit commit is not pushed** (per task: do not push) |

### Branch note for Codex

Production/Vercel on `main` (`b89d711`) still exhibits the bugs described in §5 unless the hotfix is merged. This branch contains **partial fixes** for bugs A and B only (5 files). Remaining visual polish (§6) is still open.

---

## 2. v0 Design System Summary

Source: `v0-design-reference/DESIGN_HANDOFF.md`, `v0-design-reference/app/globals.css`, `v0-design-reference/lib/ito.ts`, `v0-design-reference/components/ito/*`.

### Main components

| v0 component | Role |
|--------------|------|
| `ItoScreen` | Monolithic scene controller: background, threads, bird, particles, view state machine, bottom sheets |
| `ThreadLayer` | SVG threads + charm buttons + pulse `animateMotion` |
| `BottomSheet` | Papercut card sliding up from bottom of scene |
| `PulseComposer` | 3×3 feeling grid + optional note + send CTA |
| `InboxPanel` | Received pulses list (mock `INBOX` data) |
| `Particles` | Hydration-safe floating motes |
| `Bird` | Tappable perch → flyaway |
| `ConceptExplorer` + `PhoneFrame` | **Prototype-only** — direction/time/state picker in phone bezel |

### Layout philosophy

- **Full-bleed scenic world** — papercut PNG fills viewport; UI is overlays (header, charms, bottom sheet).
- **Bottom sheet as primary chrome** — home summary, relationship detail, compose, inbox, sent confirmation.
- **No global tab bar in v0** — inbox accessed via header icon inside scene.
- **Phone frame** only for design exploration; production should be edge-to-edge PWA.

### Colors / tokens

Warm papercut palette (oklch):

- `--background` cream paper `oklch(0.95 0.018 78)`
- `--foreground` warm ink
- `--thread` / `--thread-glow` red thread of fate
- `--gold`, `--accent` sage/gold accents
- `--card`, `--border`, `--muted-*` for sheets and forms

v0 also ships full shadcn token set + dark mode variants (Tailwind v4 `@theme inline`).

### Fonts

- **Headings:** Fraunces (`--font-fraunces`) via `font-heading`
- **Body (v0):** Geist Sans + Geist Mono
- **Current app:** Fraunces for headings only; body is `system-ui` stack

### Scenes

`public/scenes/` (copied into main repo):

| Asset | v0 intent |
|-------|-----------|
| `thread-garden-{morning,day,evening}.png` | Home / main world |
| `living-tree-{morning,day,evening}.png` | Relationship detail |
| `quiet-window-*` | Archived — do not ship |

Time-of-day: `morning | day | evening | night` — **night reuses evening PNG**.

### Animation approach

All CSS `@keyframes` in `globals.css`:

- `sway`, `drift`, `breathe`, `shimmer`, `rise-in`, `sheet-up`, `bird-flyaway`, `bird-bob`
- `thread-pulse` (v0 only — current uses SVG `animateMotion` in `ThreadLayer`)
- `prefers-reduced-motion` respected for ambient animations

### Bottom sheet approach

- `absolute inset-x-0 bottom-0 z-20` inside scene container
- `animate-sheet-up`, `rounded-t-[2rem]`, `bg-card/85 backdrop-blur-md paper-shadow`
- Drag handle pill at top
- **No** `isOpen`/`onClose` in shipped v0 `BottomSheet` — always visible at bottom (view state toggles content)

### Auth style in v0

**Not present.** v0 is a concept explorer with no Supabase auth. Production auth was built separately (M1 + M1.5).

### Utility page style in v0

**Not present.** v0 is a single-page explorer. Production added `ItoPaperShell` for onboarding, threads, settings, invite — papercut-inspired but **not** from v0 source files.

### v0 tech stack vs current

| | v0 reference | Current app |
|--|--------------|-------------|
| Next.js | 16.2.6 | 15.5.x |
| Tailwind | v4 + shadcn | v3 (`tailwind.config.ts`) |
| Extra deps | shadcn, tw-animate-css, Geist, Analytics | Supabase SSR, clsx, tailwind-merge |

---

## 3. Current App UI Summary (by route)

### `/auth`

| Aspect | Detail |
|--------|--------|
| **Component tree** | `app/auth/page.tsx` → scenic `Image` + gradients → `Suspense` → `AuthForm` |
| **v0 visual language** | **Partial** — scenic Thread Garden background + bottom-sheet-style card (`AuthCard`), not in v0 |
| **ItoPaperShell** | No |
| **Scene UI** | Background only (static morning garden PNG) |
| **Generic/dev feel** | Low on desktop; **was high on mobile** due to tiny submit button (§5A) |
| **Known bugs** | Tiny sign-in CTA on mobile (`main`); fixed on hotfix via `itoButtonPrimaryClass` |
| **Empty/loading/error** | Suspense “Loading…”; callback `?error=` alert; verification/magic-link success states |
| **Mobile risks** | Tab buttons lacked min-height; magic-link text link small tap target |

### `/onboarding`

| Aspect | Detail |
|--------|--------|
| **Component tree** | `ItoPaperShell` → `ProfileForm` |
| **v0 visual language** | **Adapted** — uses `ito-ui` tokens, Fraunces title, warm gradient header wash |
| **ItoPaperShell** | Yes (`showNav={false}`) |
| **Scene UI** | No |
| **Generic/dev feel** | Moderate — functional form page, not scenic |
| **Empty/loading/error** | Form validation via server action; loading spinner on submit |
| **Mobile risks** | Low if `itoButtonPrimaryClass` applied (hotfix improves) |

### `/threads`

| Aspect | Detail |
|--------|--------|
| **Component tree** | `ItoPaperShell` → `ThreadCard` list or dashed empty card → `Link` CTA |
| **v0 visual language** | **Partial** — cards use `itoCardClass`; list UX not in v0 (v0 used charms on tree) |
| **ItoPaperShell** | Yes |
| **Scene UI** | No |
| **Generic/dev feel** | Moderate — acceptable utility page; lacks scene immersion |
| **Empty/loading/error** | Dashed empty card + copy |
| **Mobile risks** | Low |

### `/threads/new`

| Aspect | Detail |
|--------|--------|
| **Component tree** | `ItoPaperShell` (back → `/threads`) → `CreateThreadForm` |
| **v0 visual language** | **Partial** — `ito-ui` form controls |
| **ItoPaperShell** | Yes |
| **Scene UI** | No |
| **Generic/dev feel** | Moderate — standard form layout |
| **Mobile risks** | `<select>` native styling on iOS |

### `/invite/[code]`

| Aspect | Detail |
|--------|--------|
| **Component tree** | `ItoPaperShell` → invite code card → `AcceptInviteForm` |
| **v0 visual language** | **Partial** |
| **ItoPaperShell** | Yes (`showNav={false}`) |
| **Scene UI** | No |
| **Generic/dev feel** | Low–moderate — mono code display is on-brand |
| **Empty/loading/error** | `notFound()` for bad code; branch states for logged-out / no profile / full thread |
| **Mobile risks** | Low with hotfix button classes |

### `/` (home)

| Aspect | Detail |
|--------|--------|
| **Component tree** | `ScenePageLayout` → `ThreadGardenHome` → `SceneShell` + `ThreadLayer?` + `BottomSheet` + `SceneInboxButton`; `BottomNav` below scene |
| **v0 visual language** | **Strong** when layout works — direct port of Thread Garden + sheet |
| **ItoPaperShell** | No |
| **Scene UI** | Yes — primary v0 experience |
| **Generic/dev feel** | **Was broken on mobile** — blank scene + only `BottomNav` visible (`main`) |
| **Known bugs** | Flex height collapse (§5B); fixed on hotfix |
| **Empty/loading/error** | No profile → redirect `/onboarding`; no threads → empty sheet + centered message (hotfix); image fallback (hotfix) |
| **Mobile risks** | Bottom sheet + nav stacking; charm slots vs thread count; night tint without night PNG |

**Data flow (not a bug):** `requireProfile()` → `getUserThreads()` → `mapThreadsToConnections()` — empty array is valid; UI must render empty state inside scene.

### `/thread/[id]`

| Aspect | Detail |
|--------|--------|
| **Component tree** | `ScenePageLayout` (`showNav={false}`) → `LivingTreeScene` → `SceneShell` + `ThreadLayer` + sheet views (`relationship` / `send` / `sent`) + `PulseComposer` |
| **v0 visual language** | **Strong** — Living Tree + composer sheets match v0 `ItoScreen` relationship flow |
| **ItoPaperShell** | No |
| **Scene UI** | Yes |
| **Generic/dev feel** | Low for scene; **inline buttons** on “Send a pulse” lack shared `itoButtonPrimaryClass` |
| **Empty/loading/error** | `notFound()` if not member; pending invite code in sheet |
| **Mobile risks** | Send pulse button `py-3 text-sm` only — same class of tap-target issue as auth |

### `/inbox`

| Aspect | Detail |
|--------|--------|
| **Component tree** | `ScenePageLayout` → `InboxScene` (`SceneShell` + `BottomSheet`) → `InboxPanel` |
| **v0 visual language** | **Strong** — garden background + inbox sheet (v0 used overlay from home) |
| **ItoPaperShell** | No |
| **Scene UI** | Yes |
| **Generic/dev feel** | Low |
| **Empty/loading/error** | Dashed empty state in panel |
| **Mobile risks** | `max-h-[50vh]` scroll inside sheet; scene layout depends on hotfix |

### `/settings`

| Aspect | Detail |
|--------|--------|
| **Component tree** | `ItoPaperShell` → profile card sections → `SignOutButton` |
| **v0 visual language** | **Partial** |
| **ItoPaperShell** | Yes |
| **Scene UI** | No |
| **Generic/dev feel** | Moderate — plain settings list |
| **Mobile risks** | Low |

### Orphaned legacy components (not routed)

These still exist and use **old Cursor styling** (`warm-50`, `border-warm-100`, `bg-white`):

- `components/AppShell.tsx`
- `components/ThreadPulseForm.tsx`
- `components/NotificationInboxItem.tsx`

**Not mounted by any `app/` route** — safe to delete or archive; they contribute to “generic Cursor” confusion if reused accidentally.

---

## 4. v0 → Current Porting Map

| v0 file | Current equivalent | Classification | Notes |
|---------|-------------------|----------------|-------|
| `lib/ito.ts` (types, `threadPath`, `sceneFor`, `PULSE_CATEGORIES`, mocks) | `lib/scene/types.ts`, `thread-path.ts`, `time-of-day.ts`, `pulse-categories.ts`, `map-threads.ts`, `thread-garden.ts`, `living-tree.ts` | **Adapted** | Mock `CONNECTIONS`/`INBOX` removed; real Supabase queries |
| `app/globals.css` | `app/globals.css` | **Partially adapted** | Core tokens + most animations ported; no shadcn/dark/Geist; missing `thread-pulse` keyframe (SVG used instead) |
| `app/layout.tsx` | `app/layout.tsx` | **Adapted** | Fraunces kept; no Geist; PWA manifest/viewport added |
| `components/ito/particles.tsx` | `components/scene/Particles.tsx` | **Copied as-is** (minor path) | Hydration pattern preserved |
| `components/ito/bird.tsx` | `components/scene/Bird.tsx` | **Copied as-is** | |
| `components/ito/thread-layer.tsx` | `components/scene/ThreadLayer.tsx` | **Adapted** | `charm` → `knot`; retuned charm positions; knot anchor circle added; empty connections returns null |
| `components/ito/bottom-sheet.tsx` | `components/scene/BottomSheet.tsx` | **Copied as-is** | Same classes/structure |
| `components/ito/pulse-composer.tsx` | `components/pulse/PulseComposer.tsx` | **Adapted** | Wired to `sendPulse` server action; send button not using `ito-ui` |
| `components/ito/inbox-panel.tsx` | `components/inbox/InboxPanel.tsx` | **Adapted** | Real `InboxPulseItem[]`; links to `/thread/[id]`; empty state added |
| `components/ito/ito-screen.tsx` | `SceneShell`, `ThreadGardenHome`, `LivingTreeScene`, `InboxScene` | **Rewritten** | Per handoff; state machine split across routes/components |
| `components/ito/phone-frame.tsx` | — | **Intentionally ignored** | |
| `components/ito/concept-explorer.tsx` | — | **Intentionally ignored** | |
| `app/page.tsx` (ConceptExplorer) | `app/page.tsx` (ThreadGardenHome) | **Rewritten** | |
| `public/scenes/*` | `public/scenes/*` | **Copied** | 9 PNGs in repo; quiet-window archived in docs only |
| `components/ui/button.tsx` (shadcn) | `lib/ito-ui.ts` | **Missed / replaced differently** | Custom string classes instead of shadcn Button |
| v0 auth | `app/auth/page.tsx`, `AuthForm.tsx` | **New (Cursor-built)** | Scenic card; not from v0 |
| v0 utility pages | `ItoPaperShell` + route pages | **New (Cursor-built)** | Papercut-inspired utility shell |
| v0 inbox as overlay | `/inbox` route + `SceneInboxButton` | **Adapted** | Dedicated route + bottom nav item |
| `BottomNav` | `components/BottomNav.tsx` | **New (production)** | Not in v0 explorer |
| Received pulse reveal overlay | — | **Missed** | v0 `reveal` state / arrival shimmer on home — partial via `hasArrived` on charms only |
| Quiet Window direction | `lib/scene/archived-quiet-window.ts` | **Intentionally ignored** | Docs only |

### Should now be ported (remaining gaps)

1. Normalize **all primary CTAs** through `itoButtonPrimaryClass` (Living Tree send, PulseComposer send, any inline `bg-[var(--thread)] py-3 text-sm`).
2. **Received pulse reveal** overlay (optional M1.5+ polish from v0 `ItoScreen`).
3. **Delete or archive** orphaned `AppShell` / `ThreadPulseForm` / `NotificationInboxItem`.
4. Consider **Geist or consistent sans** if body text should match v0 more closely (low priority).
5. Merge **hotfix** to `main` for production bug fixes.

### Should remain ignored

- `phone-frame.tsx`, `concept-explorer.tsx`, Quiet Window scenes in production UI, mock `INBOX` at runtime.

---

## 5. Bug Diagnosis

### A. Tiny mobile sign-in button

| Field | Detail |
|-------|--------|
| **Symptom** | On mobile `/auth`, primary “Sign in” (and similar) buttons appear tiny / hard to tap |
| **Files** | `lib/ito-ui.ts` (`itoButtonPrimaryClass`), `components/AuthForm.tsx` (submit + tabs) |
| **Root cause on `main`** | `itoButtonPrimaryClass` used `text-sm` + `py-3.5` only — **no `min-h-[48px]`**, no `text-base`, no `touch-manipulation` / `appearance-none`. Mobile Safari can shrink native `<button type="submit">` appearance. Tab switchers used `py-2.5` without min-height. |
| **Why mobile specifically** | iOS default button rendering, smaller computed tap targets, `maximumScale: 1` in viewport prevents zoom compensation. |
| **Data/layout?** | No — pure CSS. |
| **Hotfix status** | `acb62c2` adds `min-h-12`, `text-base`, `px-6`, mobile button resets; tab `min-h-11`. |
| **Proposed fix (if not merged)** | Apply hotfix changes; audit any submit buttons not using `itoButtonPrimaryClass`. |

### B. Blank home after login

| Field | Detail |
|-------|--------|
| **Symptom** | After login, `/` shows almost nothing except bottom nav / bars |
| **Files** | `components/scene/ScenePageLayout.tsx`, `components/scene/SceneShell.tsx`, `components/scene/ThreadGardenHome.tsx`, `components/scene/BottomSheet.tsx` |
| **Root cause on `main`** | **Layout collapse:** `ScenePageLayout` used `flex-1 min-h-0` child with `SceneShell` at `h-full`. All scene content is `position: absolute` (image, header, sheet, threads). No in-flow height → `h-full` resolves to **~0px** in mobile flex layouts. User sees only `BottomNav` (sibling outside collapsed flex child). |
| **Scene image loading?** | Images exist at `/scenes/thread-garden-*.png` and load when container has height. Failure was visibility, not 404 (in most cases). |
| **Empty threads handling?** | `ThreadGardenHome` **did** render `EmptyHomeSheet` in `BottomSheet` — but sheet was inside zero-height container → invisible. |
| **Profile/thread data empty?** | Valid state: `mapThreadsToConnections([])` → `hasThreads === false`. Redirect to `/onboarding` only when no profile (`requireProfile`). Empty threads is expected for new users — UI must show empty state **inside visible scene**. |
| **z-index / positioning?** | Contributing factor: absolute children don’t expand parent; not primarily a z-index bug. |
| **Bottom nav overlay?** | `BottomNav` is **below** scene flex region, not overlaying it — but when scene height is 0, nav dominates the viewport. |
| **Hotfix status** | `acb62c2`: `ScenePageLayout` wraps children in `absolute inset-0`; `SceneShell` adds `min-h-full` + image `onError` fallback; `ThreadGardenHome` adds centered empty copy + updated CTA copy. |
| **Proposed fix (if not merged)** | Merge hotfix; verify on real iOS Safari + Android Chrome. |

---

## 6. Visual Mismatch Diagnosis

| Area | Still ugly/generic? | Why |
|------|---------------------|-----|
| `/auth` | Was yes on mobile | Undersized buttons; otherwise on-brand scenic card |
| `/` | Was yes (blank) | Layout collapse; hotfix addresses |
| `/onboarding`, `/threads`, `/settings` | Mild | `ItoPaperShell` is clean but **paper utility**, not full scene — acceptable for M1 |
| `/thread/[id]` | Mild | Scene strong; **inline thread-red buttons** bypass `ito-ui` |
| `PulseComposer` | Mild | Same inline button pattern |
| `BottomNav` | Acceptable | Production addition; small `text-[10px]` labels |
| Legacy `AppShell` | Yes if used | Old `warm-*` Tailwind palette — **dead code** |
| Body typography | Mild drift | system-ui vs v0 Geist |
| Dark mode | N/A | Current forces light; v0 had dark tokens |
| Missing reveal overlay | Gap vs v0 | No full-screen “pulse arrived” moment on home |

**Common causes:**

- Missing shared shell on utility routes (by design — `ItoPaperShell` vs scene)
- Wrong buttons (inline classes vs `ito-ui`)
- No scene on utility pages (intentional for forms)
- Default form controls (`<select>` unstyled)
- Old Cursor markup in orphaned components
- Mobile layout (`flex` + `h-full` + absolute children)

---

## 7. Recommended Fix Plan

| Priority | Item | Classification |
|----------|------|----------------|
| P0 | Merge hotfix: auth CTA sizing + home scene layout | **Act Now** |
| P0 | Verify `/` empty threads + with threads on mobile preview | **Act Now** |
| P1 | Normalize buttons: `LivingTreeScene`, `PulseComposer`, any stray CTAs → `ito-ui` | **Act Now** |
| P1 | Mobile QA pass all routes (375px viewport) | **Act Now** |
| P2 | Delete/archive `AppShell`, `ThreadPulseForm`, `NotificationInboxItem` | **Investigate Now** |
| P2 | Pulse arrival reveal overlay (v0 parity) | **Park for Later** |
| P2 | Geist body font parity | **Park for Later** |
| P3 | Bottom sheet drag-to-dismiss (v0 handoff suggestion) | **Park for Later** |
| P3 | shadcn Button component vs `ito-ui` strings | **Ignore/Accept Risk** |
| P3 | Quiet Window scenes | **Ignore/Accept Risk** |

---

## 8. Suggested Implementation Plan for Cursor

### Step 1 — Ship blocking hotfix (if not on `main`)

1. Merge `hotfix/mobile-auth-and-home-empty-state` → `main`
2. Deploy Vercel preview; mobile smoke test `/auth` + `/`

### Step 2 — Auth CTA sizing + feedback

1. Confirm all `AuthForm` actions use `itoButtonPrimaryClass`
2. Tab + secondary actions: `min-h-11`, `touch-manipulation`
3. Optional: global `@layer base { button { touch-action: manipulation; } }`

### Step 3 — Home empty state / scene visibility

1. Confirm `ScenePageLayout` `absolute inset-0` wrapper
2. Confirm empty copy + “Tie a thread” visible above `BottomNav`
3. Test: new user with profile, zero threads

### Step 4 — Utility page `ItoPaperShell` polish

1. Optional subtle scene texture or thread-gradient on utility headers
2. Ensure all forms use `itoInputClass` / `itoButtonPrimaryClass` (mostly done)

### Step 5 — Button/form normalization

1. Replace inline `bg-[var(--thread)] py-3 text-sm` in:
   - `components/scene/LivingTreeScene.tsx`
   - `components/pulse/PulseComposer.tsx`
2. Grep for other occurrences

### Step 6 — Mobile QA

Test 375×812 (iPhone) and one Android width:

- `/auth` (all modes + success states)
- `/` (0 threads, N threads)
- `/thread/[id]` (send flow)
- `/inbox` (empty + items)
- Utility pages scroll above `BottomNav`

### Step 7 — Build/lint

```bash
npm run lint
npm run build
```

---

## 9. Files Likely to Change

### Already changed (hotfix `acb62c2`)

- `lib/ito-ui.ts`
- `components/AuthForm.tsx`
- `components/scene/ScenePageLayout.tsx`
- `components/scene/SceneShell.tsx`
- `components/scene/ThreadGardenHome.tsx`

### Likely next (polish)

- `components/scene/LivingTreeScene.tsx`
- `components/pulse/PulseComposer.tsx`
- `components/BottomNav.tsx` (tap targets — optional)
- `app/globals.css` (base button reset — optional)
- Delete: `components/AppShell.tsx`, `components/ThreadPulseForm.tsx`, `components/NotificationInboxItem.tsx`

### Unlikely for UI-only pass

- `lib/scene/map-threads.ts` (data mapping — working)
- Supabase migrations / RLS
- `middleware.ts` (auth logic)

---

## 10. Validation Checklist

### Local dev

- [ ] `npm run dev` with `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`)
- [ ] **No demo/no-auth mode exists** — must sign in or use Supabase test user
- [ ] Test user paths:
  - New account → email verify → onboarding → home (0 threads)
  - Existing user with threads → home charms visible
  - Send pulse from `/thread/[id]`

### Build

- [ ] `npm run lint` — pass
- [ ] `npm run build` — pass

### Mobile viewport routes (Chrome DevTools 375px or real device)

- [ ] `/auth` — submit button full width, ≥48px tall, readable
- [ ] `/` logged in, 0 threads — scene + empty message + sheet CTA above nav
- [ ] `/` with threads — charms + bottom sheet
- [ ] `/thread/[id]` — scene + send pulse sheet
- [ ] `/inbox` — sheet scroll, back control
- [ ] `/onboarding`, `/threads/new` — form buttons sized correctly

### Production / Vercel preview

- [ ] Deploy from branch with hotfix merged
- [ ] Same mobile checks on preview URL
- [ ] Confirm scene PNGs load (Network tab: `/scenes/thread-garden-*.png` 200)
- [ ] Login redirect: no profile → `/onboarding`; profile → `/`
- [ ] Regression: magic link + email signup success states

---

## Appendix A — Scene Asset Inventory

**In repo (`public/scenes/`):** 9 PNGs including archived quiet-window.

**v0 reference (`v0-design-reference/public/scenes/`):** Same set (local, gitignored).

**Night mode:** No dedicated night PNG — `sceneForTime()` uses `evening` asset + night tint gradient in `SceneShell`.

---

## Appendix B — Key Code References (production `main` bug state)

### Auth button (`main`)

```6:7:lib/ito-ui.ts
export const itoButtonPrimaryClass =
  "flex w-full items-center justify-center gap-2 rounded-full bg-[var(--thread)] py-3.5 text-sm font-semibold ...";
```

### Home layout (`main`)

```11:16:components/scene/ScenePageLayout.tsx
export function ScenePageLayout({ children, showNav = true }: ScenePageLayoutProps) {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-lg flex-col bg-background">
      <div className="relative min-h-0 flex-1">{children}</div>
```

`SceneShell` children are all `absolute` — parent must fill flex space explicitly (hotfix adds `absolute inset-0` wrapper).

---

## Appendix C — Reference Locations

| Resource | Path |
|----------|------|
| v0 handoff (local) | `v0-design-reference/DESIGN_HANDOFF.md` |
| v0 components | `v0-design-reference/components/ito/` |
| M1.5 handoff copy in repo | `docs/design/THREAD_GARDEN_HANDOFF.md` |
| Archived scenes note | `docs/design/ARCHIVED_SCENES.md` |
| This audit | `docs/audits/UI_PORTING_AUDIT_FOR_CODEX.md` |

---

*End of audit. Do not treat v0 mock `CONNECTIONS` / `INBOX` as runtime data in production.*
