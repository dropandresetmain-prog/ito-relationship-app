import { notFound } from "next/navigation";
import { ItoPaperShell } from "@/components/ItoPaperShell";
import { AcceptInviteForm } from "@/components/AcceptInviteForm";
import { itoCardClass } from "@/lib/ito-ui";
import { createClient } from "@/lib/supabase/server";
import { getInvitePreview } from "@/lib/threads/queries";
import { cn } from "@/lib/utils";

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
    <ItoPaperShell
      title="Accept a thread"
      subtitle="Your thread is tied privately — not a group chat or public profile."
      showNav={false}
    >
      <div className="flex flex-col gap-6">
        <div className={cn(itoCardClass, "text-center")}>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--thread)]">
            Invite code
          </p>
          <p className="font-heading mt-2 text-3xl font-semibold tracking-widest text-foreground">
            {code.toUpperCase()}
          </p>
        </div>

        <AcceptInviteForm
          code={code}
          preview={preview}
          isLoggedIn={!!user}
          hasProfile={hasProfile}
        />
      </div>
    </ItoPaperShell>
  );
}
