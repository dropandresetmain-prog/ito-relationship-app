"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";

interface ItoPaperShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showNav?: boolean;
  backHref?: string;
  backLabel?: string;
}

export function ItoPaperShell({
  children,
  title,
  subtitle,
  showNav = true,
  backHref,
  backLabel = "Back",
}: ItoPaperShellProps) {
  return (
    <div className="relative mx-auto flex min-h-[100dvh] max-w-lg flex-col bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-56"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.55 0.2 25 / 0.06) 0%, transparent 100%)",
        }}
      />

      <header className="relative safe-area-top border-b border-border/50 bg-card/50 px-5 pb-4 pt-5 backdrop-blur-sm">
        {backHref ? (
          <Link
            href={backHref}
            className="mb-3 inline-flex min-h-11 items-center text-sm font-medium text-[var(--thread)] hover:text-foreground touch-manipulation"
            aria-label="Go back"
          >
            ← {backLabel}
          </Link>
        ) : null}
        {title ? (
          <h1 className="font-heading text-xl font-semibold leading-tight text-foreground">
            {title}
          </h1>
        ) : (
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--thread)]">
            Ito
          </p>
        )}
        {subtitle ? (
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
        ) : null}
      </header>

      <main className={cn("relative flex-1 px-5 py-6", !showNav && "safe-area-bottom")}>
        {children}
      </main>

      {showNav ? <BottomNav /> : null}
    </div>
  );
}
