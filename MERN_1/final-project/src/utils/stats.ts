import type { ProductItem } from '../models/productProto';

export function computeStats(items: ProductItem[]) {
  const total = items.length;
  const lowStock = items.reduce((acc, it) => acc + (it.stock < 10 ? 1 : 0), 0);

  const topExpensive = [...items]
    .sort((a, b) => b.price - a.price)
    .slice(0, 5)
    .map((x) => x.title)
    .join(', ');

  return { total, lowStock, topExpensive };
}