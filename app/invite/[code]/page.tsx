import Link from "next/link";
import { AppShell } from "@/components/AppShell";

interface InvitePageProps {
  params: Promise<{ code: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { code } = await params;

  return (
    <AppShell title="Accept a thread" showNav={false}>
      <div className="flex flex-1 flex-col gap-6">
        <div className="rounded-2xl border border-thread-100 bg-white p-5 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-thread-600">
            Invite code
          </p>
          <p className="mt-2 text-3xl font-bold tracking-widest text-thread-700">
            {code.toUpperCase()}
          </p>
          <p className="mt-3 text-sm text-warm-900/60">
            Someone wants to tie a private thread with you on Ito.
          </p>
        </div>

        <p className="text-sm text-warm-900/55">
          Accepting will link your tree to theirs. This is not a group chat or a
          public profile.
        </p>

        <div className="mt-auto flex flex-col gap-3">
          <button
            type="button"
            disabled
            className="rounded-xl bg-thread-600 py-3.5 text-sm font-medium text-white opacity-50"
          >
            Accept thread (mock)
          </button>
          <Link
            href="/threads"
            className="rounded-xl border border-warm-100 py-3.5 text-center text-sm font-medium text-thread-600"
          >
            Not now
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
