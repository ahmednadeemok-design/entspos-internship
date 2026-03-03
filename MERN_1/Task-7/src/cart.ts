import { Cart, Product, ProductUpdate, ReadonlyCart } from "./types";
import { AppError } from "./guards";

export function createCart(id: string): Cart {
  return { id, items: [] };
}

export function addItem(cart: Cart, product: Product, qty: number = 1): Cart {
  if (qty <= 0) throw new AppError("qty must be > 0");

  const items = [...cart.items];
  const idx = items.findIndex((i) => i.product.id === product.id);

  if (idx >= 0) {
    const existing = items[idx];
    items[idx] = { ...existing, qty: existing.qty + qty };
  } else {
    items.push({ product, qty });
  }

  return { ...cart, items };
}

export function updateProductInCart(cart: Cart, productId: string, update: ProductUpdate): Cart {
  // REQUIRED: ProductUpdate is Partial<Pick<Product,'name'|'price'>>
  const items = cart.items.map((item) => {
    if (item.product.id !== productId) return item;
    return {
      ...item,
      product: { ...item.product, ...update },
    };
  });

  return { ...cart, items };
}

export function totals(cart: Cart) {
  const subtotal = cart.items.reduce((acc, it) => acc + it.product.price * it.qty, 0);
  return { subtotal, itemCount: cart.items.reduce((a, it) => a + it.qty, 0) };
}

// Mapped type usage: return readonly cart
export function freezeCart(cart: Cart): ReadonlyCart {
  return cart as unknown as ReadonlyCart;
}