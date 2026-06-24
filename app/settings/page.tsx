import Link from "next/link";
import { AppShell } from "@/components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-warm-900/60">
          Notification preferences and account settings will live here.
        </p>

        <section className="rounded-2xl border border-warm-100 bg-white divide-y divide-warm-100">
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-warm-900">Profile</p>
            <p className="text-xs text-warm-900/45">Coming with Supabase Auth</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-warm-900">Notifications</p>
            <p className="text-xs text-warm-900/45">
              Web Push planned for a later milestone
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-warm-900">Gentle reminders</p>
            <p className="text-xs text-warm-900/45">
              Optional prompts — never guilt-based
            </p>
          </div>
        </section>

        <Link
          href="/onboarding"
          className="text-sm font-medium text-thread-600"
        >
          Revisit onboarding
        </Link>
      </div>
    </AppShell>
  );
}
