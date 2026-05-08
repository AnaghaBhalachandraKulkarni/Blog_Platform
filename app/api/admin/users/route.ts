import { getSupabaseServerClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/response";
import { getMyProfile } from "@/services/profiles/queries";

export async function GET() {
  const profile = await getMyProfile();
  if (!profile) return jsonError({ code: "UNAUTHORIZED", error: "Sign in required." }, { status: 401 });
  if (profile.role !== "admin") return jsonError({ code: "FORBIDDEN", error: "Admin only." }, { status: 403 });

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, role, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return jsonError({ code: "DB_ERROR", error: "Unable to load users." }, { status: 500 });
  return jsonOk({ profiles: data });
}

