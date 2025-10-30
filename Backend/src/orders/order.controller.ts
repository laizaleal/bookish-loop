import { FastifyInstance } from 'fastify';
import { CreateOrderSchema } from './order.schemas';
import { createOrderService, getOrderService, listMyOrdersService } from './order.service';

export default async function orderController(app: FastifyInstance) {
  app.post('/orders', { preHandler: [app.authGuard] }, async (req: any, reply) => {
    const input = CreateOrderSchema.parse(req.body);
    const order = await createOrderService(req.user.sub as string, input);
    return reply.code(201).send(order);
  });

  app.get('/orders/my', { preHandler: [app.authGuard] }, async (req: any) => {
    return listMyOrdersService(req.user.sub as string);
  });

  app.get('/orders/:id', { preHandler: [app.authGuard] }, async (req: any) => {
    const { id } = req.params as { id: string };
    return getOrderService(req.user.sub as string, id);
  });
}
