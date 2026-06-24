"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { MessageCategoryPicker } from "@/components/MessageCategoryPicker";
import { PulseButton } from "@/components/PulseButton";
import { sendPulse, type ThreadActionState } from "@/lib/threads/actions";
import type { MessageCategory } from "@/lib/types";

interface ThreadPulseFormProps {
  threadId: string;
  disabled?: boolean;
  disabledReason?: string;
}

const initialState: ThreadActionState = {};

export function ThreadPulseForm({
  threadId,
  disabled,
  disabledReason,
}: ThreadPulseFormProps) {
  const [category, setCategory] = useState<MessageCategory>("loving");
  const [message, setMessage] = useState("");
  const [pulseMode, setPulseMode] = useState<"default" | "category">("category");
  const [state, formAction, pending] = useActionState(sendPulse, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state.success) {
      setShowSuccess(true);
      const timer = window.setTimeout(() => setShowSuccess(false), 2500);
      return () => window.clearTimeout(timer);
    }
  }, [state.success]);

  const handlePulse = () => {
    if (disabled || pending) return;
    formRef.current?.requestSubmit();
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <form ref={formRef} action={formAction} className="hidden">
        <input type="hidden" name="thread_id" value={threadId} />
        <input
          type="hidden"
          name="pulse_mode"
          value={message.trim() ? "custom" : pulseMode}
        />
        <input type="hidden" name="category" value={category} />
        <input type="hidden" name="body" value={message.trim()} />
      </form>

      <PulseButton
        onPulse={handlePulse}
        disabled={disabled}
        sending={pending}
      />

      {disabled && disabledReason ? (
        <p className="text-center text-sm text-warm-900/50">{disabledReason}</p>
      ) : null}

      {state.error ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}

      {showSuccess ? (
        <p className="text-sm font-medium text-thread-600" role="status">
          Pulse sent
        </p>
      ) : null}

      {!disabled ? (
        <div className="w-full space-y-5">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-warm-900/80">
              Pulse type
            </legend>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPulseMode("default")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  pulseMode === "default" && !message.trim()
                    ? "bg-thread-600 text-white"
                    : "bg-warm-100 text-warm-900/70"
                }`}
              >
                Simple pulse
              </button>
              <button
                type="button"
                onClick={() => setPulseMode("category")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  pulseMode === "category" || message.trim()
                    ? "bg-thread-600 text-white"
                    : "bg-warm-100 text-warm-900/70"
                }`}
              >
                With tone
              </button>
            </div>
          </fieldset>

          {pulseMode === "category" || message.trim() ? (
            <MessageCategoryPicker value={category} onChange={setCategory} />
          ) : null}

          <label className="block text-sm font-medium text-warm-900/80">
            Optional note
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 140))}
              placeholder="A few gentle words…"
              rows={3}
              maxLength={140}
              className="mt-2 w-full resize-none rounded-xl border border-warm-100 bg-white px-4 py-3 text-sm focus:border-thread-300 focus:outline-none focus:ring-2 focus:ring-thread-100"
            />
            <span className="mt-1 block text-right text-xs text-warm-900/40">
              {message.length}/140
            </span>
          </label>
        </div>
      ) : null}
    </div>
  );
}
