"use client";

import { signOut } from "@/lib/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="w-full rounded-xl border border-warm-100 py-3 text-sm font-medium text-thread-600"
      >
        Log out
      </button>
    </form>
  );
}
