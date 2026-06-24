"use client";

import { useState } from "react";

interface CopyInviteLinkProps {
  code: string;
}

export function CopyInviteLink({ code }: CopyInviteLinkProps) {
  const [copied, setCopied] = useState(false);
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const link = `${origin}/invite/${code}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-2xl border border-thread-100 bg-white p-4 text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-thread-600">
        Invite code
      </p>
      <p className="mt-2 text-2xl font-bold tracking-widest text-thread-700">
        {code}
      </p>
      <p className="mt-3 break-all text-xs text-warm-900/50">{link}</p>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-4 w-full rounded-xl border border-thread-200 py-2.5 text-sm font-medium text-thread-600"
      >
        {copied ? "Copied!" : "Copy invite link"}
      </button>
    </div>
  );
}
