"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { saveProfile, type ProfileState } from "@/lib/profile/actions";
import {
  itoAlertErrorClass,
  itoButtonPrimaryClass,
  itoInputClass,
  itoLabelClass,
} from "@/lib/ito-ui";

const initialState: ProfileState = {};

export function ProfileForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const [state, action, pending] = useActionState(saveProfile, initialState);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="redirect" value={redirect} />
      <p className="text-sm text-muted-foreground">
        How should people see you on Ito?
      </p>

      <label className={itoLabelClass}>
        Display name
        <input
          type="text"
          name="display_name"
          required
          maxLength={80}
          placeholder="Your name"
          autoFocus
          className={itoInputClass}
        />
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
            Saving…
          </>
        ) : (
          "Plant your tree"
        )}
      </button>
    </form>
  );
}
