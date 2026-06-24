"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  showNav?: boolean;
  backHref?: string;
}

export function AppShell({
  children,
  title,
  showNav = true,
  backHref,
}: AppShellProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-lg flex-col bg-warm-50">
      <header className="safe-area-top border-b border-warm-100/80 bg-warm-50/95 px-4 pb-3 pt-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {backHref ? (
            <Link
              href={backHref}
              className="text-sm font-medium text-thread-600"
              aria-label="Go back"
            >
              ← Back
            </Link>
          ) : null}
          <div className="flex-1">
            {title ? (
              <h1 className="text-lg font-semibold text-warm-900">{title}</h1>
            ) : isHome ? (
              <p className="text-sm font-medium tracking-wide text-thread-600">
                Ito
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-4 py-5">{children}</main>

      {showNav ? <BottomNav /> : null}
    </div>
  );
}
