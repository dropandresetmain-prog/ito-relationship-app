"use client";

import { signOut } from "@/lib/auth/actions";
import { itoButtonSecondaryClass } from "@/lib/ito-ui";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className={itoButtonSecondaryClass}>
        Log out
      </button>
    </form>
  );
}
