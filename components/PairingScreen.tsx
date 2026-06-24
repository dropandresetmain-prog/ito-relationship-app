"use client";

import { useState } from "react";
import { useTelegramApp } from "@/lib/hooks/use-telegram-app";

export function PairingScreen() {
  const { apiFetch } = useTelegramApp();
  const [mode, setMode] = useState<"choose" | "join">("choose");
  const [inviteCode, setInviteCode] = useState("");
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/api/couples/create");
      setCreatedCode(data.couple.invite_code);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiFetch("/api/couples/join", { inviteCode });
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join");
    } finally {
      setLoading(false);
    }
  };

  if (createdCode) {
    return (
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        <p className="text-sm text-warm-900/70">Share this code with your partner:</p>
        <p className="text-3xl font-bold tracking-widest text-blush-500">{createdCode}</p>
        <p className="text-xs text-warm-900/50">Waiting for them to join…</p>
      </div>
    );
  }

  if (mode === "join") {
    return (
      <div className="flex w-full max-w-sm flex-col gap-4 px-6">
        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-warm-900/80">
            Enter invite code
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={6}
              className="mt-2 w-full rounded-xl border border-blush-200 bg-white px-4 py-3
                text-center text-lg tracking-widest uppercase
                focus:border-blush-400 focus:outline-none focus:ring-2 focus:ring-blush-100"
              autoComplete="off"
              autoFocus
            />
          </label>
          <button
            type="submit"
            disabled={loading || inviteCode.length < 4}
            className="rounded-xl bg-blush-500 py-3 font-medium text-white
              transition active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Joining…" : "Join"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setMode("choose")}
          className="text-sm text-blush-500"
        >
          ← Back
        </button>
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6 px-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-warm-900">Connect</h1>
        <p className="mt-2 text-sm text-warm-900/60">
          Pair with your partner to start sending touches
        </p>
      </div>

      <button
        type="button"
        onClick={handleCreate}
        disabled={loading}
        className="w-full rounded-xl bg-blush-500 py-4 font-medium text-white
          shadow-lg shadow-blush-200 transition active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? "Creating…" : "Create invite code"}
      </button>

      <button
        type="button"
        onClick={() => setMode("join")}
        className="w-full rounded-xl border border-blush-200 bg-white py-4
          font-medium text-blush-600 transition active:scale-[0.98]"
      >
        Join with code
      </button>

      {error && <p className="text-center text-sm text-red-500">{error}</p>}
    </div>
  );
}
