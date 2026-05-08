import { headers } from "next/headers";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/response";
import { rateLimit } from "@/lib/rate-limit";

const MetaSchema = z.object({
  post_id: z.string().uuid().optional()
});

function extensionFromType(type: string): string | null {
  if (type === "image/png") return "png";
  if (type === "image/jpeg") return "jpg";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return null;
}

export async function POST(request: Request) {
  const ip = headers().get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(`upload:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.ok) {
    return jsonError(
      { code: "RATE_LIMITED", error: "Too many uploads. Please try again later." },
      { status: 429, headers: { "retry-after": String(rl.retryAfterSeconds) } }
    );
  }

  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return jsonError({ code: "UNAUTHORIZED", error: "Sign in required." }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const role = profile?.role ?? "reader";
  if (role !== "writer" && role !== "admin") {
    return jsonError({ code: "FORBIDDEN", error: "Writer role required." }, { status: 403 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const metaParsed = MetaSchema.safeParse({ post_id: form.get("post_id") ?? undefined });
  if (!metaParsed.success) return jsonError({ code: "BAD_REQUEST", error: "Invalid metadata." }, { status: 400 });

  if (!(file instanceof File)) {
    return jsonError({ code: "BAD_REQUEST", error: "Missing file." }, { status: 400 });
  }

  const ext = extensionFromType(file.type);
  if (!ext) {
    return jsonError({ code: "BAD_REQUEST", error: "Unsupported file type." }, { status: 400 });
  }

  const maxBytes = 5 * 1024 * 1024;
  if (file.size <= 0 || file.size > maxBytes) {
    return jsonError({ code: "BAD_REQUEST", error: "File too large." }, { status: 400 });
  }

  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage.from("post-images").upload(path, file, {
    contentType: file.type,
    upsert: false
  });
  if (uploadError) return jsonError({ code: "UPLOAD_FAILED", error: uploadError.message }, { status: 400 });

  if (metaParsed.data.post_id) {
    const { error: imageError } = await supabase
      .from("post_images")
      .insert({ post_id: metaParsed.data.post_id, path });
    if (imageError) {
      return jsonError({ code: "DB_ERROR", error: "Uploaded but failed to attach image to post." }, { status: 400 });
    }
  }

  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return jsonOk({ path, url: data.publicUrl });
}
