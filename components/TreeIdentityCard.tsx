import type { TreeIdentity } from "@/lib/types";

interface TreeIdentityCardProps {
  identity: TreeIdentity;
}

export function TreeIdentityCard({ identity }: TreeIdentityCardProps) {
  return (
    <section
      className="rounded-2xl border border-thread-100 bg-gradient-to-br from-white to-thread-50/60 p-5 shadow-sm"
      aria-label="Your tree"
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-thread-100 text-2xl"
          aria-hidden
        >
          🌳
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-thread-600/80">
            Your tree
          </p>
          <h2 className="mt-1 text-xl font-semibold text-warm-900">
            {identity.displayName}
          </h2>
          <p className="mt-1 text-sm text-warm-900/60">{identity.tagline}</p>
        </div>
      </div>
    </section>
  );
}
