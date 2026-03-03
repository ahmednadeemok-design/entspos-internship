// Literal union type
export type Category = "Electronics" | "Stationery" | "Clothing";

// Union type example for IDs
export type ID = string | number;

// Product interface
export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
}

// Cart line item
export interface CartItem {
  product: Product;
  qty: number;
}

// Cart type
export interface Cart {
  id: string;
  items: CartItem[];
}

// Intersection type example
export type ProductWithMeta = Product & { createdAt: string };

// Utility-type requirement:
// Partial<Pick<Product,'name'|'price'>> for updates
export type ProductUpdate = Partial<Pick<Product, "name" | "price">>;

// Mapped type for readonly cart
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// ReadonlyCart
export type ReadonlyCart = DeepReadonly<Cart>;