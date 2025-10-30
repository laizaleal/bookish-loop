import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(6).max(100)
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100)
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
