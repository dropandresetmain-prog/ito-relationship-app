# Manual Test Checklist — Ito Shell

## Build

- [ ] `npm install`
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npm run dev` — app loads at http://localhost:3000

## Navigation

- [ ] Bottom nav: Home, Threads, Inbox, Settings
- [ ] `/onboarding` reachable from Settings
- [ ] Back links work on `/threads/new`, `/thread/[id]`

## Routes

- [ ] `/` — tree card, gentle reminder, thread previews, “Tie a thread”
- [ ] `/threads` — all mock threads listed
- [ ] `/threads/new` — disabled mock form, link to invite preview
- [ ] `/invite/DEMO12` — shows code, mock accept button
- [ ] `/thread/thread-mum` — pulse button, categories, note, reactions
- [ ] `/inbox` — mock pulses/moments/reactions
- [ ] `/settings` — placeholder sections

## Copy review

- [ ] Uses “pulse”, “thread”, “tree” — not “touch”, “partner”, “couples”
- [ ] No guilt-based reminder language
- [ ] Gentle prompts present (“Send Mum a little warmth?”)

## Mobile

- [ ] Readable at ~390px width
- [ ] Pulse button centered and tappable
- [ ] Safe-area padding acceptable on notched viewport

## Regression (removed prototype)

- [ ] No Telegram Web App script in page source
- [ ] No `/api/*` routes in build output
- [ ] Package name is `ito-relationship-app`
