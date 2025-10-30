import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  price_cents: z.number().int().nonnegative(),
  stock_qty: z.number().int().nonnegative().default(0)
});
export const UpdateProductSchema = CreateProductSchema.partial();

export const AdjustStockSchema = z.object({
  delta: z.number().int(),        // +entrada / -saída
  reason: z.string().min(2)
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type AdjustStockInput  = z.infer<typeof AdjustStockSchema>;
