"use client";

interface PlaceholderActionProps {
  label: string;
  icon: string;
}

export function PlaceholderAction({ label, icon }: PlaceholderActionProps) {
  return (
    <button
      type="button"
      disabled
      className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-warm-100/80
        px-4 py-3 text-warm-900/40"
      aria-label={`${label} (coming soon)`}
    >
      <span className="text-xl opacity-50">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
      <span className="text-[10px] uppercase tracking-wide opacity-60">Soon</span>
    </button>
  );
}
