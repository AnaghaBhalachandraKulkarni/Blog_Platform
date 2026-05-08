import { headers } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getPublicEnv } from "@/lib/env";
import { jsonError, jsonOk } from "@/lib/api/response";
import { rateLimit } from "@/lib/rate-limit";
import { ResetPasswordSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  const ip = headers().get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(`auth:reset:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return jsonError(
      { code: "RATE_LIMITED", error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "retry-after": String(rl.retryAfterSeconds) } }
    );
  }

  const body = (await request.json().catch(() => null)) as unknown;
  const parsed = ResetPasswordSchema.safeParse(body);
  if (!parsed.success) return jsonError({ code: "BAD_REQUEST", error: "Invalid input." }, { status: 400 });

  const supabase = getSupabaseServerClient();
  const env = getPublicEnv();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password/update`
  });
  if (error) return jsonError({ code: "AUTH_FAILED", error: error.message }, { status: 400 });

  return jsonOk({ ok: true });
}
