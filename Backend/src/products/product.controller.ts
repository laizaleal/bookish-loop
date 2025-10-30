import { FastifyInstance } from 'fastify';
import { CreateProductSchema, UpdateProductSchema, AdjustStockSchema } from './product.schemas';
import { listProductsService, getProductService, createProductService, updateProductService, adjustStockService } from './product.service';

export default async function productController(app: FastifyInstance) {
  app.get('/products', async () => listProductsService());

  app.get('/products/:id', async (req) => {
    const { id } = req.params as any;
    return getProductService(id);
  });

  app.post('/products', { preHandler: [app.authGuard] }, async (req) => {
    const input = CreateProductSchema.parse(req.body);
    return createProductService(input);
  });

  app.patch('/products/:id', { preHandler: [app.authGuard] }, async (req) => {
    const { id } = req.params as any;
    const input = UpdateProductSchema.parse(req.body);
    return updateProductService(id, input);
  });

  app.post('/products/:id/adjust-stock', { preHandler: [app.authGuard] }, async (req) => {
    const { id } = req.params as any;
    const input = AdjustStockSchema.parse(req.body);
    return adjustStockService(id, input);
  });
}
