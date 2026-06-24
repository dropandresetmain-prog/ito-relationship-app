import type { LucideIcon } from "lucide-react";

export type TimeOfDay = "morning" | "day" | "evening" | "night";
export type RelationMode = "romantic" | "family" | "friend";

export interface Point {
  x: number;
  y: number;
}

export interface SceneConnection {
  id: string;
  name: string;
  mode: RelationMode;
  initial: string;
  icon: LucideIcon;
  /** Knot anchor in 0–100 scene space; SVG threads terminate here. */
  knot: Point;
  lastPulse: string;
  hasArrived?: boolean;
}

export interface SceneConfig {
  id: string;
  name: string;
  treeAnchor: Point;
  birdPerch: Point;
  charmSlots: Point[];
  scenes: { morning: string; day: string; evening: string };
}
