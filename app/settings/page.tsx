import { ItoPaperShell } from "@/components/ItoPaperShell";
import { SignOutButton } from "@/components/SignOutButton";
import { itoCardClass } from "@/lib/ito-ui";
import { requireProfile } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

export default async function SettingsPage() {
  const { profile, user } = await requireProfile();

  return (
    <ItoPaperShell title="Settings" subtitle="Your Ito account and preferences.">
      <div className="flex flex-col gap-4">
        <section className={cn(itoCardClass, "divide-y divide-border p-0")}>
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-foreground">Profile</p>
            <p className="text-sm text-muted-foreground">{profile.display_name}</p>
            <p className="text-xs text-muted-foreground/80">{user.email}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-foreground">Notifications</p>
            <p className="text-xs text-muted-foreground">
              Gentle pulse alerts — planned for a later milestone.
            </p>
          </div>
        </section>

        <SignOutButton />
      </div>
    </ItoPaperShell>
  );
}
