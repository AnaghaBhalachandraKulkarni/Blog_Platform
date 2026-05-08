"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const Schema = z.object({
  display_name: z.string().trim().min(2).max(80).nullable(),
  avatar_url: z.union([z.string().url(), z.literal(""), z.null()]).transform((v) => (v === "" ? null : v ?? null))
});
type Values = z.infer<typeof Schema>;

export function ProfileForm({
  initial
}: {
  initial: { display_name: string | null; avatar_url: string | null };
}) {
  const form = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: {
      display_name: initial.display_name,
      avatar_url: initial.avatar_url
    }
  });

  async function onSubmit(values: Values) {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values)
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      toast({ variant: "destructive", title: "Unable to save", description: data.error ?? "Try again." });
      return;
    }
    toast({ title: "Saved" });
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="display_name">Display name</Label>
            <Input id="display_name" {...form.register("display_name")} />
            {form.formState.errors.display_name ? (
              <p className="text-xs text-destructive">{form.formState.errors.display_name.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar_url">Avatar URL</Label>
            <Input id="avatar_url" placeholder="https://..." {...form.register("avatar_url")} />
            {form.formState.errors.avatar_url ? (
              <p className="text-xs text-destructive">{form.formState.errors.avatar_url.message}</p>
            ) : null}
          </div>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

