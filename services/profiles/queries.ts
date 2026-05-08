import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: "admin" | "writer" | "reader";
};

export const getMyProfile = cache(async (): Promise<Profile | null> => {
  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return null;
  return data;
});

