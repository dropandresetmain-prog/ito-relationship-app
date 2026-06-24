import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { CopyInviteLink } from "@/components/CopyInviteLink";
import { ThreadPulseForm } from "@/components/ThreadPulseForm";
import { RELATIONSHIP_MODE_LABELS } from "@/lib/constants";
import { getThreadDetail } from "@/lib/threads/queries";

interface ThreadPageProps {
  params: Promise<{ id: string }>;
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { id } = await params;
  const detail = await getThreadDetail(id);

  if (!detail) {
    notFound();
  }

  const { thread, otherMember, displayTitle } = detail;
  const modeLabel = RELATIONSHIP_MODE_LABELS[thread.relationship_mode];
  const isActive = thread.status === "active";
  const isPending = thread.status === "pending";

  const reminder =
    thread.relationship_mode === "mother_son"
      ? "Send Mum a little warmth?"
      : thread.relationship_mode === "clare"
        ? "Clare crossed your mind?"
        : "A small pulse can mean a lot.";

  return (
    <AppShell title={displayTitle} backHref="/threads" showNav={false}>
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <p className="text-xs font-medium text-thread-600">{modeLabel}</p>
          {otherMember ? (
            <p className="mt-1 text-sm text-warm-900/60">
              Connected with {otherMember.display_name}
            </p>
          ) : isPending ? (
            <p className="mt-1 text-sm text-warm-900/60">
              Waiting for someone to accept your invite…
            </p>
          ) : null}
        </div>

        {isPending ? (
          <CopyInviteLink code={thread.invite_code} />
        ) : null}

        <p className="text-center text-sm text-warm-900/60">{reminder}</p>

        <ThreadPulseForm
          threadId={thread.id}
          disabled={!isActive}
          disabledReason={
            !isActive
              ? "Send a pulse once this thread is tied with another person."
              : undefined
          }
        />
      </div>
    </AppShell>
  );
}
