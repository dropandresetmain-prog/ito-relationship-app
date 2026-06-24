# Archived scenes

## Quiet Window

**Status:** Archived — not active in M1.5.

Quiet Window is preserved as an alternate creative direction for future use. Assets live in `public/scenes/quiet-window-{morning,day,evening}.png`. Configuration is in `lib/scene/archived-quiet-window.ts`.

### Why archived

The current Quiet Window art has a **closed-window framing problem**. The scene reads as looking through a shut frame rather than an open, inviting view. It needs an **open-window revision** before activation.

### What is not exposed

- No route renders Quiet Window
- No navigation link or scene picker
- Thread Garden remains the active Home (`/`)
- Living Tree remains the active Relationship Detail (`/thread/[id]`)

### Reactivating later

1. Revise scene art (open window framing)
2. Retune charm knots and `treeAnchor` in config
3. Add an explicit product decision to switch or offer the scene
4. Do not enable without QA on thread/charm anchoring
