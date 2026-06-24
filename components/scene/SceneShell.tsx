"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import type { SceneConfig, TimeOfDay } from "@/lib/scene/types";
import { sceneForTime } from "@/lib/scene/time-of-day";
import { cn } from "@/lib/utils";
import { Bird } from "./Bird";
import { Particles } from "./Particles";

const TINTS: Record<TimeOfDay, string> = {
  morning:
    "linear-gradient(180deg, oklch(0.9 0.07 90 / 0.28) 0%, transparent 45%, oklch(0.85 0.05 120 / 0.18) 100%)",
  day: "linear-gradient(180deg, oklch(0.95 0.03 95 / 0.12) 0%, transparent 60%)",
  evening:
    "linear-gradient(180deg, oklch(0.7 0.14 55 / 0.34) 0%, transparent 40%, oklch(0.5 0.16 30 / 0.34) 100%)",
  night:
    "linear-gradient(180deg, oklch(0.28 0.06 250 / 0.62) 0%, oklch(0.3 0.05 240 / 0.45) 55%, oklch(0.22 0.05 250 / 0.66) 100%)",
};

const GREETING: Record<TimeOfDay, string> = {
  morning: "Good morning",
  day: "A quiet afternoon",
  evening: "Golden hour",
  night: "Late and still",
};

interface SceneShellProps {
  config: SceneConfig;
  time: TimeOfDay;
  greeting?: string;
  headerRight?: ReactNode;
  children?: ReactNode;
  overlay?: ReactNode;
}

export function SceneShell({
  config,
  time,
  greeting,
  headerRight,
  children,
  overlay,
}: SceneShellProps) {
  const sceneSrc = sceneForTime(config.scenes, time);
  const isNight = time === "night";
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative h-full min-h-full w-full overflow-hidden bg-background",
        isNight ? "text-card" : "text-foreground"
      )}
    >
      {!imageFailed ? (
        <Image
          src={sceneSrc}
          alt={`${config.name} scene at ${time}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.94 0.02 85) 0%, oklch(0.88 0.04 95) 45%, oklch(0.82 0.06 110) 100%)",
          }}
        />
      )}
      {imageFailed ? (
        <p className="absolute inset-x-6 top-1/3 z-10 text-center text-sm text-muted-foreground">
          Scene image couldn&apos;t load — your garden is still here.
        </p>
      ) : null}
      <div aria-hidden className="absolute inset-0" style={{ background: TINTS[time] }} />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background:
            "linear-gradient(180deg, transparent, oklch(0.18 0.02 50 / 0.18) 55%, oklch(0.16 0.02 50 / 0.42))",
        }}
      />

      <Particles tone={time === "evening" || time === "night" ? "thread" : "gold"} />
      {children}
      <Bird perch={config.birdPerch} />

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 pt-5 safe-area-top">
        <div>
          <p
            className={cn(
              "font-heading text-2xl font-semibold leading-none tracking-tight text-shadow-soft",
              isNight ? "text-card" : "text-foreground"
            )}
          >
            Ito
          </p>
          <p
            className={cn(
              "mt-1 text-[11px] font-medium text-shadow-soft",
              isNight ? "text-card/80" : "text-foreground/70"
            )}
          >
            {greeting ?? GREETING[time]}
          </p>
        </div>
        {headerRight}
      </header>

      {overlay}
    </div>
  );
}

export { GREETING };
