import Link from "next/link";
import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { ProfileForm } from "@/components/ProfileForm";

export default function OnboardingPage() {
  return (
    <AppShell title="Your tree" showNav={false}>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-semibold text-warm-900">Welcome to Ito</h2>
          <p className="mt-2 text-sm text-warm-900/60">
            Before you tie threads, plant your tree with a display name.
          </p>
        </div>
        <Suspense fallback={<p className="text-sm text-warm-900/50">Loading…</p>}>
          <ProfileForm />
        </Suspense>
        <p className="text-xs text-warm-900/45">
          Share a small piece of today when it feels right.
        </p>
        <Link href="/auth" className="text-center text-xs text-thread-600">
          Wrong account? Sign in again
        </Link>
      </div>
    </AppShell>
  );
}
