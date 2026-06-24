"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SceneConnection, TimeOfDay } from "@/lib/scene/types";
import { THREAD_GARDEN } from "@/lib/scene/thread-garden";
import { itoButtonPrimaryClass } from "@/lib/ito-ui";
import { cn } from "@/lib/utils";
import { BottomSheet } from "./BottomSheet";
import { SceneInboxButton } from "./SceneInboxButton";
import { SceneShell } from "./SceneShell";
import { ThreadLayer } from "./ThreadLayer";

interface ThreadGardenHomeProps {
  connections: SceneConnection[];
  time: TimeOfDay;
  unreadCount: number;
  profileName: string;
}

export function ThreadGardenHome({
  connections,
  time,
  unreadCount,
  profileName,
}: ThreadGardenHomeProps) {
  const router = useRouter();
  const hasThreads = connections.length > 0;

  return (
    <SceneShell
      config={THREAD_GARDEN}
      time={time}
      greeting={profileName ? `Welcome back, ${profileName.split(" ")[0]}` : undefined}
      headerRight={<SceneInboxButton unreadCount={unreadCount} />}
    >
      {hasThreads ? (
        <ThreadLayer
          connections={connections}
          treeAnchor={THREAD_GARDEN.treeAnchor}
          onSelect={(id) => router.push(`/thread/${id}`)}
        />
      ) : (
        <div className="pointer-events-none absolute inset-x-6 top-[36%] z-10 text-center">
          <p className="font-heading text-lg font-semibold leading-snug text-shadow-soft text-foreground">
            Your tree is waiting for its first thread.
          </p>
        </div>
      )}

      <BottomSheet sheetKey="home">
        {hasThreads ? (
          <HomeSheet connections={connections} onOpen={(id) => router.push(`/thread/${id}`)} />
        ) : (
          <EmptyHomeSheet />
        )}
      </BottomSheet>
    </SceneShell>
  );
}

function HomeSheet({
  connections,
  onOpen,
}: {
  connections: SceneConnection[];
  onOpen: (id: string) => void;
}) {
  const count = connections.length;
  const label =
    count === 1
      ? "One thread is tied to your tree."
      : `${count} threads are tied to your tree.`;

  return (
    <div>
      <p className="font-heading text-base leading-tight text-foreground">{label}</p>
      <p className="mb-3 text-xs text-muted-foreground">Tap a thread to send a pulse.</p>
      <div className="flex items-stretch gap-2">
        {connections.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onOpen(c.id)}
              className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl border border-border bg-background/60 px-2 py-3 transition-colors hover:border-[var(--thread)]/50"
            >
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[var(--thread)]/10">
                <Icon
                  className={cn(
                    "h-4 w-4",
                    c.mode === "romantic" ? "text-[var(--thread)]" : "text-accent-foreground"
                  )}
                />
                {c.hasArrived ? (
                  <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-[var(--thread-glow)] shadow-[0_0_6px_var(--thread-glow)]" />
                ) : null}
              </span>
              <span className="text-[13px] font-semibold text-foreground">{c.name}</span>
              <span className="text-pretty text-center text-[10px] leading-tight text-muted-foreground">
                {c.lastPulse}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EmptyHomeSheet() {
  return (
    <div className="text-center">
      <p className="font-heading text-base leading-tight text-foreground">
        Your tree is waiting for its first thread.
      </p>
      <p className="mb-4 text-xs text-muted-foreground">
        Tie your first thread to someone who matters.
      </p>
      <Link href="/threads/new" className={itoButtonPrimaryClass}>
        Tie a thread
      </Link>
    </div>
  );
}
