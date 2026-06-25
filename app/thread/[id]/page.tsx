import { notFound } from "next/navigation";
import { LivingTreeScene } from "@/components/scene/LivingTreeScene";
import { ScenePageLayout } from "@/components/scene/ScenePageLayout";
import { mapThreadsToConnections } from "@/lib/scene/map-threads";
import { LIVING_TREE } from "@/lib/scene/living-tree";
import { getTimeOfDay } from "@/lib/scene/time-of-day";
import { requireProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import {
  getInboxPulses,
  getThreadDetail,
  pickReceivedPulseForThread,
} from "@/lib/threads/queries";

interface ThreadPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ send?: string }>;
}

function formatRelativeTime(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export default async function ThreadPage({ params, searchParams }: ThreadPageProps) {
  const { id } = await params;
  const { send } = await searchParams;
  const { profile } = await requireProfile();
  const detail = await getThreadDetail(id);

  if (!detail) {
    notFound();
  }

  const { thread, otherMember, displayTitle } = detail;
  const inbox = await getInboxPulses();
  const unreadCount = inbox.filter((item) => !item.read).length;
  const receivedPulse = pickReceivedPulseForThread(inbox, thread.id);

  const supabase = await createClient();
  const { data: lastPulse } = await supabase
    .from("pulses")
    .select("created_at")
    .eq("thread_id", thread.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const connections = mapThreadsToConnections(
    [
      {
        id: thread.id,
        title: displayTitle,
        relationshipMode: thread.relationship_mode,
        lastPulseAt: formatRelativeTime(lastPulse?.created_at ?? null),
        hasArrived: inbox.some((item) => !item.read && item.threadId === thread.id),
      },
    ],
    LIVING_TREE.charmSlots
  );

  const connection = connections[0];
  if (!connection) {
    notFound();
  }

  const time = getTimeOfDay(profile.timezone);

  return (
    <ScenePageLayout showNav={false}>
      <LivingTreeScene
        connection={connection}
        threadId={thread.id}
        relationshipMode={thread.relationship_mode}
        relationLabel={otherMember?.display_name ?? displayTitle}
        status={thread.status}
        inviteCode={thread.status === "pending" ? thread.invite_code : undefined}
        time={time}
        unreadCount={unreadCount}
        isActive={thread.status === "active"}
        receivedPulse={receivedPulse}
        openSend={send === "1"}
      />
    </ScenePageLayout>
  );
}
