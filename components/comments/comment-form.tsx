"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const Schema = z.object({
  body: z.string().trim().min(1, "Comment cannot be empty.").max(2000)
});
type Values = z.infer<typeof Schema>;

export function CommentForm({ postId, isAuthenticated }: { postId: string; isAuthenticated: boolean }) {
  const router = useRouter();
  const form = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: { body: "" }
  });

  const [loading, setLoading] = React.useState(false);

  async function onSubmit(values: Values) {
    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ post_id: postId, body: values.body })
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        toast({ variant: "destructive", title: "Unable to comment", description: data.error ?? "Try again." });
        return;
      }
      form.reset();
      toast({ title: "Comment posted" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <p className="text-sm text-muted-foreground">
        <Link href="/login" className="underline underline-offset-4">
          Sign in
        </Link>{" "}
        to comment.
      </p>
    );
  }

  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
      <Textarea placeholder="Write a comment…" {...form.register("body")} />
      {form.formState.errors.body ? (
        <p className="text-xs text-destructive">{form.formState.errors.body.message}</p>
      ) : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading || form.formState.isSubmitting}>
          Post comment
        </Button>
      </div>
    </form>
  );
}
