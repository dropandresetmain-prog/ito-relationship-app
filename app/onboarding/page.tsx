import Link from "next/link";
import { AppShell } from "@/components/AppShell";

export default function OnboardingPage() {
  return (
    <AppShell title="Welcome to Ito" showNav={false}>
      <div className="flex flex-1 flex-col gap-6">
        <div className="rounded-2xl border border-thread-100 bg-white p-5">
          <p className="text-3xl" aria-hidden>
            🧵
          </p>
          <h2 className="mt-3 text-xl font-semibold text-warm-900">
            Private threads, gentle pulses
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-warm-900/65">
            Ito is inspired by the red thread of fate — a quiet way to stay
            present with people you care about. Not a chat app. Not social media.
          </p>
        </div>

        <ul className="space-y-3 text-sm text-warm-900/70">
          <li>
            <span className="font-medium text-warm-900">Tree</span> — your rooted
            identity
          </li>
          <li>
            <span className="font-medium text-warm-900">Thread</span> — a private
            connection with someone you love
          </li>
          <li>
            <span className="font-medium text-warm-900">Pulse</span> — a small tap
            of attention
          </li>
          <li>
            <span className="font-medium text-warm-900">Moment</span> — a fleeting
            photo update (coming later)
          </li>
        </ul>

        <p className="text-sm text-warm-900/55">
          Share a small piece of today when it feels right.
        </p>

        <div className="mt-auto flex flex-col gap-3">
          <Link
            href="/threads/new"
            className="rounded-xl bg-thread-600 py-3.5 text-center text-sm font-medium text-white"
          >
            Tie a thread
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-warm-100 py-3.5 text-center text-sm font-medium text-thread-600"
          >
            Explore the shell
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
