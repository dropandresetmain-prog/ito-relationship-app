import type { SceneConfig } from "./types";

/** Retuned for close trunk view — single charm sits within thumb reach. */
export const LIVING_TREE: SceneConfig = {
  id: "living-tree",
  name: "Living Tree",
  treeAnchor: { x: 50, y: 26 },
  birdPerch: { x: 63, y: 24 },
  charmSlots: [{ x: 50, y: 58 }],
  scenes: {
    morning: "/scenes/living-tree-morning.png",
    day: "/scenes/living-tree-day.png",
    evening: "/scenes/living-tree-evening.png",
  },
};
