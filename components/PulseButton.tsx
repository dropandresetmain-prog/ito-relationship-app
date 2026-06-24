"use client";

interface PulseButtonProps {
  onPulse?: () => void;
  disabled?: boolean;
  sending?: boolean;
}

export function PulseButton({ onPulse, disabled, sending }: PulseButtonProps) {
  return (
    <button
      type="button"
      onClick={onPulse}
      disabled={disabled || sending}
      className="group relative flex h-52 w-52 items-center justify-center rounded-full
        bg-gradient-to-br from-thread-300 via-thread-500 to-thread-700
        shadow-[0_8px_32px_rgba(185,28,28,0.28)]
        transition-all duration-200
        active:scale-95 disabled:opacity-50 disabled:active:scale-100
        focus:outline-none focus-visible:ring-4 focus-visible:ring-thread-200"
      aria-label="Send a pulse"
    >
      <span className="absolute inset-2 rounded-full border border-white/25 group-active:border-white/45" />
      <span className="relative z-10 px-6 text-center text-lg font-medium leading-tight text-white">
        {sending ? "Sending…" : "Send a pulse"}
      </span>
    </button>
  );
}
