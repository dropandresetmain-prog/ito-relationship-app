"use client";

import type { Point, SceneConnection } from "@/lib/scene/types";
import { iconForRelationshipMode } from "@/lib/scene/map-threads";
import { threadPath } from "@/lib/scene/thread-path";
import { cn } from "@/lib/utils";

interface ThreadLayerProps {
  connections: SceneConnection[];
  treeAnchor: Point;
  selectedId?: string | null;
  arrivedId?: string | null;
  pulsingId?: string | null;
  pulseKey?: number;
  onSelect?: (id: string) => void;
}

export function ThreadLayer({
  connections,
  treeAnchor,
  selectedId,
  arrivedId,
  pulsingId,
  pulseKey = 0,
  onSelect,
}: ThreadLayerProps) {
  if (connections.length === 0) return null;

  return (
    <div className="absolute inset-0 animate-sway">
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="thread-soft-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Tree knot — visible anchor where threads converge */}
        <circle
          cx={treeAnchor.x}
          cy={treeAnchor.y}
          r={1.4}
          fill="var(--thread)"
          filter="url(#thread-soft-glow)"
        />

        {connections.map((c) => {
          const d = threadPath(treeAnchor, c.knot);
          const active = selectedId === c.id || pulsingId === c.id;
          const arrived = arrivedId === c.id || c.hasArrived;
          return (
            <g key={c.id}>
              <path
                d={d}
                fill="none"
                stroke="var(--thread)"
                strokeWidth={arrived ? 1.8 : active ? 1.6 : 1}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                opacity={selectedId && !active && !arrived ? 0.35 : arrived ? 1 : 0.85}
                filter={active || arrived ? "url(#thread-soft-glow)" : undefined}
              />
              <circle
                cx={c.knot.x}
                cy={c.knot.y}
                r={1.1}
                fill="var(--thread)"
                opacity={selectedId && !active ? 0.35 : 0.9}
              />
              {pulsingId === c.id ? (
                <circle key={pulseKey} r="1.8" fill="var(--thread-glow)" filter="url(#thread-soft-glow)">
                  <animateMotion dur="1.8s" repeatCount="1" path={d} rotate="auto" />
                  <animate attributeName="r" values="1.2;2.4;1.2" dur="1.8s" repeatCount="1" />
                </circle>
              ) : null}
            </g>
          );
        })}
      </svg>

      {connections.map((c) => {
        const Icon = iconForRelationshipMode(c.relationshipMode);
        const selected = selectedId === c.id;
        const arrived = arrivedId === c.id || c.hasArrived;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect?.(c.id)}
            aria-label={`Open your thread with ${c.name}. ${c.lastPulse}.`}
            aria-pressed={selected}
            className={cn(
              "absolute flex -translate-x-1/2 flex-col items-center outline-none",
              "transition-transform duration-300",
              selected ? "scale-110" : "hover:scale-105"
            )}
            style={{ left: `${c.knot.x}%`, top: `${c.knot.y}%` }}
          >
            {/* Tag hangs directly below knot — no separate connector span */}
            <span
              className={cn(
                "relative mt-1 flex h-12 w-12 flex-col items-center justify-center rounded-2xl border bg-card/90 backdrop-blur-sm paper-shadow",
                "border-border",
                selected && "ring-2 ring-[var(--thread)] ring-offset-2 ring-offset-background",
                arrived && "animate-shimmer"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  c.mode === "romantic" ? "text-[var(--thread)]" : "text-accent-foreground"
                )}
                strokeWidth={2}
              />
              <span className="font-heading text-[11px] font-semibold leading-none text-foreground">
                {c.initial}
              </span>
              {arrived ? (
                <span className="animate-breathe absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[var(--thread-glow)] shadow-[0_0_8px_var(--thread-glow)]" />
              ) : null}
            </span>
            <span className="mt-1 rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-medium text-foreground backdrop-blur-sm">
              {c.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
