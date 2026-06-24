"use client";

import { useState } from "react";
import type { Point } from "@/lib/scene/types";

interface BirdProps {
  perch: Point;
}

export function Bird({ perch }: BirdProps) {
  const [flown, setFlown] = useState(false);

  if (flown) {
    return (
      <div
        aria-hidden
        className="animate-flyaway pointer-events-none absolute"
        style={{ left: `${perch.x}%`, top: `${perch.y}%` }}
      >
        <BirdShape wings="up" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setFlown(true)}
      aria-label="A bird is resting on the branch. Tap to let it fly."
      className="animate-bird-bob absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1 transition-transform active:scale-90"
      style={{ left: `${perch.x}%`, top: `${perch.y}%` }}
    >
      <BirdShape wings="rest" />
    </button>
  );
}

function BirdShape({ wings }: { wings: "rest" | "up" }) {
  return (
    <svg width="34" height="28" viewBox="0 0 34 28" fill="none" className="drop-shadow-sm">
      <path
        d="M4 18c3-7 11-9 16-7 3 1 5 0 8-2 1 3-1 6-4 7 2 1 4 1 6 3-3 1-6 1-8 0-2 4-7 6-12 5-4-1-6-3-6-6Z"
        fill="oklch(0.42 0.06 45)"
      />
      <path
        d={
          wings === "rest"
            ? "M12 16c4-1 8 0 11 2-3 2-7 3-11 1Z"
            : "M12 16c3-5 7-8 11-9-1 4-4 8-7 11Z"
        }
        fill="oklch(0.34 0.05 40)"
      />
      <circle cx="9" cy="16" r="2.4" fill="oklch(0.6 0.12 60)" />
      <path d="M27 9l4-1-3 3Z" fill="oklch(0.7 0.14 60)" />
    </svg>
  );
}
