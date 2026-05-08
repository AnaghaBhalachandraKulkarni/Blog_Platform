import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";
import { getPublicEnv } from "@/lib/env";

export function getSupabaseServerClient(): SupabaseClient<Database> {
  const cookieStore = cookies();
  const env = getPublicEnv();

  return createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // In Server Components, mutating cookies can throw. Refreshes that require setting cookies
        // should happen in Middleware or Route Handlers.
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // no-op
        }
      }
    }
  });
}
