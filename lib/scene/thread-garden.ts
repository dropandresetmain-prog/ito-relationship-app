import type { SceneConfig } from "./types";

/** Retuned knot slots — raised above bottom sheet so threads read as tied charms. */
export const THREAD_GARDEN: SceneConfig = {
  id: "thread-garden",
  name: "Thread Garden",
  treeAnchor: { x: 54, y: 30 },
  birdPerch: { x: 64, y: 27 },
  charmSlots: [
    { x: 30, y: 58 },
    { x: 64, y: 61 },
    { x: 47, y: 68 },
    { x: 22, y: 64 },
    { x: 72, y: 66 },
    { x: 55, y: 72 },
  ],
  scenes: {
    morning: "/scenes/thread-garden-morning.png",
    day: "/scenes/thread-garden-day.png",
    evening: "/scenes/thread-garden-evening.png",
  },
};
