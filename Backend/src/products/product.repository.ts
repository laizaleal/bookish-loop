import { sql, withTx, type DbTransaction } from '../database/client';

export async function listProductsRepo() {
  return sql/*sql*/`SELECT id, name, sku, price_cents, stock_qty, created_at FROM products ORDER BY created_at DESC`;
}
export async function getProductRepo(id: string) {
  const rows = await sql/*sql*/`SELECT id, name, sku, price_cents, stock_qty, created_at FROM products WHERE id = ${id}`;
  return rows[0] ?? null;
}
export async function createProductRepo(input: any) {
  const rows = await sql/*sql*/`
    INSERT INTO products (name, sku, price_cents, stock_qty)
    VALUES (${input.name}, ${input.sku}, ${input.price_cents}, ${input.stock_qty ?? 0})
    RETURNING id, name, sku, price_cents, stock_qty, created_at
  `;
  return rows[0];
}
export async function updateProductRepo(id: string, input: any) {
  const rows = await sql/*sql*/`
    UPDATE products
       SET name = COALESCE(${input.name}, name),
           sku = COALESCE(${input.sku}, sku),
           price_cents = COALESCE(${input.price_cents}, price_cents),
           stock_qty = COALESCE(${input.stock_qty}, stock_qty)
     WHERE id = ${id}
     RETURNING id, name, sku, price_cents, stock_qty, created_at
  `;
  return rows[0] ?? null;
}
export async function adjustStockRepo(id: string, delta: number, reason: string) {
  return withTx(async (tx: DbTransaction) => {
    const [p] = await tx/*sql*/`SELECT id, stock_qty FROM products WHERE id = ${id} FOR UPDATE`;
    if (!p) return null;
    const newQty = p.stock_qty + delta;
    if (newQty < 0) throw Object.assign(new Error('Estoque insuficiente para ajuste'), { status: 409 });

    await tx/*sql*/`UPDATE products SET stock_qty = ${newQty} WHERE id = ${id}`;
    await tx/*sql*/`
      INSERT INTO stock_movements (product_id, delta_qty, reason)
      VALUES (${id}, ${delta}, ${reason})
    `;
    const [updated] = await tx/*sql*/`SELECT id, name, sku, price_cents, stock_qty, created_at FROM products WHERE id = ${id}`;
    return updated;
  });
}
