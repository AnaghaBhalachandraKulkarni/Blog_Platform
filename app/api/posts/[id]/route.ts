import { z } from "zod";
import { headers } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/response";
import { UpdatePostSchema } from "@/lib/validation/posts";
import { derivePostComputedFields } from "@/lib/post-content";
import { rateLimit } from "@/lib/rate-limit";
import type { Database } from "@/types/supabase";

const ParamsSchema = z.object({ id: z.string().uuid() });

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const p = ParamsSchema.safeParse(params);
  if (!p.success) return jsonError({ code: "BAD_REQUEST", error: "Invalid id." }, { status: 400 });

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id,title,slug,excerpt,cover_image,tags,reading_time,created_at,updated_at,markdown,author,published")
    .eq("id", p.data.id)
    .maybeSingle();

  if (error) return jsonError({ code: "DB_ERROR", error: "Unable to load post." }, { status: 500 });
  if (!data) return jsonError({ code: "NOT_FOUND", error: "Not found." }, { status: 404 });
  return jsonOk({ post: data });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const ip = headers().get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(`posts:update:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!rl.ok) {
    return jsonError(
      { code: "RATE_LIMITED", error: "Too many requests. Please try again later." },
      { status: 429, headers: { "retry-after": String(rl.retryAfterSeconds) } }
    );
  }

  const p = ParamsSchema.safeParse(params);
  if (!p.success) return jsonError({ code: "BAD_REQUEST", error: "Invalid id." }, { status: 400 });

  const body = (await request.json().catch(() => null)) as unknown;
  const parsed = UpdatePostSchema.safeParse({ ...(typeof body === "object" && body ? body : {}), id: p.data.id });
  if (!parsed.success) return jsonError({ code: "BAD_REQUEST", error: "Invalid input." }, { status: 400 });

  const supabase = getSupabaseServerClient();
  type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];
  const { id: _id, ...rest } = parsed.data;
  const patch: PostUpdate = { ...rest };

  if (typeof patch.markdown === "string") {
    const computed = derivePostComputedFields(patch.markdown);
    patch.reading_time = computed.reading_time;
    patch.excerpt = computed.excerpt;
  }

  const { error } = await supabase.from("posts").update(patch).eq("id", p.data.id);
  if (error) return jsonError({ code: "DB_ERROR", error: "Unable to update post." }, { status: 400 });
  return jsonOk({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const p = ParamsSchema.safeParse(params);
  if (!p.success) return jsonError({ code: "BAD_REQUEST", error: "Invalid id." }, { status: 400 });

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("posts").delete().eq("id", p.data.id);
  if (error) return jsonError({ code: "DB_ERROR", error: "Unable to delete post." }, { status: 400 });
  return jsonOk({ ok: true });
}
