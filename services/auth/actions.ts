"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getPublicEnv } from "@/lib/env";
import { log } from "@/lib/log";

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12).max(200),
  displayName: z.string().min(2).max(80)
});

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200)
});

const ResetSchema = z.object({
  email: z.string().email()
});

const UpdatePasswordSchema = z.object({
  password: z.string().min(12).max(200)
});

export type ActionState = { ok: true } | { ok: false; error: string };

export async function signUpAction(_: ActionState | null, formData: FormData): Promise<ActionState> {
  const parsed = SignUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName")
  });
  if (!parsed.success) return { ok: false, error: "Invalid input." };

  const supabase = getSupabaseServerClient();
  const env = getPublicEnv();

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/dashboard`,
      data: {
        display_name: parsed.data.displayName
      }
    }
  });

  if (error) {
    log.warn("signup_failed", { message: error.message });
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function signInAction(_: ActionState | null, formData: FormData): Promise<ActionState> {
  const parsed = SignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });
  if (!parsed.success) return { ok: false, error: "Invalid input." };

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}

export async function signOutAction(): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordResetAction(
  _: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const parsed = ResetSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { ok: false, error: "Invalid email." };

  const supabase = getSupabaseServerClient();
  const env = getPublicEnv();

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password/update`
  });
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}

export async function updatePasswordAction(
  _: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const parsed = UpdatePasswordSchema.safeParse({ password: formData.get("password") });
  if (!parsed.success) return { ok: false, error: "Password must be at least 12 characters." };

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}

