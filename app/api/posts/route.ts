import { z } from "zod";
import { headers } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/response";
import { CreatePostSchema } from "@/lib/validation/posts";
import { derivePostComputedFields } from "@/lib/post-content";
import { slugify } from "@/lib/slug";
import { rateLimit } from "@/lib/rate-limit";

const ListQuerySchema = z.object({
  scope: z.enum(["published", "mine"]).default("published")
});

async function uniqueSlug(supabase: ReturnType<typeof getSupabaseServerClient>, base: string): Promise<string> {
  const normalized = slugify(base);
  let candidate = normalized || `post-${Date.now()}`;
  for (let i = 0; i < 10; i += 1) {
    const { data } = await supabase.from("posts").select("id").eq("slug", candidate).limit(1);
    if (!data || data.length === 0) return candidate;
    candidate = `${normalized}-${i + 2}`;
  }
  return `${normalized}-${crypto.randomUUID().slice(0, 8)}`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = ListQuerySchema.safeParse({ scope: url.searchParams.get("scope") ?? undefined });
  if (!parsed.success) return jsonError({ code: "BAD_REQUEST", error: "Invalid query." }, { status: 400 });

  const supabase = getSupabaseServerClient();

  if (parsed.data.scope === "mine") {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return jsonError({ code: "UNAUTHORIZED", error: "Sign in required." }, { status: 401 });

    const { data, error } = await supabase
      .from("posts")
      .select("id,title,slug,excerpt,cover_image,tags,reading_time,created_at,updated_at,published")
      .eq("author", user.id)
      .order("updated_at", { ascending: false })
      .limit(200);
    if (error) return jsonError({ code: "DB_ERROR", error: "Unable to load posts." }, { status: 500 });
    return jsonOk({ posts: data });
  }

  const { data, error } = await supabase
    .from("posts")
    .select("id,title,slug,excerpt,cover_image,tags,reading_time,created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return jsonError({ code: "DB_ERROR", error: "Unable to load posts." }, { status: 500 });
  return jsonOk({ posts: data });
}

export async function POST(request: Request) {
  const ip = headers().get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(`posts:create:${ip}`, { limit: 20, windowMs: 60_000 });
  if (!rl.ok) {
    return jsonError(
      { code: "RATE_LIMITED", error: "Too many requests. Please try again later." },
      { status: 429, headers: { "retry-after": String(rl.retryAfterSeconds) } }
    );
  }

  const body = (await request.json().catch(() => null)) as unknown;
  const parsed = CreatePostSchema.safeParse(body);
  if (!parsed.success) return jsonError({ code: "BAD_REQUEST", error: "Invalid input." }, { status: 400 });

  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return jsonError({ code: "UNAUTHORIZED", error: "Sign in required." }, { status: 401 });

  const slug = await uniqueSlug(supabase, parsed.data.slug || parsed.data.title);
  const computed = derivePostComputedFields(parsed.data.markdown);

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author: user.id,
      title: parsed.data.title,
      slug,
      markdown: parsed.data.markdown,
      tags: parsed.data.tags,
      cover_image: parsed.data.cover_image ?? null,
      published: parsed.data.published,
      reading_time: computed.reading_time,
      excerpt: computed.excerpt
    })
    .select("id")
    .single();

  if (error) return jsonError({ code: "DB_ERROR", error: "Unable to create post." }, { status: 400 });
  return jsonOk({ id: data.id });
}

