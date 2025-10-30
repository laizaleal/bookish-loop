import { withTx, type DbTransaction } from '../database/client';

type ProductRow = {
  id: string;
  price_cents: number;
  stock_qty: number;
};

type OrderRow = {
  id: string;
  user_id: string;
  status: string;
  total_cents: number;
  created_at: Date;
};

type OrderItemRow = {
  product_id: string;
  quantity: number;
  unit_price_cents: number;
  subtotal_cents: number;
};

type OrderSummaryRow = Pick<OrderRow, 'id' | 'status' | 'total_cents' | 'created_at'>;

export async function createOrderWithItemsRepo(userId: string, items: { product_id: string; quantity: number }[]) {
  return withTx(async (tx: DbTransaction) => {
    // carrega produtos
    const ids = items.map(i => i.product_id);
    const products = await tx<ProductRow[]>`
      SELECT id, price_cents, stock_qty FROM products WHERE id IN ${tx(ids)}
    `;
    if (products.length !== ids.length) throw Object.assign(new Error('Produto não encontrado'), { status: 400 });

    // checa estoque
    for (const it of items) {
      const p = products.find((pp: ProductRow) => pp.id === it.product_id)!;
      if (p.stock_qty < it.quantity) throw Object.assign(new Error('Estoque insuficiente'), { status: 409 });
    }

    // cria pedido
    const [order] = await tx<OrderRow[]>`
      INSERT INTO orders (user_id, status, total_cents)
      VALUES (${userId}, 'CREATED', 0)
      RETURNING id, user_id, status, total_cents, created_at
    `;

    // insere itens, baixa estoque
    let total = 0;
    for (const it of items) {
      const p = products.find(pp => pp.id === it.product_id)!;
      const subtotal = p.price_cents * it.quantity; total += subtotal;

      await tx`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents, subtotal_cents)
        VALUES (${order.id}, ${it.product_id}, ${it.quantity}, ${p.price_cents}, ${subtotal})
      `;
      const newQty = p.stock_qty - it.quantity;
      await tx`UPDATE products SET stock_qty = ${newQty} WHERE id = ${it.product_id}`;
      await tx`
        INSERT INTO stock_movements (product_id, delta_qty, reason, ref_id)
        VALUES (${it.product_id}, ${-it.quantity}, 'order_creation', ${order.id})
      `;
    }

    const [updated] = await tx<OrderRow[]>`
      UPDATE orders SET total_cents = ${total} WHERE id = ${order.id}
      RETURNING id, user_id, status, total_cents, created_at
    `;
    return updated;
  });
}

export async function listOrdersByUserRepo(userId: string) {
  return withTx((tx: DbTransaction) => tx<OrderSummaryRow[]>`
    SELECT id, status, total_cents, created_at
    FROM orders WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `);
}

export async function getOrderWithItemsRepo(userId: string, orderId: string) {
  return withTx(async (tx: DbTransaction) => {
    const [o] = await tx<OrderRow[]>`
      SELECT id, user_id, status, total_cents, created_at
      FROM orders WHERE id = ${orderId} AND user_id = ${userId}
    `;
    if (!o) return null;
    const items = await tx<OrderItemRow[]>`
      SELECT product_id, quantity, unit_price_cents, subtotal_cents
      FROM order_items WHERE order_id = ${orderId}
    `;
    return { ...o, items };
  });
}
