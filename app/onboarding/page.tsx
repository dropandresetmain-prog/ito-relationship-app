import Link from "next/link";
import { Suspense } from "react";
import { ItoPaperShell } from "@/components/ItoPaperShell";
import { ProfileForm } from "@/components/ProfileForm";

export default function OnboardingPage() {
  return (
    <ItoPaperShell
      title="Create your Ito profile"
      subtitle="Before you tie threads, give your tree a name."
      showNav={false}
    >
      <div className="flex flex-col gap-6">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
          <ProfileForm />
        </Suspense>
        <p className="text-center text-xs text-muted-foreground">
          A small pulse can mean a lot.
        </p>
        <Link
          href="/auth"
          className="text-center text-xs font-medium text-[var(--thread)] hover:text-foreground"
        >
          Wrong account? Sign in again
        </Link>
      </div>
    </ItoPaperShell>
  );
}
