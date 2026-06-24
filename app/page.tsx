import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ThreadCard } from "@/components/ThreadCard";
import { TreeIdentityCard } from "@/components/TreeIdentityCard";
import { requireProfile } from "@/lib/auth/session";
import { getUserThreads } from "@/lib/threads/queries";

export default async function HomePage() {
  const { profile } = await requireProfile();
  const threads = await getUserThreads();
  const featuredThreads = threads.slice(0, 2);
  const reminder =
    threads.find((t) => t.reminderPrompt)?.reminderPrompt ??
    "A small pulse can mean a lot.";

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <TreeIdentityCard profile={profile} />

        <section
          className="rounded-2xl border border-thread-100 bg-thread-50/50 px-4 py-3"
          aria-label="Gentle reminder"
        >
          <p className="text-sm text-warm-900/70">{reminder}</p>
          <p className="mt-1 text-xs text-warm-900/45">
            A small pulse can mean a lot.
          </p>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-warm-900">Your threads</h2>
            <Link href="/threads" className="text-xs font-medium text-thread-600">
              See all
            </Link>
          </div>
          {featuredThreads.length > 0 ? (
            <div className="flex flex-col gap-3">
              {featuredThreads.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-warm-900/50">
              No threads yet. Tie your first thread below.
            </p>
          )}
        </section>

        <Link
          href="/threads/new"
          className="rounded-xl bg-thread-600 py-3.5 text-center text-sm font-medium text-white transition active:scale-[0.98]"
        >
          Tie a thread
        </Link>
      </div>
    </AppShell>
  );
}
