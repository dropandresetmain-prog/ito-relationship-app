"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "🌳" },
  { href: "/threads", label: "Threads", icon: "🧵" },
  { href: "/inbox", label: "Inbox", icon: "✨" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="safe-area-bottom border-t border-warm-100 bg-white/90 px-2 py-2 backdrop-blur-sm"
      aria-label="Main navigation"
    >
      <ul className="flex items-stretch justify-around gap-1">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors ${
                  active
                    ? "bg-thread-50 text-thread-700"
                    : "text-warm-900/50 hover:text-warm-900/70"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
