"use client";

import { cn } from "@/lib/utils";
import { itoButtonInlineSoftGlowClass, itoButtonSoftGlowClass } from "@/lib/ito-ui";
import type { ReceivedPulseReveal } from "@/lib/types";

interface PulseRevealProps {
  pulse: ReceivedPulseReveal;
  onPulseBack?: () => void;
  variant?: "sheet" | "overlay";
  dimScene?: boolean;
  inline?: boolean;
}

export function PulseReveal({
  pulse,
  onPulseBack,
  variant = "sheet",
  dimScene = false,
  inline = false,
}: PulseRevealProps) {
  const firstName = pulse.fromName.split(" ")[0] || pulse.fromName;

  if (variant === "overlay") {
    return (
      <div className="pointer-events-none absolute inset-x-6 top-[30%] z-10 animate-rise-in text-center">
        <p
          className={cn(
            "font-heading text-xl font-semibold leading-snug tracking-tight",
            dimScene ? "text-shadow-soft text-card" : "text-shadow-soft text-foreground"
          )}
        >
          {firstName} is thinking of you.
        </p>
        {pulse.body ? (
          <p
            className={cn(
              "mx-auto mt-2 max-w-[16rem] text-pretty text-sm leading-snug",
              dimScene ? "text-shadow-soft text-card/90" : "text-foreground/85"
            )}
          >
            &ldquo;{pulse.body}&rdquo;
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="animate-rise-in text-center">
      <span className="animate-breathe mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--thread)]/30 bg-[var(--thread)]/10 shadow-[0_0_24px_oklch(0.68_0.21_30/0.35)]">
        <span className="h-3 w-3 rounded-full bg-[var(--thread-glow)] shadow-[0_0_10px_var(--thread-glow)]" />
      </span>
      <p className="font-heading text-lg leading-tight text-foreground">
        {firstName} is thinking of you.
      </p>
      {pulse.body ? (
        <p className="mx-auto mt-2 max-w-xs text-pretty text-sm leading-snug text-foreground/80">
          &ldquo;{pulse.body}&rdquo;
        </p>
      ) : (
        <p className="mt-1 text-sm text-muted-foreground">A gentle pulse arrived on your thread.</p>
      )}
      {onPulseBack ? (
        <button
          type="button"
          onClick={onPulseBack}
          className={cn("mt-4", inline ? itoButtonInlineSoftGlowClass : itoButtonSoftGlowClass)}
        >
          Send a pulse back
        </button>
      ) : null}
    </div>
  );
}
