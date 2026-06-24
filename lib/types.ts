export type RelationshipMode =
  | "clare"
  | "romantic"
  | "mother-son"
  | "family"
  | "friends"
  | "general";

export type MessageCategory =
  | "loving"
  | "caring"
  | "encouraging"
  | "grateful"
  | "missing-you"
  | "proud-of-you"
  | "just-because";

export type InboxItemType = "pulse" | "moment" | "reaction";

export type ReactionKind = "warmth" | "smile" | "hug" | "spark" | "bloom";

export interface TreeIdentity {
  displayName: string;
  tagline: string;
}

export interface Thread {
  id: string;
  name: string;
  relationshipMode: RelationshipMode;
  tied: boolean;
  lastPulseAt?: string;
  reminderPrompt?: string;
}

export interface InboxItem {
  id: string;
  threadId: string;
  fromName: string;
  type: InboxItemType;
  message?: string;
  category?: MessageCategory;
  createdAt: string;
  read: boolean;
}
