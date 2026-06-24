import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { AcceptInviteForm } from "@/components/AcceptInviteForm";
import { createClient } from "@/lib/supabase/server";
import { getInvitePreview } from "@/lib/threads/queries";

interface InvitePageProps {
  params: Promise<{ code: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { code } = await params;
  const preview = await getInvitePreview(code);

  if (!preview) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasProfile = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    hasProfile = !!profile;
  }

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
        </div>

        <p className="text-sm text-warm-900/55">
          Accepting will link your tree to theirs. This is not a group chat or a
          public profile.
        </p>

        <AcceptInviteForm
          code={code}
          preview={preview}
          isLoggedIn={!!user}
          hasProfile={hasProfile}
        />
      </div>
    </AppShell>
  );
}
