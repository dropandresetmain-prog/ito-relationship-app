"use client";

import { useState } from "react";
import { ThinkingButton } from "@/components/ThinkingButton";
import { PlaceholderAction } from "@/components/PlaceholderAction";
import { useTelegramApp } from "@/lib/hooks/use-telegram-app";
import type { AppUser } from "@/lib/couples";

interface HomeScreenProps {
  user: AppUser;
  partner: AppUser | null;
  isPaired: boolean;
  inviteCode?: string;
}

export function HomeScreen({ user, partner, isPaired, inviteCode }: HomeScreenProps) {
  const { apiFetch } = useTelegramApp();
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTap = async () => {
    if (!isPaired) return;

    setSending(true);
    setFeedback(null);
    setError(null);

    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("medium");

    try {
      const data = await apiFetch("/api/touches/send");

      if (data.warning) {
        setFeedback(data.warning);
      } else {
        setFeedback("Sent 💕");
      }

      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const partnerName =
    partner?.first_name ?? partner?.telegram_username ?? "your partner";

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="px-6 pt-8 text-center">
        <p className="text-sm text-warm-900/50">Hi, {user.first_name ?? "there"}</p>
        {isPaired ? (
          <h1 className="mt-1 text-lg font-medium text-warm-900">
            Connected with {partnerName}
          </h1>
        ) : (
          <h1 className="mt-1 text-lg font-medium text-warm-900">
            Waiting for partner…
          </h1>
        )}
        {!isPaired && inviteCode && (
          <p className="mt-3 text-sm text-warm-900/60">
            Share code:{" "}
            <span className="font-bold tracking-widest text-blush-500">{inviteCode}</span>
          </p>
        )}
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <ThinkingButton
          onTap={handleTap}
          disabled={!isPaired}
          sending={sending}
        />

        {feedback && (
          <p className="mt-6 text-sm font-medium text-blush-500">{feedback}</p>
        )}
        {error && (
          <p className="mt-6 text-sm text-red-500">{error}</p>
        )}
        {!isPaired && (
          <p className="mt-6 max-w-xs text-center text-sm text-warm-900/50">
            Your partner needs to join before you can send touches
          </p>
        )}
      </main>

      <footer className="flex gap-3 px-6 pb-8 pt-4">
        <PlaceholderAction label="Locked Note" icon="🔒" />
        <PlaceholderAction label="Locked Photo" icon="📷" />
      </footer>
    </div>
  );
}
