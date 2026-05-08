"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreatePostSchema } from "@/lib/validation/posts";
import { slugify } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

type PostInput = z.infer<typeof CreatePostSchema>;

type EditorProps =
  | { mode: "create" }
  | {
      mode: "edit";
      initial: {
        id: string;
        title: string;
        slug: string;
        markdown: string;
        tags: string[];
        cover_image: string | null;
        published: boolean;
      };
    };

export function PostEditor(props: EditorProps) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const form = useForm<PostInput>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues:
      props.mode === "edit"
        ? {
            title: props.initial.title,
            slug: props.initial.slug,
            markdown: props.initial.markdown,
            tags: props.initial.tags,
            cover_image: props.initial.cover_image ?? null,
            published: props.initial.published
          }
        : {
            title: "",
            slug: "",
            markdown: "",
            tags: [],
            cover_image: null,
            published: false
          }
  });

  const title = form.watch("title");
  const slug = form.watch("slug");

  React.useEffect(() => {
    if (props.mode !== "create") return;
    if (!title) return;
    if (slug) return;
    form.setValue("slug", slugify(title), { shouldValidate: true });
  }, [title, slug, form, props.mode]);

  const [tagsText, setTagsText] = React.useState(() => {
    const current = form.getValues("tags");
    return current.length ? current.join(", ") : "";
  });

  React.useEffect(() => {
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    form.setValue("tags", tags, { shouldValidate: true });
  }, [tagsText, form]);

  async function onSubmit(values: PostInput) {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values)
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      toast({ variant: "destructive", title: "Unable to save", description: data.error ?? "Try again." });
      return;
    }
    const data = (await res.json()) as { id: string };
    toast({ title: "Post created" });
    router.replace(`/dashboard/posts/${data.id}/edit`);
    router.refresh();
  }

  async function onUpdate(values: PostInput) {
    if (props.mode !== "edit") return;
    const res = await fetch(`/api/posts/${props.initial.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values)
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      toast({ variant: "destructive", title: "Unable to update", description: data.error ?? "Try again." });
      return;
    }
    toast({ title: "Saved" });
    router.refresh();
  }

  async function onDelete() {
    if (props.mode !== "edit") return;
    if (!confirm("Delete this post? This cannot be undone.")) return;

    const res = await fetch(`/api/posts/${props.initial.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast({ variant: "destructive", title: "Unable to delete" });
      return;
    }
    toast({ title: "Deleted" });
    router.replace("/dashboard/posts");
    router.refresh();
  }

  async function uploadCoverImage(file: File) {
    const fd = new FormData();
    fd.set("file", file);
    if (props.mode === "edit") fd.set("post_id", props.initial.id);

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      toast({ variant: "destructive", title: "Upload failed", description: data.error ?? "Try again." });
      return;
    }
    const data = (await res.json()) as { url: string };
    form.setValue("cover_image", data.url, { shouldValidate: true, shouldDirty: true });
    toast({ title: "Image uploaded" });
  }

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit(props.mode === "edit" ? onUpdate : onSubmit)}
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Post title" {...form.register("title")} />
              {form.formState.errors.title ? (
                <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" placeholder="post-slug" {...form.register("slug")} />
              {form.formState.errors.slug ? (
                <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
              {form.formState.errors.tags ? (
                <p className="text-xs text-destructive">Invalid tags.</p>
              ) : (
                <p className="text-xs text-muted-foreground">Comma-separated. Letters/numbers/dashes.</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cover_image">Cover image URL</Label>
              <Input id="cover_image" placeholder="https://..." {...form.register("cover_image")} />
              {form.formState.errors.cover_image ? (
                <p className="text-xs text-destructive">{form.formState.errors.cover_image.message}</p>
              ) : null}
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="text-xs"
                  onChange={(e) => {
                    const file = e.target.files?.item(0);
                    if (file) void uploadCoverImage(file);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="markdown">Markdown</Label>
            <Textarea id="markdown" className="min-h-[320px]" {...form.register("markdown")} />
            {form.formState.errors.markdown ? (
              <p className="text-xs text-destructive">{form.formState.errors.markdown.message}</p>
            ) : null}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4" {...form.register("published")} />
            Publish
          </label>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-2">
        {props.mode === "edit" ? (
          <Button type="button" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        ) : (
          <div />
        )}
        <div className="flex gap-2">
          {props.mode === "edit" ? (
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Save changes
            </Button>
          ) : (
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Create post
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
