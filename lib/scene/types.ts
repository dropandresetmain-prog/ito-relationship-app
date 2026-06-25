import type { RelationshipMode } from "@/lib/types";

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
  relationshipMode: RelationshipMode;
  initial: string;
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
