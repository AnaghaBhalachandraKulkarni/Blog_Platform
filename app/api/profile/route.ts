import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/response";

const Schema = z.object({
  display_name: z.string().trim().min(2).max(80).nullable(),
  avatar_url: z.union([z.string().url(), z.literal(""), z.null()]).transform((v) => (v === "" ? null : v ?? null))
});

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return jsonError({ code: "BAD_REQUEST", error: "Invalid input." }, { status: 400 });

  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return jsonError({ code: "UNAUTHORIZED", error: "Sign in required." }, { status: 401 });

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: parsed.data.display_name, avatar_url: parsed.data.avatar_url })
    .eq("id", user.id);
  if (error) return jsonError({ code: "DB_ERROR", error: "Unable to update profile." }, { status: 400 });

  return jsonOk({ ok: true });
}

