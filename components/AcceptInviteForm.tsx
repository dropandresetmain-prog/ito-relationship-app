"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { acceptThreadInvite, type ThreadActionState } from "@/lib/threads/actions";
import { RELATIONSHIP_MODE_LABELS } from "@/lib/constants";
import type { InvitePreview } from "@/lib/types";
import {
  itoAlertErrorClass,
  itoButtonPrimaryClass,
  itoButtonSecondaryClass,
} from "@/lib/ito-ui";
import { cn } from "@/lib/utils";

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
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">{preview.inviter_name}</strong> wants to tie a{" "}
          <span className="text-[var(--thread)]">{modeLabel}</span> thread with you.
        </p>
        <Link href={`/auth?redirect=${encodeURIComponent(redirect)}`} className={itoButtonPrimaryClass}>
          Sign in to accept
        </Link>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Create your Ito profile first, then you can accept this thread.
        </p>
        <Link
          href={`/onboarding?redirect=${encodeURIComponent(redirect)}`}
          className={itoButtonPrimaryClass}
        >
          Create your Ito profile
        </Link>
      </div>
    );
  }

  if (isFull) {
    return (
      <p className="text-sm text-muted-foreground">
        This thread already has two members. M1 supports one-to-one threads only.
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="invite_code" value={code} />
      <p className="text-sm text-muted-foreground">
        <strong className="text-foreground">{preview.inviter_name}</strong> invited you to a{" "}
        <span className="text-[var(--thread)]">{modeLabel}</span> thread.
      </p>

      {state.error ? (
        <p className={itoAlertErrorClass} role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={itoButtonPrimaryClass}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Tying thread…
          </>
        ) : (
          "Accept thread"
        )}
      </button>
      <Link href="/threads" className={cn(itoButtonSecondaryClass)}>
        Not now
      </Link>
    </form>
  );
}
