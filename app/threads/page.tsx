import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ThreadCard } from "@/components/ThreadCard";
import { mockThreads } from "@/lib/mock/data";

export default function ThreadsPage() {
  return (
    <AppShell title="Threads">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-warm-900/60">
          Each thread is a private tie with someone you care about.
        </p>

        <div className="flex flex-col gap-3">
          {mockThreads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </div>

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
