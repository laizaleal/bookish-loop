import { FastifyInstance } from 'fastify';
import authController from '../modules/auth/auth.controller';
import productController from '../products/product.controller';
import orderController from '../orders/order.controller';

export default async function registerRoutes(app: FastifyInstance) {
  await app.register(authController);
  await app.register(productController);
  await app.register(orderController);
}
