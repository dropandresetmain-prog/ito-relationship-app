import Link from "next/link";
import { MESSAGE_CATEGORY_LABELS } from "@/lib/mock/data";
import { INBOX_TYPE_LABELS } from "@/lib/labels";
import type { InboxItem } from "@/lib/types";

interface NotificationInboxItemProps {
  item: InboxItem;
}

function formatWhen(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function NotificationInboxItem({ item }: NotificationInboxItemProps) {
  const typeLabel = INBOX_TYPE_LABELS[item.type];
  const categoryLabel = item.category
    ? MESSAGE_CATEGORY_LABELS[item.category]
    : null;

  return (
    <Link
      href={`/thread/${item.threadId}`}
      className={`block rounded-2xl border p-4 transition active:scale-[0.99] ${
        item.read
          ? "border-warm-100 bg-white"
          : "border-thread-200 bg-thread-50/40"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-thread-600">
            {typeLabel}
            {categoryLabel ? ` · ${categoryLabel}` : ""}
          </p>
          <h3 className="mt-1 font-semibold text-warm-900">{item.fromName}</h3>
          {item.message ? (
            <p className="mt-1 text-sm text-warm-900/65">{item.message}</p>
          ) : null}
        </div>
        {!item.read ? (
          <span
            className="mt-1 h-2 w-2 shrink-0 rounded-full bg-thread-500"
            aria-label="Unread"
          />
        ) : null}
      </div>
      <p className="mt-3 text-xs text-warm-900/40">{formatWhen(item.createdAt)}</p>
    </Link>
  );
}
