"use client";

import { useEffect, useState } from "react";
import { HomeScreen } from "@/components/HomeScreen";
import { PairingScreen } from "@/components/PairingScreen";
import { useTelegramApp, type MeResponse } from "@/lib/hooks/use-telegram-app";

export default function AppPage() {
  const { ready, apiFetch } = useTelegramApp();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;

    let cancelled = false;

    async function load() {
      try {
        const data = (await apiFetch("/api/me")) as MeResponse;
        if (!cancelled) setMe(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [ready, apiFetch]);

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <p className="text-sm text-warm-900/50">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-6">
        <p className="text-center text-sm text-red-500">{error}</p>
        {process.env.NODE_ENV !== "production" && (
          <p className="text-center text-xs text-warm-900/40">
            Dev tip: set DEV_TELEGRAM_USER_ID in .env.local
          </p>
        )}
      </div>
    );
  }

  if (!me) return null;

  const { user, coupleStatus, isDevFallback } = me;

  if (!coupleStatus.couple) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center">
        {isDevFallback && (
          <p className="mb-4 rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">
            Dev mode — mock Telegram user
          </p>
        )}
        <PairingScreen />
      </div>
    );
  }

  return (
    <>
      {isDevFallback && (
        <div className="absolute left-0 right-0 top-0 z-10 bg-amber-100 px-3 py-1 text-center text-xs text-amber-700">
          Dev mode — mock Telegram user
        </div>
      )}
      <HomeScreen
        user={user}
        partner={coupleStatus.partner}
        isPaired={coupleStatus.isPaired}
        inviteCode={coupleStatus.couple.invite_code}
      />
    </>
  );
}
