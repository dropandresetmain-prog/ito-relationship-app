"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = {
  error?: string;
};

export async function saveProfile(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const user = await requireUser();
  const displayName = String(formData.get("display_name") ?? "").trim();
  const redirectTo = String(formData.get("redirect") ?? "/");

  if (!displayName || displayName.length < 1) {
    return { error: "Display name is required." };
  }

  if (displayName.length > 80) {
    return { error: "Display name must be 80 characters or fewer." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: displayName,
  });

  if (error) return { error: error.message };

  redirect(redirectTo.startsWith("/") ? redirectTo : "/");
}
