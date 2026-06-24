"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { createThread, type ThreadActionState } from "@/lib/threads/actions";
import { RELATIONSHIP_MODES, RELATIONSHIP_MODE_LABELS } from "@/lib/constants";
import {
  itoAlertErrorClass,
  itoButtonPrimaryClass,
  itoInputClass,
  itoLabelClass,
  itoSelectClass,
} from "@/lib/ito-ui";

const initialState: ThreadActionState = {};

export function CreateThreadForm() {
  const [state, action, pending] = useActionState(createThread, initialState);

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className={itoLabelClass}>
        Their name (optional label for you)
        <input
          type="text"
          name="display_name_override"
          placeholder="Mum, Clare, Alex…"
          className={itoInputClass}
        />
      </label>

      <label className={itoLabelClass}>
        Thread title (optional)
        <input
          type="text"
          name="title"
          placeholder="A name for this thread"
          className={itoInputClass}
        />
      </label>

      <label className={itoLabelClass}>
        Choose who this thread is for
        <select
          name="relationship_mode"
          required
          defaultValue="general"
          className={itoSelectClass}
        >
          {RELATIONSHIP_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {RELATIONSHIP_MODE_LABELS[mode]}
            </option>
          ))}
        </select>
      </label>

      {state.error ? (
        <p className={itoAlertErrorClass} role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={itoButtonPrimaryClass}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Tying thread…
          </>
        ) : (
          "Tie a thread"
        )}
      </button>
    </form>
  );
}
