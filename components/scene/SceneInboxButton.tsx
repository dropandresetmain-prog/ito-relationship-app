"use client";

import Link from "next/link";
import { Inbox as InboxIcon } from "lucide-react";

interface SceneInboxButtonProps {
  unreadCount: number;
}

export function SceneInboxButton({ unreadCount }: SceneInboxButtonProps) {
  return (
    <Link
      href="/inbox"
      aria-label={
        unreadCount > 0
          ? `Open your pulses, ${unreadCount} unread`
          : "Open your pulses"
      }
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card/80 text-foreground backdrop-blur-sm paper-shadow"
    >
      <InboxIcon className="h-5 w-5" />
      {unreadCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[var(--thread)] ring-2 ring-card" />
      ) : null}
    </Link>
  );
}
