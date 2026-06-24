import type { InboxItemType, ReactionKind } from "@/lib/types";

export const INBOX_TYPE_LABELS: Record<InboxItemType, string> = {
  pulse: "Pulse",
  moment: "Moment",
  reaction: "Reaction",
};

export const REACTION_LABELS: Record<ReactionKind, string> = {
  warmth: "Warmth",
  smile: "Smile",
  hug: "Hug",
  spark: "Spark",
  bloom: "Bloom",
};
