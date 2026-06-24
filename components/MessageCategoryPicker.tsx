"use client";

import { MESSAGE_CATEGORY_LABELS } from "@/lib/mock/data";
import type { MessageCategory } from "@/lib/types";

const CATEGORIES = Object.keys(MESSAGE_CATEGORY_LABELS) as MessageCategory[];

interface MessageCategoryPickerProps {
  value: MessageCategory;
  onChange: (category: MessageCategory) => void;
}

export function MessageCategoryPicker({
  value,
  onChange,
}: MessageCategoryPickerProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-warm-900/80">
        Message tone
      </legend>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const selected = value === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onChange(category)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                selected
                  ? "bg-thread-600 text-white"
                  : "bg-warm-100 text-warm-900/70 hover:bg-warm-100/80"
              }`}
              aria-pressed={selected}
            >
              {MESSAGE_CATEGORY_LABELS[category]}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
