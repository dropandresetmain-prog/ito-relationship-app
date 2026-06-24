"use client";

import type { ReactNode } from "react";
import { BottomNav } from "@/components/BottomNav";

interface ScenePageLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function ScenePageLayout({ children, showNav = true }: ScenePageLayoutProps) {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-lg flex-col bg-background">
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0">{children}</div>
      </div>
      {showNav ? <BottomNav variant="scene" /> : null}
    </div>
  );
}
