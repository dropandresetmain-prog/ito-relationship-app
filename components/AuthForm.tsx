"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  signInWithEmail,
  signInWithMagicLink,
  signUpWithEmail,
  type AuthState,
} from "@/lib/auth/actions";

type AuthTab = "login" | "signup" | "magic";

const initialState: AuthState = {};

export function AuthForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const [tab, setTab] = useState<AuthTab>("login");

  const [loginState, loginAction, loginPending] = useActionState(
    signInWithEmail,
    initialState
  );
  const [signupState, signupAction, signupPending] = useActionState(
    signUpWithEmail,
    initialState
  );
  const [magicState, magicAction, magicPending] = useActionState(
    signInWithMagicLink,
    initialState
  );

  const state =
    tab === "login" ? loginState : tab === "signup" ? signupState : magicState;
  const pending =
    tab === "login" ? loginPending : tab === "signup" ? signupPending : magicPending;
  const action =
    tab === "login" ? loginAction : tab === "signup" ? signupAction : magicAction;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <p className="text-3xl" aria-hidden>
          🧵
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-warm-900">Ito</h1>
        <p className="mt-2 text-sm text-warm-900/60">
          Tie private threads. Send a pulse when someone crosses your mind.
        </p>
      </div>

      <div className="flex rounded-xl bg-warm-100 p-1">
        {(
          [
            ["login", "Log in"],
            ["signup", "Sign up"],
            ["magic", "Magic link"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex-1 rounded-lg py-2 text-xs font-medium transition ${
              tab === key
                ? "bg-white text-thread-700 shadow-sm"
                : "text-warm-900/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="redirect" value={redirect} />

        <label className="text-sm font-medium text-warm-900/80">
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="mt-2 w-full rounded-xl border border-warm-100 bg-white px-4 py-3 text-sm focus:border-thread-300 focus:outline-none focus:ring-2 focus:ring-thread-100"
          />
        </label>

        {tab !== "magic" ? (
          <label className="text-sm font-medium text-warm-900/80">
            Password
            <input
              type="password"
              name="password"
              required
              minLength={8}
              autoComplete={tab === "signup" ? "new-password" : "current-password"}
              className="mt-2 w-full rounded-xl border border-warm-100 bg-white px-4 py-3 text-sm focus:border-thread-300 focus:outline-none focus:ring-2 focus:ring-thread-100"
            />
          </label>
        ) : null}

        {state.error ? (
          <p className="text-sm text-red-600" role="alert">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className="text-sm text-thread-700" role="status">
            {state.success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-thread-600 py-3.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending
            ? "Please wait…"
            : tab === "login"
              ? "Log in"
              : tab === "signup"
                ? "Create account"
                : "Send magic link"}
        </button>
      </form>
    </div>
  );
}
