import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PostDetail, PostListItem } from "@/services/posts/types";

export const getPublishedPosts = cache(async (): Promise<PostListItem[]> => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id,title,slug,excerpt,cover_image,tags,reading_time,created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error || !data) return [];
  return data;
});

export const getPublishedPostBySlug = cache(async (slug: string): Promise<PostDetail | null> => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id,title,slug,excerpt,cover_image,tags,reading_time,created_at,updated_at,markdown,author,published")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error || !data) return null;
  return data;
});

