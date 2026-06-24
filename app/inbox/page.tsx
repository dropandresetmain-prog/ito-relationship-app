import { AppShell } from "@/components/AppShell";
import { NotificationInboxItem } from "@/components/NotificationInboxItem";
import { getInboxPulses } from "@/lib/threads/queries";

export default async function InboxPage() {
  const items = await getInboxPulses();
  const unreadCount = items.filter((item) => !item.read).length;

  return (
    <AppShell title="Inbox">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-warm-900/60">
          Pulses received from your threads.
          {unreadCount > 0 ? ` ${unreadCount} unread.` : ""}
        </p>

        {items.length > 0 ? (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <NotificationInboxItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-thread-200 px-4 py-8 text-center">
            <p className="text-sm text-warm-900/60">No pulses yet.</p>
            <p className="mt-1 text-xs text-warm-900/45">
              When someone sends you a pulse, it will appear here.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
