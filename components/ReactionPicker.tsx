"use client";

import { REACTION_LABELS } from "@/lib/labels";
import type { ReactionKind } from "@/lib/types";

const REACTIONS = Object.keys(REACTION_LABELS) as ReactionKind[];

const REACTION_ICONS: Record<ReactionKind, string> = {
  warmth: "🤍",
  smile: "😊",
  hug: "🫂",
  spark: "✨",
  bloom: "🌸",
};

interface ReactionPickerProps {
  value?: ReactionKind | null;
  onChange?: (reaction: ReactionKind) => void;
}

export function ReactionPicker({ value, onChange }: ReactionPickerProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-warm-900/80">
        Send a reaction
      </legend>
      <div className="flex flex-wrap gap-2">
        {REACTIONS.map((reaction) => {
          const selected = value === reaction;
          return (
            <button
              key={reaction}
              type="button"
              onClick={() => onChange?.(reaction)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition ${
                selected
                  ? "bg-thread-600 text-white"
                  : "bg-warm-100 text-warm-900/70"
              }`}
              aria-pressed={selected}
            >
              <span aria-hidden>{REACTION_ICONS[reaction]}</span>
              {REACTION_LABELS[reaction]}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
