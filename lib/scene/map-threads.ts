import {
  Feather,
  Heart,
  HeartHandshake,
  Home,
  Leaf,
  Moon,
  Sprout,
  Star,
  Sunrise,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { MessageCategory, RelationshipMode } from "@/lib/types";
import type { RelationMode, SceneConnection } from "./types";
import type { Point } from "./types";

export function relationModeFor(mode: RelationshipMode): RelationMode {
  if (mode === "romantic" || mode === "clare") return "romantic";
  if (mode === "friends") return "friend";
  return "family";
}

export function iconForRelationshipMode(mode: RelationshipMode): LucideIcon {
  if (mode === "romantic" || mode === "clare") return Heart;
  if (mode === "mother_son") return Sprout;
  if (mode === "family") return Home;
  if (mode === "friends") return Users;
  return Feather;
}

export function iconForMessageCategory(category: MessageCategory | null): LucideIcon {
  switch (category) {
    case "loving":
      return Heart;
    case "caring":
      return HeartHandshake;
    case "encouraging":
      return Sunrise;
    case "grateful":
      return Leaf;
    case "missing_you":
      return Moon;
    case "proud_of_you":
      return Star;
    case "just_because":
      return Feather;
    default:
      return Heart;
  }
}

export function formatInboxWhen(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

interface MapThreadInput {
  id: string;
  title: string;
  relationshipMode: RelationshipMode;
  lastPulseAt: string | null;
  hasArrived?: boolean;
}

export function mapThreadsToConnections(
  threads: MapThreadInput[],
  knotSlots: Point[]
): SceneConnection[] {
  return threads.slice(0, knotSlots.length).map((thread, index) => ({
    id: thread.id,
    name: thread.title,
    mode: relationModeFor(thread.relationshipMode),
    initial: thread.title.charAt(0).toUpperCase() || "?",
    icon: iconForRelationshipMode(thread.relationshipMode),
    knot: knotSlots[index],
    lastPulse:
      thread.lastPulseAt != null ? `Last pulse ${thread.lastPulseAt.toLowerCase()}` : "Quiet for now",
    hasArrived: thread.hasArrived,
  }));
}
