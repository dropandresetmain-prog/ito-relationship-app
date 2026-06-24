"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { saveProfile, type ProfileState } from "@/lib/profile/actions";

const initialState: ProfileState = {};

export function ProfileForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const [state, action, pending] = useActionState(saveProfile, initialState);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="redirect" value={redirect} />
      <p className="text-sm text-warm-900/60">
        Your tree needs a name — how should people see you on Ito?
      </p>

      <label className="text-sm font-medium text-warm-900/80">
        Display name
        <input
          type="text"
          name="display_name"
          required
          maxLength={80}
          placeholder="Your name"
          autoFocus
          className="mt-2 w-full rounded-xl border border-warm-100 bg-white px-4 py-3 text-sm focus:border-thread-300 focus:outline-none focus:ring-2 focus:ring-thread-100"
        />
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
        {pending ? "Saving…" : "Plant your tree"}
      </button>
    </form>
  );
}
