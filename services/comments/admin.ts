import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AdminCommentRow = {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  created_at: string;
  post_slug: string | null;
  post_title: string | null;
};

export const getRecentCommentsForAdmin = cache(async (): Promise<AdminCommentRow[]> => {
  const supabase = getSupabaseServerClient();
  type Row = {
    id: string;
    post_id: string;
    user_id: string;
    body: string;
    created_at: string;
    posts: { slug: string; title: string } | null;
  };

  const { data, error } = await supabase
    .from("comments")
    .select("id,post_id,user_id,body,created_at,posts(slug,title)")
    .returns<Row[]>()
    .order("created_at", { ascending: false })
    .limit(200);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    post_id: row.post_id,
    user_id: row.user_id,
    body: row.body,
    created_at: row.created_at,
    post_slug: row.posts?.slug ?? null,
    post_title: row.posts?.title ?? null
  }));
});
