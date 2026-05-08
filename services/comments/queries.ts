import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { CommentItem } from "@/services/comments/types";

export const getCommentsForPost = cache(async (postId: string): Promise<CommentItem[]> => {
  const supabase = getSupabaseServerClient();
  type Row = {
    id: string;
    post_id: string;
    user_id: string;
    body: string;
    created_at: string;
    profiles: { display_name: string | null } | null;
  };

  const { data, error } = await supabase
    .from("comments")
    .select("id, post_id, user_id, body, created_at, profiles(display_name)")
    .returns<Row[]>()
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    post_id: row.post_id,
    user_id: row.user_id,
    body: row.body,
    created_at: row.created_at,
    author_display_name: row.profiles?.display_name ?? null
  }));
});
