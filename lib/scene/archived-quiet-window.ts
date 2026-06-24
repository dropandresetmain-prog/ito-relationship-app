import type { SceneConfig } from "./types";

/**
 * Archived alternate scene — not used in M1.5 routes or navigation.
 * Current art has a closed-window framing problem; needs open-window revision
 * before activation. Preserved for future design iteration.
 */
export const ARCHIVED_QUIET_WINDOW: SceneConfig = {
  id: "quiet-window",
  name: "Quiet Window",
  treeAnchor: { x: 50, y: 34 },
  birdPerch: { x: 60, y: 30 },
  charmSlots: [
    { x: 31, y: 48 },
    { x: 69, y: 45 },
    { x: 48, y: 58 },
  ],
  scenes: {
    morning: "/scenes/quiet-window-morning.png",
    day: "/scenes/quiet-window-day.png",
    evening: "/scenes/quiet-window-evening.png",
  },
};
