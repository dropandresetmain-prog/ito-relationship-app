import { AppShell } from "@/components/AppShell";
import { SignOutButton } from "@/components/SignOutButton";
import { requireProfile } from "@/lib/auth/session";

export default async function SettingsPage() {
  const { profile, user } = await requireProfile();

  return (
    <AppShell title="Settings">
      <div className="flex flex-col gap-4">
        <section className="divide-y divide-warm-100 rounded-2xl border border-warm-100 bg-white">
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-warm-900">Profile</p>
            <p className="text-sm text-warm-900/60">{profile.display_name}</p>
            <p className="text-xs text-warm-900/40">{user.email}</p>
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
              Optional prompts — never guilt-based (coming later)
            </p>
          </div>
        </section>

        <SignOutButton />
      </div>
    </AppShell>
  );
}
