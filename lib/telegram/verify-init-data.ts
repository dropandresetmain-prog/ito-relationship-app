import crypto from "crypto";

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface VerifiedTelegramIdentity {
  telegramUserId: string;
  username: string | null;
  firstName: string | null;
  /** Raw initData string when verified from Telegram; null in dev fallback */
  initData: string | null;
  isDevFallback: boolean;
}

const AUTH_DATE_MAX_AGE_SECONDS = 86400; // 24 hours

/**
 * Verifies Telegram Mini App initData per official docs:
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 *
 * 1. Parse initData as URLSearchParams
 * 2. Extract `hash` and remove it from the data-check-string
 * 3. Sort remaining key=value pairs alphabetically, join with newlines
 * 4. Compute secret_key = HMAC-SHA256("WebAppData", bot_token)
 * 5. Compute data_hash = HMAC-SHA256(secret_key, data-check-string)
 * 6. Compare data_hash (hex) to hash using timing-safe comparison
 * 7. Reject if auth_date is older than 24 hours
 */
function verifyInitDataSignature(initData: string, botToken: string): TelegramUser {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");

  if (!hash) {
    throw new Error("initData missing hash");
  }

  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  const hashBuffer = Buffer.from(hash, "hex");
  const computedBuffer = Buffer.from(computedHash, "hex");

  if (
    hashBuffer.length !== computedBuffer.length ||
    !crypto.timingSafeEqual(hashBuffer, computedBuffer)
  ) {
    throw new Error("initData signature verification failed");
  }

  const authDate = params.get("auth_date");
  if (!authDate) {
    throw new Error("initData missing auth_date");
  }

  const authTimestamp = parseInt(authDate, 10);
  const now = Math.floor(Date.now() / 1000);
  if (now - authTimestamp > AUTH_DATE_MAX_AGE_SECONDS) {
    throw new Error("initData expired (auth_date too old)");
  }

  const userJson = params.get("user");
  if (!userJson) {
    throw new Error("initData missing user");
  }

  const user = JSON.parse(userJson) as TelegramUser;
  if (!user?.id) {
    throw new Error("initData user missing id");
  }

  return user;
}

/**
 * Resolves Telegram identity from initData, with a dev-only fallback.
 *
 * Production: requires valid initData signed by TELEGRAM_BOT_TOKEN.
 * Development: if initData is missing/invalid AND NODE_ENV !== 'production'
 * AND DEV_TELEGRAM_USER_ID is set, returns a mock user (clearly flagged).
 */
export function verifyTelegramInitData(
  initData: string | null | undefined
): VerifiedTelegramIdentity {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (initData && botToken) {
    try {
      const user = verifyInitDataSignature(initData, botToken);
      return {
        telegramUserId: String(user.id),
        username: user.username ?? null,
        firstName: user.first_name ?? null,
        initData,
        isDevFallback: false,
      };
    } catch (err) {
      if (process.env.NODE_ENV === "production") {
        throw err;
      }
      // Fall through to dev fallback in non-production
    }
  }

  // --- DEVELOPMENT FALLBACK (never used in production) ---
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      initData
        ? "Telegram initData verification failed"
        : "Telegram initData required in production"
    );
  }

  const devUserId = process.env.DEV_TELEGRAM_USER_ID;
  if (!devUserId) {
    throw new Error(
      "No valid initData and DEV_TELEGRAM_USER_ID not set. " +
        "Open the app via Telegram or configure dev env vars."
    );
  }

  return {
    telegramUserId: devUserId,
    username: process.env.DEV_TELEGRAM_USERNAME ?? null,
    firstName: process.env.DEV_TELEGRAM_FIRST_NAME ?? "Dev User",
    initData: null,
    isDevFallback: true,
  };
}
