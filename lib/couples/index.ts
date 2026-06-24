import { getServiceSupabase } from "@/lib/supabase/server";
import type { VerifiedTelegramIdentity } from "@/lib/telegram/verify-init-data";

export interface AppUser {
  id: string;
  telegram_user_id: string;
  telegram_username: string | null;
  first_name: string | null;
  created_at: string;
}

export interface CoupleRow {
  id: string;
  invite_code: string;
  user_a_id: string;
  user_b_id: string | null;
  created_at: string;
  paired_at: string | null;
}

export interface CoupleStatus {
  couple: CoupleRow | null;
  partner: AppUser | null;
  isPaired: boolean;
  role: "user_a" | "user_b" | null;
}

/**
 * Upserts app_user from verified Telegram identity.
 * Writes: INSERT or UPDATE on app_users (username/first_name may change).
 */
export async function upsertAppUser(
  identity: VerifiedTelegramIdentity
): Promise<AppUser> {
  const supabase = getServiceSupabase();

  const { data: existing } = await supabase
    .from("app_users")
    .select("*")
    .eq("telegram_user_id", identity.telegramUserId)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("app_users")
      .update({
        telegram_username: identity.username,
        first_name: identity.firstName,
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as AppUser;
  }

  const { data, error } = await supabase
    .from("app_users")
    .insert({
      telegram_user_id: identity.telegramUserId,
      telegram_username: identity.username,
      first_name: identity.firstName,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as AppUser;
}

export async function getCoupleStatusForUser(userId: string): Promise<CoupleStatus> {
  const supabase = getServiceSupabase();

  const { data: couple, error } = await supabase
    .from("couples")
    .select("*")
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!couple) {
    return { couple: null, partner: null, isPaired: false, role: null };
  }

  const row = couple as CoupleRow;
  const isPaired = row.user_b_id !== null;
  const role: CoupleStatus["role"] =
    row.user_a_id === userId ? "user_a" : row.user_b_id === userId ? "user_b" : null;

  let partner: AppUser | null = null;
  if (isPaired) {
    const partnerId = row.user_a_id === userId ? row.user_b_id : row.user_a_id;
    if (partnerId) {
      const { data: partnerData } = await supabase
        .from("app_users")
        .select("*")
        .eq("id", partnerId)
        .single();
      partner = (partnerData as AppUser) ?? null;
    }
  }

  return { couple: row, partner, isPaired, role };
}

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Creates a new couple with the user as user_a.
 * Writes: INSERT on couples.
 */
export async function createCouple(userId: string): Promise<CoupleRow> {
  const supabase = getServiceSupabase();

  const existing = await getCoupleStatusForUser(userId);
  if (existing.couple) {
    throw new Error("You are already in a couple");
  }

  let inviteCode = generateInviteCode();
  let attempts = 0;

  while (attempts < 5) {
    const { data, error } = await supabase
      .from("couples")
      .insert({
        invite_code: inviteCode,
        user_a_id: userId,
      })
      .select()
      .single();

    if (!error) return data as CoupleRow;

    if (error.code === "23505") {
      inviteCode = generateInviteCode();
      attempts++;
      continue;
    }

    throw new Error(error.message);
  }

  throw new Error("Failed to generate unique invite code");
}

/**
 * Joins an existing couple as user_b.
 * Writes: UPDATE on couples (user_b_id, paired_at).
 */
export async function joinCouple(
  userId: string,
  inviteCode: string
): Promise<CoupleRow> {
  const supabase = getServiceSupabase();

  const normalizedCode = inviteCode.trim().toUpperCase();

  const existing = await getCoupleStatusForUser(userId);
  if (existing.couple) {
    throw new Error("You are already in a couple");
  }

  const { data: couple, error: fetchError } = await supabase
    .from("couples")
    .select("*")
    .eq("invite_code", normalizedCode)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);
  if (!couple) throw new Error("Invite code not found");

  const row = couple as CoupleRow;

  if (row.user_a_id === userId) {
    throw new Error("You cannot join your own invite code");
  }

  if (row.user_b_id !== null) {
    throw new Error("This couple is already full");
  }

  const { data, error } = await supabase
    .from("couples")
    .update({
      user_b_id: userId,
      paired_at: new Date().toISOString(),
    })
    .eq("id", row.id)
    .is("user_b_id", null)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Couple was filled by someone else");

  return data as CoupleRow;
}
