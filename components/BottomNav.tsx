"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Inbox, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/threads", label: "Threads", icon: Sparkles },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

interface BottomNavProps {
  variant?: "default" | "scene";
}

export function BottomNav({ variant = "default" }: BottomNavProps) {
  const pathname = usePathname();
  const sceneNav = variant === "scene";

  return (
    <nav
      className={cn(
        "safe-area-bottom border-t px-2 py-2 backdrop-blur-md",
        sceneNav
          ? "border-border/80 bg-card/95 shadow-[0_-4px_20px_oklch(0.2_0.03_50_/_0.12)]"
          : "border-border/60 bg-card/80"
      )}
      aria-label="Main navigation"
    >
      <ul className="flex items-stretch justify-around gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-medium transition-colors touch-manipulation",
                  active
                    ? "bg-[var(--thread)]/10 text-[var(--thread)]"
                    : sceneNav
                      ? "text-foreground/75 hover:text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 2} aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
