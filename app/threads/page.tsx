import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ThreadCard } from "@/components/ThreadCard";
import { getUserThreads } from "@/lib/threads/queries";

export default async function ThreadsPage() {
  const threads = await getUserThreads();

  return (
    <AppShell title="Threads">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-warm-900/60">
          Each thread is a private tie with someone you care about.
        </p>

        {threads.length > 0 ? (
          <div className="flex flex-col gap-3">
            {threads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-thread-200 bg-thread-50/30 px-4 py-8 text-center">
            <p className="text-sm text-warm-900/60">No threads tied yet.</p>
            <p className="mt-1 text-xs text-warm-900/45">
              A small pulse can mean a lot — start with one thread.
            </p>
          </div>
        )}

        <Link
          href="/threads/new"
          className="mt-2 rounded-xl border border-dashed border-thread-300 py-3.5 text-center text-sm font-medium text-thread-600"
        >
          + Tie a thread
        </Link>
      </div>
    </AppShell>
  );
}
