import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/response";
import { getMyProfile } from "@/services/profiles/queries";

const ParamsSchema = z.object({ id: z.string().uuid() });

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const p = ParamsSchema.safeParse(params);
  if (!p.success) return jsonError({ code: "BAD_REQUEST", error: "Invalid id." }, { status: 400 });

  const actor = await getMyProfile();
  if (!actor) return jsonError({ code: "UNAUTHORIZED", error: "Sign in required." }, { status: 401 });
  if (actor.role !== "admin") return jsonError({ code: "FORBIDDEN", error: "Admin only." }, { status: 403 });

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("comments").delete().eq("id", p.data.id);
  if (error) return jsonError({ code: "DB_ERROR", error: "Unable to delete comment." }, { status: 400 });
  return jsonOk({ ok: true });
}

