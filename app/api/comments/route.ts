import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/response";
import { CreateCommentSchema } from "@/lib/validation/comments";

const QuerySchema = z.object({
  post_id: z.string().uuid()
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = QuerySchema.safeParse({ post_id: url.searchParams.get("post_id") });
  if (!parsed.success) return jsonError({ code: "BAD_REQUEST", error: "Missing post_id." }, { status: 400 });

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
    .eq("post_id", parsed.data.post_id)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) return jsonError({ code: "DB_ERROR", error: "Unable to load comments." }, { status: 500 });

  const comments = data.map((row) => ({
    id: row.id,
    post_id: row.post_id,
    user_id: row.user_id,
    body: row.body,
    created_at: row.created_at,
    author_display_name: row.profiles?.display_name ?? null
  }));

  return jsonOk({ comments });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;
  const parsed = CreateCommentSchema.safeParse(body);
  if (!parsed.success) return jsonError({ code: "BAD_REQUEST", error: "Invalid input." }, { status: 400 });

  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return jsonError({ code: "UNAUTHORIZED", error: "Sign in required." }, { status: 401 });

  const { error } = await supabase.from("comments").insert({
    post_id: parsed.data.post_id,
    user_id: user.id,
    body: parsed.data.body
  });

  if (error) return jsonError({ code: "DB_ERROR", error: "Unable to post comment." }, { status: 400 });

  return jsonOk({ ok: true });
}
