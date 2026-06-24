import Link from "next/link";
import { ItoPaperShell } from "@/components/ItoPaperShell";
import { ThreadCard } from "@/components/ThreadCard";
import { itoButtonSecondaryClass, itoCardClass } from "@/lib/ito-ui";
import { getUserThreads } from "@/lib/threads/queries";
import { cn } from "@/lib/utils";

export default async function ThreadsPage() {
  const threads = await getUserThreads();

  return (
    <ItoPaperShell
      title="Your threads"
      subtitle="Each thread is a private tie with someone you care about."
    >
      <div className="flex flex-col gap-4">
        {threads.length > 0 ? (
          <div className="flex flex-col gap-3">
            {threads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        ) : (
          <div className={cn(itoCardClass, "border-dashed text-center")}>
            <p className="text-sm text-muted-foreground">No threads tied yet.</p>
            <p className="mt-1 text-xs text-muted-foreground/80">
              A small pulse can mean a lot — tie your first thread below.
            </p>
          </div>
        )}

        <Link href="/threads/new" className={cn(itoButtonSecondaryClass, "border-dashed")}>
          + Tie a thread
        </Link>
      </div>
    </ItoPaperShell>
  );
}
