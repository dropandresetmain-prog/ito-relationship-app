"use client";

interface ThinkingButtonProps {
  onTap: () => void;
  disabled?: boolean;
  sending?: boolean;
}

export function ThinkingButton({ onTap, disabled, sending }: ThinkingButtonProps) {
  return (
    <button
      type="button"
      onClick={onTap}
      disabled={disabled || sending}
      className="group relative flex h-56 w-56 items-center justify-center rounded-full
        bg-gradient-to-br from-blush-300 via-blush-400 to-blush-500
        shadow-[0_8px_32px_rgba(244,63,110,0.35)]
        transition-all duration-200
        active:scale-95 disabled:opacity-50 disabled:active:scale-100
        focus:outline-none focus-visible:ring-4 focus-visible:ring-blush-200"
      aria-label="Send thinking of you"
    >
      <span
        className="absolute inset-2 rounded-full border border-white/30
          group-active:border-white/50"
      />
      <span className="relative z-10 px-6 text-center text-lg font-medium leading-tight text-white">
        {sending ? "Sending…" : "Thinking of you"}
      </span>
      <span
        className="absolute inset-0 rounded-full bg-white/10 opacity-0
          transition-opacity group-hover:opacity-100"
      />
    </button>
  );
}
