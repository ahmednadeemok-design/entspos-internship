export type Category = 'electronics' | 'groceries' | 'beauty' | 'fashion' | 'other';

export type ProductItem = {
  id: number;
  title: string;
  price: number;
  stock: number;
  category: Category;
  brand?: string;

  isLowStock(): boolean;
  applyUpdate(update: Partial<Pick<ProductItem, 'title' | 'price' | 'stock'>>): void;
};

function normalizeCategory(raw: string): Category {
  const s = raw.toLowerCase();
  if (s.includes('electronics') || s.includes('laptop') || s.includes('smartphone')) return 'electronics';
  if (s.includes('grocery')) return 'groceries';
  if (s.includes('beauty')) return 'beauty';
  if (s.includes('fashion') || s.includes('mens') || s.includes('womens')) return 'fashion';
  return 'other';
}

const ProductProto: Pick<ProductItem, 'isLowStock' | 'applyUpdate'> = {
  isLowStock: function () {
    return this.stock < 10;
  },
  applyUpdate: function (update) {
    if (update.title !== undefined) this.title = update.title;
    if (update.price !== undefined) this.price = update.price;
    if (update.stock !== undefined) this.stock = update.stock;
  }
};

export function createProductItem(input: {
  id: number;
  title: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
}): ProductItem {
  const obj = {
    id: input.id,
    title: input.title,
    price: input.price,
    stock: input.stock,
    category: normalizeCategory(input.category),
    brand: input.brand
  } as ProductItem;

  Object.setPrototypeOf(obj, ProductProto);
  return obj;
}