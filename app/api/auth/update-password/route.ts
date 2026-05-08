import { getSupabaseServerClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/response";
import { UpdatePasswordSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;
  const parsed = UpdatePasswordSchema.safeParse(body);
  if (!parsed.success) return jsonError({ code: "BAD_REQUEST", error: "Invalid input." }, { status: 400 });

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return jsonError({ code: "AUTH_FAILED", error: error.message }, { status: 401 });

  return jsonOk({ ok: true });
}
