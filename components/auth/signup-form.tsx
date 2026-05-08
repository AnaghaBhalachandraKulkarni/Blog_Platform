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
import { SignUpSchema } from "@/lib/validation/auth";

import type { z } from "zod";
type Values = z.infer<typeof SignUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { displayName: "", email: "", password: "" },
    mode: "onSubmit"
  });

  async function onSubmit(values: Values) {
    setServerError(null);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values)
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setServerError(data.error ?? "Unable to sign up.");
      return;
    }
    setSuccess(true);
    toast({ title: "Check your email", description: "Confirm your account to finish signup." });
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <AuthError message={serverError} />
      {success ? (
        <div className="rounded-md border bg-muted p-3 text-sm">
          We sent you a confirmation email. After confirming, you can sign in.
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="displayName">Display name</Label>
        <Input id="displayName" autoComplete="name" {...form.register("displayName")} />
        {form.formState.errors.displayName ? (
          <p className="text-xs text-destructive">{form.formState.errors.displayName.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete="new-password" {...form.register("password")} />
        <p className="text-xs text-muted-foreground">Use at least 12 characters.</p>
        {form.formState.errors.password ? (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        Create account
      </Button>
    </form>
  );
}
