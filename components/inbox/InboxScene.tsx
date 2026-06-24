"use client";

import type { ReactNode } from "react";
import { THREAD_GARDEN } from "@/lib/scene/thread-garden";
import type { TimeOfDay } from "@/lib/scene/types";
import { SceneShell } from "@/components/scene/SceneShell";
import { BottomSheet } from "@/components/scene/BottomSheet";

interface InboxSceneProps {
  time: TimeOfDay;
  children: ReactNode;
}

export function InboxScene({ time, children }: InboxSceneProps) {
  return (
    <SceneShell config={THREAD_GARDEN} time={time}>
      <BottomSheet sheetKey="inbox" className="max-h-[85vh]">
        {children}
      </BottomSheet>
    </SceneShell>
  );
}
