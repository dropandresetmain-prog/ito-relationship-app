"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  children: ReactNode;
  sheetKey?: string | number;
  className?: string;
}

export function BottomSheet({ children, sheetKey, className }: BottomSheetProps) {
  return (
    <div
      key={sheetKey}
      className={cn(
        "animate-sheet-up absolute inset-x-0 bottom-0 z-20",
        "rounded-t-[2rem] border-t border-border bg-card/95 backdrop-blur-md paper-shadow",
        "px-5 pb-7 pt-3",
        className
      )}
    >
      <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-muted-foreground/30" />
      {children}
    </div>
  );
}
