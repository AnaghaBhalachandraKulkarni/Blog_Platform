import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200)
});

export const SignUpSchema = z.object({
  displayName: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(12).max(200)
});

export const ResetPasswordSchema = z.object({
  email: z.string().email()
});

export const UpdatePasswordSchema = z.object({
  password: z.string().min(12).max(200)
});

