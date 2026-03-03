import { Category, Product } from "./types";

// REQUIRED: Record<Category, Product[]>
export type Inventory = Record<Category, Product[]>;

export function createInventory(): Inventory {
  return {
    Electronics: [],
    Stationery: [],
    Clothing: [],
  };
}

export function addToInventory(inv: Inventory, product: Product): Inventory {
  return {
    ...inv,
    [product.category]: [...inv[product.category], product],
  };
}