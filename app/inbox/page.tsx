import { AppShell } from "@/components/AppShell";
import { NotificationInboxItem } from "@/components/NotificationInboxItem";
import { mockInboxItems } from "@/lib/mock/data";

export default function InboxPage() {
  const unreadCount = mockInboxItems.filter((item) => !item.read).length;

  return (
    <AppShell title="Inbox">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-warm-900/60">
          Pulses, moments, and reactions from your threads.
          {unreadCount > 0 ? ` ${unreadCount} unread.` : ""}
        </p>

        <div className="flex flex-col gap-3">
          {mockInboxItems.map((item) => (
            <NotificationInboxItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
