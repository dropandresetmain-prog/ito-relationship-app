"use client";

import { useActionState } from "react";
import { createThread, type ThreadActionState } from "@/lib/threads/actions";
import { RELATIONSHIP_MODES, RELATIONSHIP_MODE_LABELS } from "@/lib/constants";

const initialState: ThreadActionState = {};

export function CreateThreadForm() {
  const [state, action, pending] = useActionState(createThread, initialState);

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="text-sm font-medium text-warm-900/80">
        Their name (optional label for you)
        <input
          type="text"
          name="display_name_override"
          placeholder="Mum, Clare, Alex…"
          className="mt-2 w-full rounded-xl border border-warm-100 bg-white px-4 py-3 text-sm focus:border-thread-300 focus:outline-none focus:ring-2 focus:ring-thread-100"
        />
      </label>

      <label className="text-sm font-medium text-warm-900/80">
        Thread title (optional)
        <input
          type="text"
          name="title"
          placeholder="A name for this thread"
          className="mt-2 w-full rounded-xl border border-warm-100 bg-white px-4 py-3 text-sm focus:border-thread-300 focus:outline-none focus:ring-2 focus:ring-thread-100"
        />
      </label>

      <label className="text-sm font-medium text-warm-900/80">
        Relationship mode
        <select
          name="relationship_mode"
          required
          defaultValue="general"
          className="mt-2 w-full rounded-xl border border-warm-100 bg-white px-4 py-3 text-sm focus:border-thread-300 focus:outline-none focus:ring-2 focus:ring-thread-100"
        >
          {RELATIONSHIP_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {RELATIONSHIP_MODE_LABELS[mode]}
            </option>
          ))}
        </select>
      </label>

      {state.error ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-thread-600 py-3.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Creating…" : "Tie a thread"}
      </button>
    </form>
  );
}
