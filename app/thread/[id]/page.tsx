"use client";

import { use, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { MessageCategoryPicker } from "@/components/MessageCategoryPicker";
import { PulseButton } from "@/components/PulseButton";
import { ReactionPicker } from "@/components/ReactionPicker";
import { mockThreads } from "@/lib/mock/data";
import type { MessageCategory, ReactionKind } from "@/lib/types";

interface ThreadPageProps {
  params: Promise<{ id: string }>;
}

export default function ThreadPage({ params }: ThreadPageProps) {
  const { id } = use(params);
  const thread = mockThreads.find((item) => item.id === id) ?? mockThreads[0];

  const [category, setCategory] = useState<MessageCategory>("loving");
  const [message, setMessage] = useState("");
  const [reaction, setReaction] = useState<ReactionKind | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handlePulse = () => {
    setSending(true);
    setFeedback(null);
    window.setTimeout(() => {
      setSending(false);
      setFeedback("Pulse sent (mock)");
      window.setTimeout(() => setFeedback(null), 2500);
    }, 600);
  };

  return (
    <AppShell title={thread.name} backHref="/threads" showNav={false}>
      <div className="flex flex-col items-center gap-6">
        {thread.reminderPrompt ? (
          <p className="text-center text-sm text-warm-900/60">
            {thread.reminderPrompt}
          </p>
        ) : (
          <p className="text-center text-sm text-warm-900/60">
            A small pulse can mean a lot.
          </p>
        )}

        <PulseButton onPulse={handlePulse} sending={sending} />

        {feedback ? (
          <p className="text-sm font-medium text-thread-600">{feedback}</p>
        ) : null}

        <div className="w-full space-y-5">
          <MessageCategoryPicker value={category} onChange={setCategory} />

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

          <ReactionPicker value={reaction} onChange={setReaction} />
        </div>
      </div>
    </AppShell>
  );
}
