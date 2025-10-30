import { AdjustStockInput, CreateProductInput, UpdateProductInput } from './product.schemas';
import { listProductsRepo, getProductRepo, createProductRepo, updateProductRepo, adjustStockRepo } from './product.repository';

export function listProductsService() {
  return listProductsRepo();
}
export async function getProductService(id: string) {
  const p = await getProductRepo(id);
  if (!p) throw Object.assign(new Error('Produto não encontrado'), { status: 404 });
  return p;
}
export function createProductService(input: CreateProductInput) {
  return createProductRepo(input);
}
export async function updateProductService(id: string, input: UpdateProductInput) {
  const p = await updateProductRepo(id, input);
  if (!p) throw Object.assign(new Error('Produto não encontrado'), { status: 404 });
  return p;
}
export async function adjustStockService(id: string, input: AdjustStockInput) {
  const p = await adjustStockRepo(id, input.delta, input.reason);
  if (!p) throw Object.assign(new Error('Produto não encontrado'), { status: 404 });
  return p;
}
