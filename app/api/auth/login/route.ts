import { headers } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/response";
import { rateLimit } from "@/lib/rate-limit";
import { LoginSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  const ip = headers().get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(`auth:login:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return jsonError(
      { code: "RATE_LIMITED", error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "retry-after": String(rl.retryAfterSeconds) } }
    );
  }

  const body = (await request.json().catch(() => null)) as unknown;
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) return jsonError({ code: "BAD_REQUEST", error: "Invalid input." }, { status: 400 });

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return jsonError({ code: "AUTH_FAILED", error: error.message }, { status: 401 });

  return jsonOk({ ok: true });
}
