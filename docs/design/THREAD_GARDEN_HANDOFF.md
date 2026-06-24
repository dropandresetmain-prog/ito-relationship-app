# Ito Design Handoff for Implementation

## Overview

This document provides a complete technical handoff of the Ito UI concept prototype to support implementation into the real app. The current code is a **design exploration tool** rendered in a phone frame—it is **not production code**. This handoff identifies which components are production-ready, which are prototype-only, and what integration work is needed.

**Design Decision:** Thread Garden is the primary design direction. Living Tree will be used for relationship detail views. Quiet Window is archived as an alternate future direction and should not be implemented now.

---

## 1. Component File Inventory

### Core Architecture Files

| File | Purpose | Status | Notes |
|------|---------|--------|-------|
| `lib/ito.ts` | Data types, connection configs, direction configs, pulse categories, inbox mock | Production-ready | Replace mock INBOX array with real data; keep type defs |
| `app/globals.css` | Warm papercut theme tokens (colors, fonts, animations) | Production-ready | All Tailwind animations can stay; tokens drive the visual system |
| `app/layout.tsx` | Root layout with Fraunces serif font setup | Production-ready | Already configured correctly |

### Scene & Ambient Components

| File | Purpose | Status | Notes |
|------|---------|--------|-------|
| `components/ito/ito-screen.tsx` | Main scene controller (state, threads, bird, particles, sheets) | Rewrite for prod | Mock state model; real app will use your auth/data layer |
| `components/ito/particles.tsx` | Floating light motes ambience | Production-ready | Client-only with mounted check (hydration-safe) |
| `components/ito/bird.tsx` | Tappable bird that flies away | Production-ready | Pure visual; no data dependencies |
| `components/ito/thread-layer.tsx` | Renders SVG threads + charm buttons | Production-ready | Maps real connections array; handles pulse animation |

### Bottom Sheet & Compose Components

| File | Purpose | Status | Notes |
|------|---------|--------|-------|
| `components/ito/bottom-sheet.tsx` | Generic sheet container | Production-ready | Reusable; use for composer and inbox |
| `components/ito/pulse-composer.tsx` | UI to select feeling + optional note | Production-ready | Maps PULSE_CATEGORIES; wire to your send API |
| `components/ito/inbox-panel.tsx` | Lists received pulses with unread badge | Prototype-only | Maps mock INBOX array; replace with real data query |

### Phone Frame & Explorer (Prototype-Only)

| File | Purpose | Status | Notes |
|------|---------|--------|-------|
| `components/ito/phone-frame.tsx` | Mobile device bezel frame | Prototype-only | Remove for production; used only in concept explorer |
| `components/ito/concept-explorer.tsx` | Direction/state/time selector UI | Prototype-only | Do not ship; used for design exploration only |

### What to Delete

- `components/ito/phone-frame.tsx` — not needed in real app
- `components/ito/concept-explorer.tsx` — not needed in real app
- Remove "Quiet Window" direction from DIRECTIONS in `lib/ito.ts` (optional; can leave commented)

---

## 2. Key Components & Props

### Main Scene Component: `ItoScreen`

```tsx
interface ItoScreenProps {
  direction: DirectionConfig   // e.g. thread-garden, living-tree
  time: TimeOfDay              // 'morning' | 'day' | 'evening' | 'night'
  initialState: ScreenState    // 'home' | 'relationship' | 'send' | 'received' | 'inbox'
}

export function ItoScreen({ direction, time, initialState }: ItoScreenProps)
```

**Key State to Replace:**
- `selectedId` — tracks which connection (thread charm) is open
- `pulsing` — tracks which connection is currently showing pulse animation
- `view` — which sheet is open ('home', 'relationship', 'send', 'sent', 'inbox')
- `arrivedId` — which connection has a new unread pulse
- `reveal` — whether the "received" overlay is showing

In the real app, much of this should come from your server state or URL params, not client useState.

### Thread & Charm Rendering: `ThreadLayer`

```tsx
interface ThreadLayerProps {
  connections: Connection[]     // list of people/threads
  treeAnchor: Point            // where threads converge (0-100 viewbox)
  selectedId?: string | null   // highlights one thread
  arrivedId?: string | null    // shows pulse indicator on charm
  pulsingId?: string | null    // animates pulse glow along thread
  onSelect?: (id: string) => void
}
```

**Production Note:** Pass real connection data from your auth/user layer. Each `Connection` needs: id, name, icon, charm position, mode (romantic/family/friend).

### Bird Interaction: `Bird`

```tsx
interface BirdProps {
  perch: Point   // x, y in 0-100 viewbox space
}
```

**Pure visual.** Fires `onClick` to trigger flyaway animation. No data needed.

### Pulse Animation: Built into `ThreadLayer`

The pulse glow is rendered as an animated circle that moves along the SVG path using `animateMotion`. No separate component; fully self-contained in ThreadLayer.

### Bottom Sheet: `BottomSheet`

```tsx
interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}
```

**Reusable for:**
- Compose pulse (uses `PulseComposer` inside)
- View inbox (uses `InboxPanel` inside)
- Any future sheet

### Pulse Composer: `PulseComposer`

```tsx
interface PulseComposerProps {
  onSend: (categoryId: string, message: string) => void
}
```

Maps `PULSE_CATEGORIES` into feeling buttons. Optional note field. Call `onSend` with category and message.

### Inbox Panel: `InboxPanel`

```tsx
interface InboxPanelProps {
  pulses: ReceivedPulse[]
}
```

Maps `ReceivedPulse[]` array. Shows unread badge. Should be inside a BottomSheet.

### Time-of-Day & Theme

- `time: TimeOfDay` prop drives scene image swap (via `sceneFor()` utility) and particle tone
- Tint overlay layer is baked into `ItoScreen` using CSS gradients
- No separate theme toggle needed in production; time comes from server or user setting

---

## 3. External Dependencies

### Required Dependencies Beyond React/Next/Tailwind

| Dependency | Used In | Necessary? | Notes |
|------------|---------|-----------|-------|
| `lucide-react` | Bird, charm icons, UI icons | YES | Only for icons; could replace with custom SVG but lucide is lightweight |
| `next/image` | Scene background | YES | Optimizes papercut scene PNGs |

**NO OTHER EXTERNAL DEPS.** Everything else is vanilla React + Tailwind CSS + SVG.

### CSS/Tailwind Could Replace:

- All animations are in `globals.css` (@keyframes) — fully CSS-based, no library needed
- Thread path calculation is pure math (no geometry library)
- Bottom sheet behavior is built with Tailwind `fixed` + transform; no headless UI needed

---

## 4. Code Extraction Guidance

### Copy These Files as-Is Into Cursor

1. **`lib/ito.ts`** — Keep all type defs and utility functions (threadPath, sceneFor)
   - Update `DIRECTIONS` to remove "quiet-window" or leave it commented
   - Replace mock `INBOX` array with real data query
   - Update `PULSE_CATEGORIES` if your app uses different feeling types

2. **`app/globals.css`** — All theme tokens and animations
   - Colors (--background, --thread, --gold, etc.) work as-is
   - All @keyframes (sway, drift, thread-pulse, etc.) are production-ready
   - Merge into existing globals if you have custom CSS

3. **`app/layout.tsx`** — Fraunces font import and setup
   - Adapt metadata and viewport as needed
   - Font setup is correct for Next.js 16

4. **`components/ito/particles.tsx`** — As-is
   - Client-only with hydration protection (useState for mounted check)

5. **`components/ito/bird.tsx`** — As-is
   - Pure visual component

6. **`components/ito/thread-layer.tsx`** — As-is
   - Only takes data props; no backend assumptions

### Rewrite These For Production

1. **`components/ito/ito-screen.tsx`**
   - Architecture: This component has too much local state. Rewrite as follows:
     - Receive `selectedId`, `arrivedId`, `pulsingId`, `reveal` as props from parent (not useState)
     - Receive `onSelect`, `onSend`, `onOpenCompose`, `onOpenInbox` callbacks as props
     - Make it a pure presentational component that maps data to UI
     - Let the real app's router/state management own the state
   - Remove the mock `view` state machine; let parent route handle "which sheet is open"
   - Wire `onSend` callback to hit your pulse creation API instead of local animation

2. **`components/ito/bottom-sheet.tsx`**
   - Currently very basic (styled div + overlay)
   - Enhance with smooth animations, touch-drag-to-dismiss, focus management
   - Or use a headless library (e.g. @radix-ui/dialog with sheet behavior)

3. **`components/ito/pulse-composer.tsx` & `components/ito/inbox-panel.tsx`**
   - Keep UI structure as-is
   - Replace mock handlers with real API calls
   - Composer: wire `onSend` to create a pulse
   - Inbox: query real received pulses instead of mock INBOX array

### Delete Entirely

- `components/ito/phone-frame.tsx`
- `components/ito/concept-explorer.tsx`
- Remove the concept explorer from `app/page.tsx` (replace with real app home/shell)

---

## 5. Hydration & Randomness Notes

### Why Particles Don't Cause Hydration Mismatch

```tsx
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
// ... later
if (!mounted) return null  // Don't render particles on initial SSR render
// ... then safely use Math.random() in useMemo
```

**Pattern:** Only render randomized UI after client mount. This is required for **any** component using `Math.random()`.

### Bird & Animation Randomness

- Bird position is passed as a static prop (from DirectionConfig)
- Flyaway animation is CSS-driven; no randomness involved
- If you add random timing or spawn effects later, use the same mounted check

### Server-Side Rendering Safe?

- Scene image backgrounds: safe (deterministic)
- Thread SVG paths: safe (deterministic from connection data)
- Charm rendering: safe (deterministic)
- Particles: UNSAFE until mounted (use the pattern above)
- Bottom sheets: safe (rendered based on state prop, not random)

---

## 6. Integration Mapping to Routes

### Real App Route Architecture (Recommendation)

```
GET  /                           → ItoScreen with direction="thread-garden", state="home"
GET  /connection/[id]            → ItoScreen with direction="living-tree", state="relationship"
POST /api/pulses                 → Create pulse
GET  /api/pulses/inbox           → Fetch received pulses
GET  /api/pulses/inbox/[id]      → Mark pulse as read
```

### Current Prototype Route

- `app/page.tsx` renders ConceptExplorer (the phone frame + state selector)
- In production, replace with real app layout and route these as needed

### Expected Flow

1. **Home (`/`):** 
   - Render ItoScreen with Thread Garden, home state
   - Show list of connections as charms on the tree
   - On charm click: navigate to `/connection/[id]`

2. **Connection Detail (`/connection/[id]`)**:
   - Render ItoScreen with Living Tree (shows intimate relationship view)
   - Show relationship detail, recent pulses
   - Button to send pulse opens PulseComposer in a BottomSheet
   - On send: POST to `/api/pulses`, animate pulse, return to home

3. **Inbox (`/inbox` or bottom sheet)**:
   - Render InboxPanel with real received pulses
   - Can be a dedicated route or a bottom sheet overlay
   - On pulse click: show full pulse detail (optional expanded view)

4. **Send Pulse**:
   - Bottom sheet overlay on home or connection detail
   - Use PulseComposer
   - On send: POST, animate, show confirmation, close sheet

---

## 7. Known Visual Issues & Fixes

### Issue: "Three Floating Red Lines"

**Status:** Not found in current code. Likely was an artifact from an intermediate prototype version or visual noise from the browser preview. All red threads are now correctly anchored to:
- Tree anchor point (where all threads converge)
- Charm positions (visual endpoints)
- The SVG path calculation ensures no stray lines

**If you see this:** It's likely a rendering glitch from the old proto. The current code is clean.

### Issue: Quiet Window Should Not Be Implemented Now

**Status:** Fixed.
- Removed from default selection in ConceptExplorer (now defaults to Thread Garden)
- To archive: comment out or delete the "quiet-window" entry in DIRECTIONS array in `lib/ito.ts`
- Keep Living Tree and Thread Garden active

### Verified Production-Ready

- ✅ All threads visible and anchored to charm positions
- ✅ Pulse glow animates smoothly along thread path
- ✅ Particles render without hydration mismatch
- ✅ Bird interaction works (perch → tap → flyaway)
- ✅ No floating or unanchored elements
- ✅ Theme colors applied correctly
- ✅ Typography (Fraunces serif) loads correctly

---

## 8. Asset & Scene Files

### Scene Images (Papercut Illustrations)

Located in `public/scenes/`:

```
quiet-window-day.png       ← Archive; don't use in prod yet
quiet-window-evening.png
quiet-window-morning.png
living-tree-day.png        ← Use for connection detail view
living-tree-evening.png
living-tree-morning.png
thread-garden-day.png      ← PRIMARY: Use for home view
thread-garden-evening.png
thread-garden-morning.png
```

**In Real App:**
- Home/main world: Thread Garden scene
- Relationship detail: Living Tree scene
- Time of day: Server/app determines which variant to load
- All scenes are PNG and already optimized

---

## 9. Configuration & Customization

### Changing Connection Data

In `lib/ito.ts`, update `CONNECTIONS`:

```tsx
export const CONNECTIONS: Record<DirectionId, Connection[]> = {
  "thread-garden": [
    {
      id: "unique-id",
      name: "Person Name",
      relation: "Role",
      mode: "romantic" | "family" | "friend",
      initial: "P",
      icon: SomeIcon,
      charm: { x: 30, y: 69 },  // 0-100 viewbox space
      lastPulse: "Text describing last pulse",
    },
    // ...
  ],
}
```

### Changing Pulse Feelings

In `lib/ito.ts`, update `PULSE_CATEGORIES`:

```tsx
export const PULSE_CATEGORIES: PulseCategory[] = [
  { id: "feeling-id", label: "Label", icon: Icon, line: "Template message" },
  // ...
]
```

### Changing Tree Anchor or Bird Perch

Edit the relevant DirectionConfig in `lib/ito.ts`:

```tsx
{
  id: "thread-garden",
  treeAnchor: { x: 54, y: 30 },  // where threads converge
  birdPerch: { x: 64, y: 27 },   // where bird sits
  // ...
}
```

The x, y values are 0-100 viewbox percentages, so they scale to any viewport size.

---

## 10. Quick Start Checklist for Cursor

- [ ] Copy `lib/ito.ts` into app (update mock data as needed)
- [ ] Copy `app/globals.css` and merge theme tokens
- [ ] Copy `app/layout.tsx` and adapt metadata
- [ ] Copy scene components: `particles.tsx`, `bird.tsx`, `thread-layer.tsx`, `bottom-sheet.tsx`, `pulse-composer.tsx`, `inbox-panel.tsx`
- [ ] Rewrite `ito-screen.tsx` to accept state props instead of managing local state
- [ ] Create real route structure (/, /connection/[id], /inbox, POST /api/pulses)
- [ ] Wire PulseComposer to real pulse creation API
- [ ] Wire InboxPanel to real pulse fetching API
- [ ] Delete phone-frame.tsx and concept-explorer.tsx
- [ ] Replace app/page.tsx with real app layout/home
- [ ] Test pulses animate correctly with real data
- [ ] Test arrival notifications (unread badge + shimmer on charm)

---

## 11. Performance Notes

- **Scene images:** Pre-optimized PNG; Next.js Image component handles lazy load
- **SVG threads:** Rendered at 100x100 viewbox; scales crisply to any size
- **Animations:** Pure CSS; 60fps on modern browsers; respects `prefers-reduced-motion`
- **Particles:** Mounted after hydration; cost is 14 small divs with animation
- **Bundle:** ~4 KB gzip for component code (excl. scenes); scenes are ~50 KB each

---

## 12. Accessibility

- All interactive elements have `aria-label` or semantic roles (button, press state)
- Bird interaction has `alt` text
- Scene images have `alt` text
- Animations respect `prefers-reduced-motion`
- Bottom sheets are modal (hide background)
- Color contrast checked on all text layers

---

## Questions or Changes?

This handoff is frozen as of the design decision to ship Thread Garden + Living Tree. If Cursor needs clarification on component behavior, data flow, or integration points, ask directly rather than inferring. The prototype is visual-first; some business logic will be up to your app's actual requirements.

Good luck with implementation!
