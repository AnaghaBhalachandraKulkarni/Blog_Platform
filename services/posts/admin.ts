import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AdminPostRow = {
  id: string;
  title: string;
  slug: string;
  author: string;
  published: boolean;
  updated_at: string;
  created_at: string;
};

export const getAllPostsForAdmin = cache(async (): Promise<AdminPostRow[]> => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id,title,slug,author,published,updated_at,created_at")
    .order("updated_at", { ascending: false })
    .limit(500);
  if (error || !data) return [];
  return data;
});

