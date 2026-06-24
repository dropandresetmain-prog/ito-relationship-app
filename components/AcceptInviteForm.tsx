"use client";

import { useActionState } from "react";
import Link from "next/link";
import { acceptThreadInvite, type ThreadActionState } from "@/lib/threads/actions";
import { RELATIONSHIP_MODE_LABELS } from "@/lib/constants";
import type { InvitePreview } from "@/lib/types";

interface AcceptInviteFormProps {
  code: string;
  preview: InvitePreview;
  isLoggedIn: boolean;
  hasProfile: boolean;
}

const initialState: ThreadActionState = {};

export function AcceptInviteForm({
  code,
  preview,
  isLoggedIn,
  hasProfile,
}: AcceptInviteFormProps) {
  const [state, action, pending] = useActionState(acceptThreadInvite, initialState);
  const modeLabel = RELATIONSHIP_MODE_LABELS[preview.relationship_mode];
  const isFull = preview.member_count >= 2;
  const redirect = `/invite/${code}`;

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-warm-900/60">
          <strong>{preview.inviter_name}</strong> wants to tie a{" "}
          <span className="text-thread-600">{modeLabel}</span> thread with you.
        </p>
        <Link
          href={`/auth?redirect=${encodeURIComponent(redirect)}`}
          className="rounded-xl bg-thread-600 py-3.5 text-center text-sm font-medium text-white"
        >
          Sign in to accept
        </Link>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-warm-900/60">
          Set up your tree first, then you can accept this thread.
        </p>
        <Link
          href={`/onboarding?redirect=${encodeURIComponent(redirect)}`}
          className="rounded-xl bg-thread-600 py-3.5 text-center text-sm font-medium text-white"
        >
          Plant your tree
        </Link>
      </div>
    );
  }

  if (isFull) {
    return (
      <p className="text-sm text-warm-900/60">
        This thread already has two members and cannot accept more invites in M1.
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="invite_code" value={code} />
      <p className="text-sm text-warm-900/60">
        <strong>{preview.inviter_name}</strong> invited you to a{" "}
        <span className="text-thread-600">{modeLabel}</span> thread.
      </p>

      {state.error ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-thread-600 py-3.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Tying thread…" : "Accept thread"}
      </button>
      <Link
        href="/threads"
        className="rounded-xl border border-warm-100 py-3.5 text-center text-sm font-medium text-thread-600"
      >
        Not now
      </Link>
    </form>
  );
}
