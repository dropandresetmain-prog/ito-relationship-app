export const itoInputClass =
  "mt-1.5 w-full rounded-2xl border border-border bg-card/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-[var(--thread)] focus:outline-none focus:ring-2 focus:ring-[var(--thread)]/20";

export const itoLabelClass = "block text-sm font-medium text-foreground";

export const itoButtonPrimaryClass =
  "box-border flex w-full min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--thread)] px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-md transition-transform active:scale-[0.98] disabled:opacity-60 touch-manipulation appearance-none";

export const itoButtonSecondaryClass =
  "box-border flex w-full min-h-12 items-center justify-center rounded-full border border-border bg-card/60 px-6 py-3.5 text-base font-medium text-foreground transition-colors hover:border-[var(--thread)]/40 touch-manipulation appearance-none";

/** Primary CTA in a horizontal button row (e.g. Send pulse beside secondary link). */
export const itoButtonInlinePrimaryClass =
  "box-border flex min-h-11 flex-[2] items-center justify-center gap-2 rounded-full bg-[var(--thread)] px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform active:scale-[0.98] disabled:opacity-50 touch-manipulation appearance-none";

/** Secondary CTA in a horizontal button row. */
export const itoButtonInlineSecondaryClass =
  "box-border flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-3 text-sm font-medium text-foreground transition-colors hover:border-[var(--thread)]/40 touch-manipulation appearance-none";

/** Compact secondary for sheet footers (Done, dismiss). */
export const itoButtonCompactSecondaryClass =
  "box-border inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-background/60 px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-[var(--thread)]/40 touch-manipulation appearance-none";

/** Round icon control (back, close) — 44px minimum tap target. */
export const itoIconButtonClass =
  "flex h-11 w-11 min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground touch-manipulation";

export const itoSelectClass = itoInputClass;

export const itoCardClass =
  "rounded-2xl border border-border bg-card/85 p-5 paper-shadow backdrop-blur-sm";

export const itoAlertErrorClass =
  "rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700";

export const itoAlertSuccessClass =
  "rounded-xl border border-border bg-[var(--thread)]/8 px-3 py-2 text-sm text-foreground";
