import type { ProductItem } from '../models/productProto';

export function dedupeById(items: ProductItem[]): ProductItem[] {
  const seen = new Set<number>();
  const out: ProductItem[] = [];

  for (const it of items) {
    if (!seen.has(it.id)) {
      seen.add(it.id);
      out.push(it);
    }
  }
  return out;
}