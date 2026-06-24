import Link from "next/link";
import { RELATIONSHIP_MODE_LABELS } from "@/lib/constants";
import type { ThreadListItem } from "@/lib/types";

interface ThreadCardProps {
  thread: ThreadListItem;
}

export function ThreadCard({ thread }: ThreadCardProps) {
  const modeLabel = RELATIONSHIP_MODE_LABELS[thread.relationshipMode];

  return (
    <Link
      href={`/thread/${thread.id}`}
      className="block rounded-2xl border border-warm-100 bg-white p-4 shadow-sm transition active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-thread-600">{modeLabel}</p>
          <h3 className="mt-0.5 text-lg font-semibold text-warm-900">
            {thread.title}
          </h3>
          {thread.reminderPrompt ? (
            <p className="mt-2 text-sm text-warm-900/55">
              {thread.reminderPrompt}
            </p>
          ) : null}
        </div>
        <span
          className="rounded-full bg-thread-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-thread-700"
          aria-label={thread.isActive ? "Thread active" : "Awaiting tie"}
        >
          {thread.isActive ? "Tied" : "Pending"}
        </span>
      </div>
      {thread.lastPulseAt ? (
        <p className="mt-3 text-xs text-warm-900/40">
          Last pulse · {thread.lastPulseAt}
        </p>
      ) : null}
    </Link>
  );
}
