"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthError } from "@/components/auth/auth-error";
import { toast } from "@/components/ui/use-toast";
import { ResetPasswordSchema } from "@/lib/validation/auth";

import type { z } from "zod";
type Values = z.infer<typeof ResetPasswordSchema>;

export function ResetPasswordForm() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [sent, setSent] = React.useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { email: "" },
    mode: "onSubmit"
  });

  async function onSubmit(values: Values) {
    setServerError(null);
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values)
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setServerError(data.error ?? "Unable to request reset.");
      return;
    }
    setSent(true);
    toast({ title: "Email sent", description: "If the account exists, you'll receive reset instructions." });
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <AuthError message={serverError} />
      {sent ? (
        <div className="rounded-md border bg-muted p-3 text-sm">
          If an account exists for that email, we sent reset instructions.
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        Send reset email
      </Button>
    </form>
  );
}
