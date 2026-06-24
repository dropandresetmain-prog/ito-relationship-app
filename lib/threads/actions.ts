"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile, requireUser } from "@/lib/auth/session";
import { generateInviteCode } from "@/lib/threads/queries";
import { createClient } from "@/lib/supabase/server";
import type { MessageCategory, RelationshipMode } from "@/lib/types";

export type ThreadActionState = {
  error?: string;
  success?: boolean;
};

export async function createThread(
  _prev: ThreadActionState,
  formData: FormData
): Promise<ThreadActionState> {
  const { user } = await requireProfile();
  const relationshipMode = String(
    formData.get("relationship_mode") ?? ""
  ) as RelationshipMode;
  const title = String(formData.get("title") ?? "").trim() || null;
  const displayNameOverride =
    String(formData.get("display_name_override") ?? "").trim() || null;

  const validModes = [
    "clare",
    "romantic",
    "mother_son",
    "family",
    "friends",
    "general",
  ];
  if (!validModes.includes(relationshipMode)) {
    return { error: "Choose a valid relationship mode." };
  }

  const supabase = await createClient();
  let inviteCode = generateInviteCode();
  let attempts = 0;
  let threadId: string | null = null;

  while (attempts < 5) {
    const { data, error } = await supabase
      .from("threads")
      .insert({
        created_by: user.id,
        relationship_mode: relationshipMode,
        title,
        status: "pending",
        invite_code: inviteCode,
      })
      .select("id")
      .single();

    if (!error && data) {
      threadId = data.id;
      break;
    }

    if (error?.code === "23505") {
      inviteCode = generateInviteCode();
      attempts++;
      continue;
    }

    return { error: error?.message ?? "Failed to create thread." };
  }

  if (!threadId) {
    return { error: "Could not generate a unique invite code." };
  }

  const { error: memberError } = await supabase.from("thread_members").insert({
    thread_id: threadId,
    user_id: user.id,
    display_name_override: displayNameOverride,
  });

  if (memberError) {
    return { error: memberError.message };
  }

  revalidatePath("/threads");
  redirect(`/thread/${threadId}`);
}

export async function acceptThreadInvite(
  _prev: ThreadActionState,
  formData: FormData
): Promise<ThreadActionState> {
  const user = await requireUser();
  const inviteCode = String(formData.get("invite_code") ?? "").trim();

  if (!inviteCode) {
    return { error: "Invite code is required." };
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return { error: "Please set up your profile before accepting a thread." };
  }

  const { data: threadId, error } = await supabase.rpc("accept_thread_invite", {
    p_invite_code: inviteCode,
  });

  if (error) {
    const message = error.message.includes("Not authenticated")
      ? "Please sign in first."
      : error.message;
    return { error: message };
  }

  revalidatePath("/threads");
  redirect(`/thread/${threadId}`);
}

export async function sendPulse(
  _prev: ThreadActionState,
  formData: FormData
): Promise<ThreadActionState> {
  const { user } = await requireProfile();
  const threadId = String(formData.get("thread_id") ?? "");
  const pulseMode = String(formData.get("pulse_mode") ?? "category");
  const category = String(formData.get("category") ?? "") as MessageCategory;
  const body = String(formData.get("body") ?? "").trim();

  if (!threadId) {
    return { error: "Thread is required." };
  }

  if (body.length > 140) {
    return { error: "Message must be 140 characters or fewer." };
  }

  const supabase = await createClient();

  const { data: members, error: membersError } = await supabase
    .from("thread_members")
    .select("user_id")
    .eq("thread_id", threadId);

  if (membersError) return { error: membersError.message };

  const otherMember = (members ?? []).find((m) => m.user_id !== user.id);
  if (!otherMember) {
    return { error: "This thread is not ready for pulses yet." };
  }

  let pulseKind: "default" | "category" | "custom";
  let pulseCategory: MessageCategory | null = null;
  let pulseBody: string | null = null;

  if (body) {
    pulseKind = "custom";
    pulseBody = body;
    pulseCategory = category || null;
  } else if (pulseMode === "default") {
    pulseKind = "default";
  } else {
    pulseKind = "category";
    pulseCategory = category;
  }

  const { error } = await supabase.from("pulses").insert({
    thread_id: threadId,
    sender_user_id: user.id,
    recipient_user_id: otherMember.user_id,
    pulse_kind: pulseKind,
    category: pulseCategory,
    body: pulseBody,
  });

  if (error) return { error: error.message };

  revalidatePath(`/thread/${threadId}`);
  revalidatePath("/inbox");
  revalidatePath("/");

  return { success: true };
}
