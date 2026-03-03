import { isProductDTO } from '../utils/guards';
import { createProductItem, type ProductItem } from '../models/productProto';

// Mock API (e-commerce products)
const URL = 'https://dummyjson.com/products?limit=100';

export async function fetchProducts(): Promise<ProductItem[]> {
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = (await res.json()) as unknown;

  // Validate shape
  if (
    typeof data !== 'object' ||
    data === null ||
    !('products' in data) ||
    !Array.isArray((data as any).products)
  ) {
    throw new Error('Invalid API shape');
  }

  const out: ProductItem[] = [];
  for (const p of (data as any).products) {
    if (!isProductDTO(p)) continue;
    out.push(createProductItem(p));
  }

  return out;
}