import { z } from "zod";

export const CreateCommentSchema = z.object({
  post_id: z.string().uuid(),
  body: z.string().trim().min(1).max(2000)
});

