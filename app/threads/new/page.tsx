import { AppShell } from "@/components/AppShell";
import { CreateThreadForm } from "@/components/CreateThreadForm";

export default function NewThreadPage() {
  return (
    <AppShell title="Tie a thread" backHref="/threads">
      <div className="flex flex-col gap-5">
        <p className="text-sm text-warm-900/60">
          Choose how this connection feels. Share the invite link after creating
          the thread.
        </p>
        <CreateThreadForm />
      </div>
    </AppShell>
  );
}
