import { z } from "zod";

export const PostTagSchema = z
  .string()
  .trim()
  .min(1)
  .max(32)
  .regex(/^[a-z0-9][a-z0-9-]*$/i, "Tags may contain letters, numbers, and dashes.");

export const CreatePostSchema = z.object({
  title: z.string().trim().min(3).max(140),
  slug: z.string().trim().min(3).max(96).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  markdown: z.string().min(1).max(200_000),
  tags: z.array(PostTagSchema).max(10).default([]),
  cover_image: z
    .union([z.string().url(), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v === "" ? null : v ?? null)),
  published: z.boolean().default(false)
});

export const UpdatePostSchema = CreatePostSchema.partial().extend({
  id: z.string().uuid()
});
