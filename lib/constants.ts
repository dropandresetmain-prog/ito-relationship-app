import type { MessageCategory, RelationshipMode } from "@/lib/types";

export const RELATIONSHIP_MODES: RelationshipMode[] = [
  "clare",
  "romantic",
  "mother_son",
  "family",
  "friends",
  "general",
];

export const RELATIONSHIP_MODE_LABELS: Record<RelationshipMode, string> = {
  clare: "Clare-specific",
  romantic: "Romantic",
  mother_son: "Mother–Son",
  family: "Family",
  friends: "Friends",
  general: "General",
};

export const MESSAGE_CATEGORIES: MessageCategory[] = [
  "loving",
  "caring",
  "encouraging",
  "grateful",
  "missing_you",
  "proud_of_you",
  "just_because",
];

export const MESSAGE_CATEGORY_LABELS: Record<MessageCategory, string> = {
  loving: "Loving",
  caring: "Caring",
  encouraging: "Encouraging",
  grateful: "Grateful",
  missing_you: "Missing You",
  proud_of_you: "Proud of You",
  just_because: "Just Because",
};

export const PULSE_KIND_LABELS = {
  default: "Pulse",
  category: "Pulse",
  custom: "Pulse",
} as const;
