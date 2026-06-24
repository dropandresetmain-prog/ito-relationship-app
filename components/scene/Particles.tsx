"use client";

import { useEffect, useMemo, useState } from "react";

interface ParticlesProps {
  count?: number;
  tone?: "gold" | "thread";
}

export function Particles({ count = 14, tone = "gold" }: ParticlesProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const motes = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: ((i * 37 + 13) % 100),
        bottom: ((i * 23 + 7) % 70),
        size: 2 + (i % 4),
        delay: (i * 0.6) % 8,
        duration: 9 + (i % 8),
      })),
    [count]
  );

  if (!mounted) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {motes.map((m) => (
        <span
          key={m.id}
          className="animate-drift absolute rounded-full"
          style={{
            left: `${m.left}%`,
            bottom: `${m.bottom}%`,
            width: m.size,
            height: m.size,
            background:
              tone === "gold"
                ? "radial-gradient(circle, var(--gold), transparent 70%)"
                : "radial-gradient(circle, var(--thread-glow), transparent 70%)",
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
