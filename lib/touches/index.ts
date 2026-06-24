import { getServiceSupabase } from "@/lib/supabase/server";
import { sendTelegramMessage } from "@/lib/telegram/send-message";
import type { AppUser, CoupleRow } from "@/lib/couples";

export interface TouchRow {
  id: string;
  couple_id: string;
  sender_user_id: string;
  receiver_user_id: string;
  message: string;
  created_at: string;
}

export interface SendTouchResult {
  touch: TouchRow;
  notificationSent: boolean;
  notificationError?: string;
}

const DEFAULT_MESSAGE = "Thinking of you 💕";

/**
 * Sends a touch to the partner in a paired couple.
 *
 * Writes: INSERT on touches.
 * Side effect: Telegram bot message to partner (failure is reported, touch is still stored).
 */
export async function sendTouch(
  sender: AppUser,
  couple: CoupleRow,
  message: string = DEFAULT_MESSAGE
): Promise<SendTouchResult> {
  if (!couple.user_b_id) {
    throw new Error("Couple is not fully paired yet");
  }

  const partnerId =
    couple.user_a_id === sender.id ? couple.user_b_id : couple.user_a_id;

  const supabase = getServiceSupabase();

  const { data: partner, error: partnerError } = await supabase
    .from("app_users")
    .select("*")
    .eq("id", partnerId)
    .single();

  if (partnerError || !partner) {
    throw new Error("Partner not found");
  }

  const partnerUser = partner as AppUser;

  // Store the touch event
  const { data: touch, error: touchError } = await supabase
    .from("touches")
    .insert({
      couple_id: couple.id,
      sender_user_id: sender.id,
      receiver_user_id: partnerUser.id,
      message,
    })
    .select()
    .single();

  if (touchError) throw new Error(touchError.message);

  const senderName = sender.first_name ?? sender.telegram_username ?? "Your partner";
  const notificationText =
    `💕 <b>${escapeHtml(senderName)}</b> is thinking of you!\n\n` +
    `<i>${escapeHtml(message)}</i>`;

  const notification = await sendTelegramMessage(
    partnerUser.telegram_user_id,
    notificationText
  );

  return {
    touch: touch as TouchRow,
    notificationSent: notification.ok,
    notificationError: notification.ok ? undefined : notification.error,
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
