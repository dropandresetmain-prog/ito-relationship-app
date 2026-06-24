"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { RELATIONSHIP_MODE_LABELS } from "@/lib/constants";
import { LIVING_TREE } from "@/lib/scene/living-tree";
import type { SceneConnection, TimeOfDay } from "@/lib/scene/types";
import type { MessageCategory, ThreadStatus } from "@/lib/types";
import { PulseComposer } from "@/components/pulse/PulseComposer";
import { BottomSheet } from "./BottomSheet";
import { SceneInboxButton } from "./SceneInboxButton";
import { SceneShell } from "./SceneShell";
import { ThreadLayer } from "./ThreadLayer";

type View = "relationship" | "send" | "sent";

interface LivingTreeSceneProps {
  connection: SceneConnection;
  threadId: string;
  relationshipMode: string;
  relationLabel: string;
  status: ThreadStatus;
  inviteCode?: string;
  time: TimeOfDay;
  unreadCount: number;
  isActive: boolean;
}

export function LivingTreeScene({
  connection,
  threadId,
  relationshipMode,
  relationLabel,
  status,
  inviteCode,
  time,
  unreadCount,
  isActive,
}: LivingTreeSceneProps) {
  const router = useRouter();
  const [view, setView] = useState<View>("relationship");
  const [pulsing, setPulsing] = useState<{ id: string; key: number } | null>(null);
  const [sentCategory, setSentCategory] = useState<string>("");
  const pulseCounter = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const handleSent = useCallback(
    (categoryId: MessageCategory) => {
      pulseCounter.current += 1;
      setPulsing({ id: connection.id, key: pulseCounter.current });
      setSentCategory(categoryId.replace(/_/g, " "));
      setView("sent");
      const t = setTimeout(() => setPulsing(null), 1900);
      timers.current.push(t);
    },
    [connection.id]
  );

  const modeLabel = RELATIONSHIP_MODE_LABELS[relationshipMode as keyof typeof RELATIONSHIP_MODE_LABELS] ?? relationLabel;
  const prompt =
    relationshipMode === "clare" || relationshipMode === "romantic"
      ? `${connection.name} crossed your mind?`
      : `Send ${connection.name} a little warmth?`;

  return (
    <SceneShell
      config={LIVING_TREE}
      time={time}
      headerRight={<SceneInboxButton unreadCount={unreadCount} />}
    >
      <ThreadLayer
        connections={[connection]}
        treeAnchor={LIVING_TREE.treeAnchor}
        selectedId={connection.id}
        pulsingId={pulsing?.id ?? null}
        pulseKey={pulsing?.key}
        onSelect={() => setView("relationship")}
      />

      <button
        type="button"
        onClick={() => router.push("/")}
        className="absolute left-5 top-[4.5rem] z-20 text-xs font-medium text-foreground/70 hover:text-foreground safe-area-top"
      >
        ← Garden
      </button>

      {view === "relationship" ? (
        <BottomSheet sheetKey={`rel-${threadId}`}>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-heading text-lg leading-tight text-foreground">
                  {connection.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {modeLabel} · {connection.lastPulse}
                </p>
              </div>
            </div>

            {status === "pending" && inviteCode ? (
              <div className="mb-3 rounded-2xl border border-border bg-background/60 px-3 py-2.5 text-sm text-muted-foreground">
                <p>Waiting for someone to accept your invite.</p>
                <p className="mt-1 font-mono text-xs text-foreground">Code: {inviteCode}</p>
              </div>
            ) : null}

            <p className="mb-3 text-pretty text-sm text-foreground/80">{prompt}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setView("send")}
                disabled={!isActive}
                className="flex flex-[2] items-center justify-center gap-2 rounded-full bg-[var(--thread)] py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Send a pulse
              </button>
              <Link
                href="/threads"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border bg-background/60 py-3 text-xs font-medium text-foreground"
              >
                All threads
              </Link>
            </div>
            {!isActive ? (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Send a pulse once this thread is tied with another person.
              </p>
            ) : null}
          </div>
        </BottomSheet>
      ) : null}

      {view === "send" ? (
        <BottomSheet sheetKey={`send-${threadId}`}>
          <PulseComposer
            connection={connection}
            threadId={threadId}
            disabled={!isActive}
            disabledReason="Send a pulse once this thread is tied with another person."
            onBack={() => setView("relationship")}
            onSent={handleSent}
          />
        </BottomSheet>
      ) : null}

      {view === "sent" ? (
        <BottomSheet sheetKey={`sent-${threadId}-${pulseCounter.current}`}>
          <div className="py-2 text-center">
            <span className="animate-breathe mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--thread)]/15">
              <Send className="h-5 w-5 text-[var(--thread)]" />
            </span>
            <p className="font-heading text-lg text-foreground">Your pulse is on its way.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              A {sentCategory} glow is travelling the thread to {connection.name}.
            </p>
            <button
              type="button"
              onClick={() => setView("relationship")}
              className="mt-4 rounded-full border border-border bg-background/60 px-6 py-2 text-sm font-medium text-foreground"
            >
              Done
            </button>
          </div>
        </BottomSheet>
      ) : null}
    </SceneShell>
  );
}
