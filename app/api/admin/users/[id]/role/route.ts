import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api/response";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getMyProfile } from "@/services/profiles/queries";

const Schema = z.object({ role: z.enum(["admin", "writer", "reader"]) });

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const actor = await getMyProfile();
  if (!actor) return jsonError({ code: "UNAUTHORIZED", error: "Sign in required." }, { status: 401 });
  if (actor.role !== "admin") return jsonError({ code: "FORBIDDEN", error: "Admin only." }, { status: 403 });

  const body = (await request.json().catch(() => null)) as unknown;
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return jsonError({ code: "BAD_REQUEST", error: "Invalid role." }, { status: 400 });

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("profiles").update({ role: parsed.data.role }).eq("id", params.id);
  if (error) return jsonError({ code: "DB_ERROR", error: "Unable to update role." }, { status: 400 });

  return jsonOk({ ok: true });
}

