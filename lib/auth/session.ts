import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/auth");
  return user;
}

export async function requireProfile(): Promise<{
  user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>>;
  profile: Profile;
}> {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!profile) redirect("/onboarding");

  return { user, profile: profile as Profile };
}
