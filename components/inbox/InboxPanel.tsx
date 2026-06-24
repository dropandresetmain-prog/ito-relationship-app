"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MESSAGE_CATEGORY_LABELS } from "@/lib/constants";
import {
  formatInboxWhen,
  iconForMessageCategory,
} from "@/lib/scene/map-threads";
import type { InboxPulseItem } from "@/lib/types";
import { itoIconButtonClass } from "@/lib/ito-ui";

interface InboxPanelProps {
  items: InboxPulseItem[];
  backHref?: string;
  onBack?: () => void;
}

export function InboxPanel({ items, backHref = "/", onBack }: InboxPanelProps) {
  const BackControl = backHref ? (
    <Link
      href={backHref}
      aria-label="Back"
      className={itoIconButtonClass}
    >
      <ArrowLeft className="h-4 w-4" />
    </Link>
  ) : (
    <button
      type="button"
      onClick={onBack}
      aria-label="Back"
      className={itoIconButtonClass}
    >
      <ArrowLeft className="h-4 w-4" />
    </button>
  );

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        {BackControl}
        <div>
          <p className="font-heading text-base leading-tight text-foreground">Pulses</p>
          <p className="text-xs text-muted-foreground">What arrived along your threads</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-background/50 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">No pulses yet.</p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            When someone sends you a pulse, it will appear here.
          </p>
        </div>
      ) : (
        <ul className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
          {items.map((p) => {
            const Icon = iconForMessageCategory(p.category);
            const categoryLabel = p.category
              ? MESSAGE_CATEGORY_LABELS[p.category]
              : "Pulse";
            return (
              <li key={p.id}>
                <Link
                  href={`/thread/${p.threadId}`}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-background/60 px-3 py-2.5 transition-colors hover:border-[var(--thread)]/40"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--thread)]/10">
                    <Icon className="h-4 w-4 text-[var(--thread)]" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {p.fromName}
                        <span className="ml-2 font-normal text-muted-foreground">
                          {categoryLabel}
                        </span>
                      </p>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {formatInboxWhen(p.createdAt)}
                      </span>
                    </div>
                    {p.body ? (
                      <p className="mt-0.5 text-pretty text-[13px] leading-snug text-foreground/80">
                        {p.body}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-[13px] italic leading-snug text-muted-foreground">
                        A wordless pulse.
                      </p>
                    )}
                  </div>
                  {!p.read ? (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--thread)]" />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
