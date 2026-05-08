import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const getPublishedPostSlugs = cache(async (): Promise<string[]> => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("slug")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) return [];
  return data.map((row) => row.slug);
});

