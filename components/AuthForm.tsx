"use client";

import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import {
  signInWithEmail,
  signInWithMagicLink,
  signUpWithEmail,
  type AuthState,
} from "@/lib/auth/actions";
import { itoAlertErrorClass, itoButtonPrimaryClass, itoInputClass, itoLabelClass } from "@/lib/ito-ui";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";

const initialState: AuthState = {};

export function AuthForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const callbackError = searchParams.get("error");
  const [mode, setMode] = useState<AuthMode>("login");
  const [magicOpen, setMagicOpen] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const [magicEmail, setMagicEmail] = useState<string | null>(null);

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

  useEffect(() => {
    if (signupState.status === "verification_sent") {
      setVerificationEmail(signupState.email ?? null);
    }
  }, [signupState]);

  useEffect(() => {
    if (magicState.status === "magic_link_sent") {
      setMagicEmail(magicState.email ?? null);
    }
  }, [magicState]);

  const activeState = magicOpen ? magicState : mode === "login" ? loginState : signupState;
  const pending = magicOpen ? magicPending : mode === "login" ? loginPending : signupPending;
  const action = magicOpen ? magicAction : mode === "login" ? loginAction : signupAction;

  if (verificationEmail !== null) {
    return (
      <AuthCard>
        <VerificationSuccess
          email={verificationEmail}
          onBackToSignIn={() => {
            setVerificationEmail(null);
            setMode("login");
            setMagicOpen(false);
          }}
        />
      </AuthCard>
    );
  }

  if (magicEmail !== null) {
    return (
      <AuthCard>
        <MagicLinkSuccess
          email={magicEmail}
          onBack={() => {
            setMagicEmail(null);
            setMagicOpen(false);
            setMode("login");
          }}
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard>
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
        <p className={cn("mb-4", itoAlertErrorClass)} role="alert">
          Sign-in link expired or failed. Please try again.
        </p>
      ) : null}

      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="redirect" value={redirect} />

        <label className={itoLabelClass}>
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className={itoInputClass}
            placeholder="you@example.com"
          />
        </label>

        {!magicOpen ? (
          <label className={itoLabelClass}>
            Password
            <input
              type="password"
              name="password"
              required
              minLength={8}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className={itoInputClass}
              placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
            />
          </label>
        ) : null}

        {activeState.error ? (
          <p className={itoAlertErrorClass} role="alert">
            {activeState.error}
          </p>
        ) : null}

        <button type="submit" disabled={pending} className={itoButtonPrimaryClass}>
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              {magicOpen
                ? "Sending link…"
                : mode === "signup"
                  ? "Creating account…"
                  : "Signing in…"}
            </>
          ) : magicOpen ? (
            "Send magic link"
          ) : mode === "login" ? (
            "Sign in"
          ) : (
            "Create account"
          )}
        </button>
      </form>

      {!magicOpen ? (
        <button
          type="button"
          onClick={() => setMagicOpen(true)}
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
    </AuthCard>
  );
}

function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 pb-8 pt-6">
      <div className="animate-rise-in rounded-t-[2rem] border border-border/80 bg-card/90 px-5 pb-7 pt-5 backdrop-blur-md paper-shadow">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted-foreground/25" />
        {children}
      </div>
    </div>
  );
}

function VerificationSuccess({
  email,
  onBackToSignIn,
}: {
  email?: string;
  onBackToSignIn: () => void;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--thread)]/10">
        <Mail className="h-6 w-6 text-[var(--thread)]" strokeWidth={2} />
      </div>
      <h2 className="font-heading text-xl font-semibold text-foreground">Check your email</h2>
      <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
        We sent you a verification link. Open it to finish creating your Ito account.
      </p>
      {email ? (
        <p className="mt-2 text-sm font-medium text-foreground">{email}</p>
      ) : null}
      <button type="button" onClick={onBackToSignIn} className={cn("mt-6", itoButtonPrimaryClass)}>
        Back to sign in
      </button>
      <p className="mt-4 text-xs text-muted-foreground">Already verified? Sign in instead.</p>
    </div>
  );
}

function MagicLinkSuccess({ email, onBack }: { email?: string; onBack: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--thread)]/10">
        <Mail className="h-6 w-6 text-[var(--thread)]" strokeWidth={2} />
      </div>
      <h2 className="font-heading text-xl font-semibold text-foreground">Check your email</h2>
      <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
        Check your email for your magic link.
      </p>
      {email ? (
        <p className="mt-2 text-sm font-medium text-foreground">{email}</p>
      ) : null}
      <button type="button" onClick={onBack} className={cn("mt-6", itoButtonPrimaryClass)}>
        Back to sign in
      </button>
    </div>
  );
}
