import { ThreadGardenHome } from "@/components/scene/ThreadGardenHome";
import { ScenePageLayout } from "@/components/scene/ScenePageLayout";
import { mapThreadsToConnections } from "@/lib/scene/map-threads";
import { THREAD_GARDEN } from "@/lib/scene/thread-garden";
import { getTimeOfDay } from "@/lib/scene/time-of-day";
import { requireProfile } from "@/lib/auth/session";
import { getInboxPulses, getUserThreads } from "@/lib/threads/queries";

export default async function HomePage() {
  const { profile } = await requireProfile();
  const threads = await getUserThreads();
  const inbox = await getInboxPulses();
  const unreadCount = inbox.filter((item) => !item.read).length;
  const unreadThreadIds = new Set(
    inbox.filter((item) => !item.read).map((item) => item.threadId)
  );

  const connections = mapThreadsToConnections(
    threads.map((t) => ({
      id: t.id,
      title: t.title,
      relationshipMode: t.relationshipMode,
      lastPulseAt: t.lastPulseAt,
      hasArrived: unreadThreadIds.has(t.id),
    })),
    THREAD_GARDEN.charmSlots
  );

  const time = getTimeOfDay(profile.timezone);

  return (
    <ScenePageLayout>
      <ThreadGardenHome
        connections={connections}
        time={time}
        unreadCount={unreadCount}
        profileName={profile.display_name}
      />
    </ScenePageLayout>
  );
}
