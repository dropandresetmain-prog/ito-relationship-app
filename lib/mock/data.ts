import type {
  InboxItem,
  MessageCategory,
  RelationshipMode,
  Thread,
  TreeIdentity,
} from "@/lib/types";

export const RELATIONSHIP_MODE_LABELS: Record<RelationshipMode, string> = {
  clare: "Clare-specific",
  romantic: "Romantic",
  "mother-son": "Mother–Son",
  family: "Family",
  friends: "Friends",
  general: "General",
};

export const MESSAGE_CATEGORY_LABELS: Record<MessageCategory, string> = {
  loving: "Loving",
  caring: "Caring",
  encouraging: "Encouraging",
  grateful: "Grateful",
  "missing-you": "Missing You",
  "proud-of-you": "Proud of You",
  "just-because": "Just Because",
};

export const mockTreeIdentity: TreeIdentity = {
  displayName: "Seth",
  tagline: "Rooted here, threads reaching outward.",
};

export const mockThreads: Thread[] = [
  {
    id: "thread-mum",
    name: "Mum",
    relationshipMode: "mother-son",
    tied: true,
    lastPulseAt: "2 days ago",
    reminderPrompt: "Send Mum a little warmth?",
  },
  {
    id: "thread-clare",
    name: "Clare",
    relationshipMode: "clare",
    tied: true,
    lastPulseAt: "Yesterday",
    reminderPrompt: "Clare crossed your mind?",
  },
  {
    id: "thread-alex",
    name: "Alex",
    relationshipMode: "friends",
    tied: true,
    lastPulseAt: "Last week",
  },
];

export const mockInboxItems: InboxItem[] = [
  {
    id: "inbox-1",
    threadId: "thread-mum",
    fromName: "Mum",
    type: "pulse",
    category: "caring",
    message: "Hope your day feels gentle.",
    createdAt: "2026-06-24T09:15:00Z",
    read: false,
  },
  {
    id: "inbox-2",
    threadId: "thread-clare",
    fromName: "Clare",
    type: "moment",
    message: "Share a small piece of today.",
    createdAt: "2026-06-23T18:40:00Z",
    read: true,
  },
  {
    id: "inbox-3",
    threadId: "thread-alex",
    fromName: "Alex",
    type: "reaction",
    message: "Sent warmth back to your pulse.",
    createdAt: "2026-06-22T12:05:00Z",
    read: true,
  },
];

export const mockGentleReminders: string[] = [
  "Send Mum a little warmth?",
  "Clare crossed your mind?",
  "A small pulse can mean a lot.",
  "Share a small piece of today.",
];
