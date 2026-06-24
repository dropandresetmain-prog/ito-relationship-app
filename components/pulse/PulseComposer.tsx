"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PULSE_CATEGORIES } from "@/lib/scene/pulse-categories";
import type { SceneConnection } from "@/lib/scene/types";
import { sendPulse, type ThreadActionState } from "@/lib/threads/actions";
import type { MessageCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PulseComposerProps {
  connection: SceneConnection;
  threadId: string;
  disabled?: boolean;
  disabledReason?: string;
  onBack: () => void;
  onSent: (categoryId: MessageCategory) => void;
}

const initialState: ThreadActionState = {};

export function PulseComposer({
  connection,
  threadId,
  disabled,
  disabledReason,
  onBack,
  onSent,
}: PulseComposerProps) {
  const [selected, setSelected] = useState<MessageCategory>("loving");
  const [message, setMessage] = useState("");
  const [state, formAction, pending] = useActionState(sendPulse, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const remaining = 140 - message.length;

  useEffect(() => {
    if (state.success) {
      onSent(selected);
    }
  }, [state.success, onSent, selected]);

  const handleSend = () => {
    if (disabled || pending) return;
    formRef.current?.requestSubmit();
  };

  return (
    <div>
      <form ref={formRef} action={formAction} className="hidden">
        <input type="hidden" name="thread_id" value={threadId} />
        <input
          type="hidden"
          name="pulse_mode"
          value={message.trim() ? "custom" : "category"}
        />
        <input type="hidden" name="category" value={selected} />
        <input type="hidden" name="body" value={message.trim()} />
      </form>

      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="font-heading text-base leading-tight text-foreground">
            Send {connection.name} a pulse
          </p>
          <p className="text-xs text-muted-foreground">Pick a feeling. Words are optional.</p>
        </div>
      </div>

      {disabled ? (
        <p className="mb-3 text-sm text-muted-foreground">{disabledReason}</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {PULSE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isOn = selected === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelected(cat.id)}
                  aria-pressed={isOn}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-2xl border px-1 py-2.5 text-center transition-all",
                    isOn
                      ? "border-[var(--thread)] bg-[var(--thread)]/10 text-foreground"
                      : "border-border bg-background/60 text-muted-foreground hover:border-[var(--thread)]/40"
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5", isOn ? "text-[var(--thread)]" : "text-muted-foreground")}
                    strokeWidth={2}
                  />
                  <span className="text-[11px] font-medium leading-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 140))}
                placeholder={PULSE_CATEGORIES.find((c) => c.id === selected)?.line ?? "Add a few words…"}
                rows={2}
                className="w-full resize-none rounded-2xl border border-border bg-background/70 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-[var(--thread)] focus:outline-none"
              />
              <span className="absolute bottom-2 right-3 text-[10px] tabular-nums text-muted-foreground">
                {remaining}
              </span>
            </div>
          </div>

          {state.error ? (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {state.error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={handleSend}
            disabled={pending}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--thread)] py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {pending ? "Sending…" : "Send a pulse"}
          </button>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            A small pulse can mean a lot.
          </p>
        </>
      )}
    </div>
  );
}
