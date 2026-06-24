import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { RELATIONSHIP_MODE_LABELS } from "@/lib/mock/data";
import type { RelationshipMode } from "@/lib/types";

const MODES = Object.keys(RELATIONSHIP_MODE_LABELS) as RelationshipMode[];

export default function NewThreadPage() {
  return (
    <AppShell title="Tie a thread" backHref="/threads">
      <div className="flex flex-col gap-5">
        <p className="text-sm text-warm-900/60">
          Choose how this connection feels. You can share an invite link after
          creating the thread.
        </p>

        <form className="flex flex-col gap-4">
          <label className="text-sm font-medium text-warm-900/80">
            Their name
            <input
              type="text"
              placeholder="Mum, Clare, Alex…"
              className="mt-2 w-full rounded-xl border border-warm-100 bg-white px-4 py-3 text-sm focus:border-thread-300 focus:outline-none focus:ring-2 focus:ring-thread-100"
              disabled
            />
          </label>

          <label className="text-sm font-medium text-warm-900/80">
            Relationship mode
            <select
              className="mt-2 w-full rounded-xl border border-warm-100 bg-white px-4 py-3 text-sm focus:border-thread-300 focus:outline-none focus:ring-2 focus:ring-thread-100"
              defaultValue="general"
              disabled
            >
              {MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {RELATIONSHIP_MODE_LABELS[mode]}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            disabled
            className="rounded-xl bg-thread-600 py-3.5 text-sm font-medium text-white opacity-50"
          >
            Create invite (mock)
          </button>
        </form>

        <p className="rounded-xl bg-warm-100/80 px-4 py-3 text-xs text-warm-900/55">
          Mock shell only — invite creation will connect to Supabase in a later
          milestone.
        </p>

        <Link
          href="/invite/DEMO12"
          className="text-center text-sm font-medium text-thread-600"
        >
          Preview invite flow →
        </Link>
      </div>
    </AppShell>
  );
}
