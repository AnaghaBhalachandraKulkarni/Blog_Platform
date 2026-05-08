import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PostDetail, PostListItem } from "@/services/posts/types";

export const getMyPosts = cache(async (): Promise<PostListItem[]> => {
  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("posts")
    .select("id,title,slug,excerpt,cover_image,tags,reading_time,created_at")
    .eq("author", user.id)
    .order("updated_at", { ascending: false })
    .limit(200);
  if (error || !data) return [];
  return data;
});

export const getPostForEditing = cache(async (id: string): Promise<PostDetail | null> => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id,title,slug,excerpt,cover_image,tags,reading_time,created_at,updated_at,markdown,author,published")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data;
});

