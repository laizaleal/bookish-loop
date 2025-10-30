import { CreateOrderInput } from './order.schemas';
import { createOrderWithItemsRepo, getOrderWithItemsRepo, listOrdersByUserRepo } from './order.repository';

export function createOrderService(userId: string, input: CreateOrderInput) {
  return createOrderWithItemsRepo(userId, input.items);
}
export async function getOrderService(userId: string, orderId: string) {
  const o = await getOrderWithItemsRepo(userId, orderId);
  if (!o) throw Object.assign(new Error('Pedido não encontrado'), { status: 404 });
  return o;
}
export function listMyOrdersService(userId: string) {
  return listOrdersByUserRepo(userId);
}
