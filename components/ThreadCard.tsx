import Link from "next/link";
import { RELATIONSHIP_MODE_LABELS } from "@/lib/constants";
import type { ThreadListItem } from "@/lib/types";
import { itoCardClass } from "@/lib/ito-ui";
import { cn } from "@/lib/utils";

interface ThreadCardProps {
  thread: ThreadListItem;
}

export function ThreadCard({ thread }: ThreadCardProps) {
  const modeLabel = RELATIONSHIP_MODE_LABELS[thread.relationshipMode];

  return (
    <Link
      href={`/thread/${thread.id}`}
      className={cn(
        itoCardClass,
        "block transition-transform active:scale-[0.99] hover:border-[var(--thread)]/30"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--thread)]">
            {modeLabel}
          </p>
          <h3 className="font-heading mt-0.5 text-lg font-semibold text-foreground">
            {thread.title}
          </h3>
          {thread.reminderPrompt ? (
            <p className="mt-2 text-sm text-muted-foreground">{thread.reminderPrompt}</p>
          ) : null}
        </div>
        <span
          className="rounded-full bg-[var(--thread)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--thread)]"
          aria-label={thread.isActive ? "Thread active" : "Awaiting tie"}
        >
          {thread.isActive ? "Tied" : "Pending"}
        </span>
      </div>
      {thread.lastPulseAt ? (
        <p className="mt-3 text-xs text-muted-foreground/80">
          Last pulse · {thread.lastPulseAt}
        </p>
      ) : null}
    </Link>
  );
}
