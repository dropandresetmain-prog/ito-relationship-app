export interface SendMessageResult {
  ok: boolean;
  error?: string;
}

/**
 * Sends a Telegram Bot API message to a user by their telegram_user_id (chat_id).
 * Uses TELEGRAM_BOT_TOKEN server-side only.
 */
export async function sendTelegramMessage(
  telegramUserId: string,
  text: string
): Promise<SendMessageResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return { ok: false, error: "TELEGRAM_BOT_TOKEN not configured" };
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramUserId,
          text,
          parse_mode: "HTML",
        }),
      }
    );

    const data = (await response.json()) as {
      ok: boolean;
      description?: string;
    };

    if (!data.ok) {
      return {
        ok: false,
        error: data.description ?? `HTTP ${response.status}`,
      };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: message };
  }
}
