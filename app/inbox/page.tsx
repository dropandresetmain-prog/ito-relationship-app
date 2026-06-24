import { InboxPanel } from "@/components/inbox/InboxPanel";
import { InboxScene } from "@/components/inbox/InboxScene";
import { ScenePageLayout } from "@/components/scene/ScenePageLayout";
import { getTimeOfDay } from "@/lib/scene/time-of-day";
import { requireProfile } from "@/lib/auth/session";
import { getInboxPulses } from "@/lib/threads/queries";

export default async function InboxPage() {
  const { profile } = await requireProfile();
  const items = await getInboxPulses();
  const time = getTimeOfDay(profile.timezone);

  return (
    <ScenePageLayout>
      <InboxScene time={time}>
        <InboxPanel items={items} backHref="/" />
      </InboxScene>
    </ScenePageLayout>
  );
}
