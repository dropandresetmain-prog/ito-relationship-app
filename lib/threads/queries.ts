import { RELATIONSHIP_MODE_LABELS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import type {
  InboxPulseItem,
  InvitePreview,
  RelationshipMode,
  ThreadDetail,
  ThreadListItem,
  ThreadRow,
} from "@/lib/types";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function reminderForMode(mode: RelationshipMode, name: string | null): string | undefined {
  if (mode === "mother_son" && name) return "Send Mum a little warmth?";
  if (mode === "clare") return "Clare crossed your mind?";
  return undefined;
}

function formatRelativeTime(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export async function getUserThreads(): Promise<ThreadListItem[]> {
  await requireProfile();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: memberships, error } = await supabase
    .from("thread_members")
    .select("thread_id")
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  if (!memberships?.length) return [];

  const threadIds = memberships.map((m) => m.thread_id);

  const { data: threads, error: threadsError } = await supabase
    .from("threads")
    .select("*")
    .in("id", threadIds)
    .order("updated_at", { ascending: false });

  if (threadsError) throw new Error(threadsError.message);

  const { data: allMembers, error: membersError } = await supabase
    .from("thread_members")
    .select("thread_id, user_id, display_name_override, profiles(id, display_name)")
    .in("thread_id", threadIds);

  if (membersError) throw new Error(membersError.message);

  const { data: lastPulses, error: pulsesError } = await supabase
    .from("pulses")
    .select("thread_id, created_at")
    .in("thread_id", threadIds)
    .order("created_at", { ascending: false });

  if (pulsesError) throw new Error(pulsesError.message);

  const lastPulseByThread = new Map<string, string>();
  for (const pulse of lastPulses ?? []) {
    if (!lastPulseByThread.has(pulse.thread_id)) {
      lastPulseByThread.set(pulse.thread_id, pulse.created_at);
    }
  }

  return (threads as ThreadRow[]).map((thread) => {
    const members = (allMembers ?? []).filter((m) => m.thread_id === thread.id);
    const other = members.find((m) => m.user_id !== user.id);
    const otherProfile = other?.profiles as
      | { id: string; display_name: string }
      | null
      | undefined;
    const otherName =
      other?.display_name_override ??
      otherProfile?.display_name ??
      null;

    const displayTitle =
      thread.title ?? otherName ?? RELATIONSHIP_MODE_LABELS[thread.relationship_mode];

    return {
      id: thread.id,
      title: displayTitle,
      relationshipMode: thread.relationship_mode,
      status: thread.status,
      isActive: thread.status === "active",
      otherMemberName: otherName,
      lastPulseAt: formatRelativeTime(lastPulseByThread.get(thread.id) ?? null),
      reminderPrompt: reminderForMode(thread.relationship_mode, otherName),
    };
  });
}

export async function getThreadDetail(threadId: string): Promise<ThreadDetail | null> {
  await requireProfile();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: thread, error } = await supabase
    .from("threads")
    .select("*")
    .eq("id", threadId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!thread) return null;

  const { data: members, error: membersError } = await supabase
    .from("thread_members")
    .select("*, profiles(id, display_name)")
    .eq("thread_id", threadId);

  if (membersError) throw new Error(membersError.message);

  const isMember = (members ?? []).some((m) => m.user_id === user.id);
  if (!isMember) return null;

  const other = (members ?? []).find((m) => m.user_id !== user.id);
  const otherProfile = other?.profiles as
    | { id: string; display_name: string }
    | null
    | undefined;

  const otherMember = otherProfile
    ? { id: otherProfile.id, display_name: otherProfile.display_name }
    : null;

  const displayTitle =
    (thread as ThreadRow).title ??
    other?.display_name_override ??
    otherMember?.display_name ??
    RELATIONSHIP_MODE_LABELS[(thread as ThreadRow).relationship_mode];

  return {
    thread: thread as ThreadRow,
    members: (members ?? []).map((m) => ({
      ...m,
      profile: m.profiles as { id: string; display_name: string },
    })),
    otherMember,
    displayTitle,
  };
}

export async function getInvitePreview(code: string): Promise<InvitePreview | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_invite_preview", {
    p_invite_code: code,
  });

  if (error) throw new Error(error.message);
  const row = data?.[0];
  if (!row) return null;
  return row as InvitePreview;
}

export async function getInboxPulses(): Promise<InboxPulseItem[]> {
  await requireProfile();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: pulses, error } = await supabase
    .from("pulses")
    .select("*")
    .eq("recipient_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);
  if (!pulses?.length) return [];

  const senderIds = [...new Set(pulses.map((p) => p.sender_user_id))];
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", senderIds);

  if (profilesError) throw new Error(profilesError.message);

  const nameById = new Map(
    (profiles ?? []).map((p) => [p.id, p.display_name as string])
  );

  return pulses.map((pulse) => ({
    id: pulse.id,
    threadId: pulse.thread_id,
    fromName: nameById.get(pulse.sender_user_id) ?? "Someone",
    pulseKind: pulse.pulse_kind,
    category: pulse.category,
    body: pulse.body,
    createdAt: pulse.created_at,
    read: pulse.opened_at !== null,
  }));
}

export { generateInviteCode };
