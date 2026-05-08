"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthError } from "@/components/auth/auth-error";
import { toast } from "@/components/ui/use-toast";
import { UpdatePasswordSchema } from "@/lib/validation/auth";

import type { z } from "zod";
type Values = z.infer<typeof UpdatePasswordSchema>;

export function UpdatePasswordForm() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: { password: "" },
    mode: "onSubmit"
  });

  async function onSubmit(values: Values) {
    setServerError(null);
    const res = await fetch("/api/auth/update-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values)
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setServerError(data.error ?? "Unable to update password.");
      return;
    }
    toast({ title: "Password updated", description: "You can continue to your dashboard." });
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <AuthError message={serverError} />
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input id="password" type="password" autoComplete="new-password" {...form.register("password")} />
        {form.formState.errors.password ? (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        Update password
      </Button>
    </form>
  );
}
