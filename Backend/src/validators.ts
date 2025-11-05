import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  price: z.number().nonnegative(),
  condition: z.enum(['novo','seminovo','usado']),
  stock: z.number().int().nonnegative(),
  isbn: z.string().min(5).max(20).optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const updateBookSchema = createBookSchema.partial();

export const createCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(8).max(20).optional().nullable(),
});
