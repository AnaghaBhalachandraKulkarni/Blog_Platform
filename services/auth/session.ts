import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const getServerSession = cache(async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user ?? null;
});

