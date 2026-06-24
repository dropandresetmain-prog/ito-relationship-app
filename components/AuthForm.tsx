"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import {
  signInWithEmail,
  signInWithMagicLink,
  signUpWithEmail,
  type AuthState,
} from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";

const initialState: AuthState = {};

export function AuthForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const callbackError = searchParams.get("error");
  const [mode, setMode] = useState<AuthMode>("login");
  const [magicOpen, setMagicOpen] = useState(false);

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

  const activeState = magicOpen ? magicState : mode === "login" ? loginState : signupState;
  const pending = magicOpen ? magicPending : mode === "login" ? loginPending : signupPending;
  const action = magicOpen ? magicAction : mode === "login" ? loginAction : signupAction;

  return (
    <div className="px-5 pb-8 pt-6">
      <div className="animate-rise-in rounded-t-[2rem] border border-border/80 bg-card/90 px-5 pb-7 pt-5 backdrop-blur-md paper-shadow">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted-foreground/25" />

        <header className="mb-5 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--thread)]">
            Ito
          </p>
          <h1 className="font-heading mt-2 text-2xl font-semibold leading-tight text-foreground">
            Welcome to Ito
          </h1>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
            Tie your threads. Send small pulses of care when someone crosses your mind.
          </p>
        </header>

        {!magicOpen ? (
          <div
            className="mb-5 flex rounded-2xl border border-border bg-background/50 p-1"
            role="tablist"
            aria-label="Sign in or create account"
          >
            {(
              [
                ["login", "Sign in"],
                ["signup", "Create account"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={mode === key}
                onClick={() => setMode(key)}
                className={cn(
                  "flex-1 rounded-xl py-2.5 text-sm font-medium transition-all",
                  mode === key
                    ? "bg-[var(--thread)] text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        ) : (
          <div className="mb-5 flex items-center justify-between">
            <p className="font-heading text-base font-medium text-foreground">Magic link</p>
            <button
              type="button"
              onClick={() => setMagicOpen(false)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Back to password
            </button>
          </div>
        )}

        {callbackError ? (
          <p
            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            Sign-in link expired or failed. Please try again.
          </p>
        ) : null}

        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="redirect" value={redirect} />

          <label className="block text-sm font-medium text-foreground">
            Email
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="mt-1.5 w-full rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-[var(--thread)] focus:outline-none focus:ring-2 focus:ring-[var(--thread)]/20"
              placeholder="you@example.com"
            />
          </label>

          {!magicOpen ? (
            <label className="block text-sm font-medium text-foreground">
              Password
              <input
                type="password"
                name="password"
                required
                minLength={8}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-[var(--thread)] focus:outline-none focus:ring-2 focus:ring-[var(--thread)]/20"
                placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
              />
            </label>
          ) : null}

          {activeState.error ? (
            <p
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              {activeState.error}
            </p>
          ) : null}
          {activeState.success ? (
            <p
              className="rounded-xl border border-border bg-[var(--thread)]/8 px-3 py-2 text-sm text-foreground"
              role="status"
            >
              {activeState.success}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--thread)] py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {pending
              ? "Please wait…"
              : magicOpen
                ? "Send magic link"
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
          </button>
        </form>

        {!magicOpen ? (
          <button
            type="button"
            onClick={() => {
              setMagicOpen(true);
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-[var(--thread)]"
          >
            <Mail className="h-4 w-4" strokeWidth={2} />
            Email me a magic link
          </button>
        ) : null}

        <p className="mt-5 text-pretty text-center text-[11px] leading-relaxed text-muted-foreground">
          Ito is private by default. Your threads are only between you and the people you
          invite.
        </p>
      </div>
    </div>
  );
}
