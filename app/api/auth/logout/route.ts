import { getSupabaseServerClient } from "@/lib/supabase/server";
import { jsonOk } from "@/lib/api/response";

export async function POST() {
  const supabase = getSupabaseServerClient();
  await supabase.auth.signOut();
  return jsonOk({ ok: true });
}

