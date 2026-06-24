"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppUser, CoupleStatus } from "@/lib/couples";

export interface MeResponse {
  user: AppUser;
  coupleStatus: CoupleStatus;
  isDevFallback: boolean;
}

export function useTelegramApp() {
  const [initData, setInitData] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      document.body.style.backgroundColor = tg.themeParams.bg_color ?? "#fdf8f6";
      setInitData(tg.initData ?? "");
    }
    setReady(true);
  }, []);

  const apiFetch = useCallback(
    async (path: string, body: Record<string, unknown> = {}) => {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData, ...body }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? `Request failed (${response.status})`);
      }

      return data;
    },
    [initData]
  );

  return { initData, ready, apiFetch };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        ready: () => void;
        expand: () => void;
        themeParams: {
          bg_color?: string;
          text_color?: string;
          button_color?: string;
        };
        HapticFeedback?: {
          impactOccurred: (style: "light" | "medium" | "heavy") => void;
        };
      };
    };
  }
}
