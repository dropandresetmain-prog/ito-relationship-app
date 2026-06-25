export type RelationshipMode =
  | "clare"
  | "romantic"
  | "mother_son"
  | "family"
  | "friends"
  | "general";

export type ThreadStatus = "pending" | "active" | "archived";

export type MessageCategory =
  | "loving"
  | "caring"
  | "encouraging"
  | "grateful"
  | "missing_you"
  | "proud_of_you"
  | "just_because";

export type PulseKind = "default" | "category" | "custom";

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  timezone: string | null;
  created_at: string;
  updated_at: string;
}

export interface ThreadRow {
  id: string;
  created_by: string;
  relationship_mode: RelationshipMode;
  title: string | null;
  status: ThreadStatus;
  invite_code: string;
  invite_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ThreadMemberRow {
  id: string;
  thread_id: string;
  user_id: string;
  role_label: string | null;
  display_name_override: string | null;
  joined_at: string;
  created_at: string;
}

export interface PulseRow {
  id: string;
  thread_id: string;
  sender_user_id: string;
  recipient_user_id: string;
  pulse_kind: PulseKind;
  category: MessageCategory | null;
  body: string | null;
  opened_at: string | null;
  created_at: string;
}

export interface ThreadListItem {
  id: string;
  title: string;
  relationshipMode: RelationshipMode;
  status: ThreadStatus;
  isActive: boolean;
  otherMemberName: string | null;
  lastPulseAt: string | null;
  reminderPrompt?: string;
}

export interface InboxPulseItem {
  id: string;
  threadId: string;
  fromName: string;
  pulseKind: PulseKind;
  category: MessageCategory | null;
  body: string | null;
  createdAt: string;
  read: boolean;
}

/** Serializable received-pulse state for Home / Thread Garden glow reveal. */
export interface ReceivedPulseReveal {
  id: string;
  threadId: string;
  fromName: string;
  body: string | null;
  createdAt: string;
  read: boolean;
}

export interface InvitePreview {
  thread_id: string;
  relationship_mode: RelationshipMode;
  inviter_name: string;
  member_count: number;
  status: ThreadStatus;
}

export interface ThreadDetail {
  thread: ThreadRow;
  members: Array<ThreadMemberRow & { profile: Pick<Profile, "id" | "display_name"> }>;
  otherMember: Pick<Profile, "id" | "display_name"> | null;
  displayTitle: string;
}
