import { Product } from "./product.js";

// Create an empty cart object
export const createCart = ({ id = "CART-1", currency = "PKR" } = {}) => {
  return {
    id,
    currency,
    items: [], // each item: { product, qty }
    createdAt: new Date().toISOString(),
  };
};

// Deep clone cart using structuredClone (Node 17+)
export const cloneCart = (cart) => {
  return structuredClone(cart);
};

// Add item using destructuring + default params
export const addItem = (cart, productData, qty = 1) => {
  const product = productData instanceof Product ? productData : Product.from(productData);

  if (typeof qty !== "number" || qty <= 0) throw new Error("qty must be > 0");

  // spread create new items list (immutability)
  const items = [...cart.items];

  const idx = items.findIndex((i) => i.product.id === product.id);
  if (idx >= 0) {
    const existing = items[idx];
    // destructuring existing
    const { product: p, qty: oldQty } = existing;
    items[idx] = { product: p, qty: oldQty + qty };
  } else {
    items.push({ product, qty });
  }

  return { ...cart, items };
};

// Remove item
export const removeItem = (cart, productId) => {
  const items = cart.items.filter((i) => i.product.id !== productId);
  return { ...cart, items };
};

// Update quantity using rest/spread
export const updateQty = (cart, productId, qty) => {
  if (typeof qty !== "number" || qty < 0) throw new Error("qty must be >= 0");

  let items = [...cart.items];
  const idx = items.findIndex((i) => i.product.id === productId);
  if (idx === -1) throw new Error("Product not in cart");

  if (qty === 0) {
    items = items.filter((i) => i.product.id !== productId);
  } else {
    const item = items[idx];
    items[idx] = { ...item, qty };
  }

  return { ...cart, items };
};

// Calculate totals using reduce
export const getTotals = (cart) => {
  const subtotal = cart.items.reduce((acc, item) => {
    return acc + item.product.price * item.qty;
  }, 0);

  return {
    subtotal,
    itemCount: cart.items.reduce((acc, item) => acc + item.qty, 0),
  };
};

// JSON summary using template literals
export const getCartSummaryJSON = (cart) => {
  const { subtotal, itemCount } = getTotals(cart);

  const summary = {
    id: cart.id,
    currency: cart.currency,
    itemCount,
    subtotal,
    items: cart.items.map((i) => ({
      product: i.product.toJSON(),
      qty: i.qty,
      lineTotal: i.product.price * i.qty,
    })),
  };

  // template literal (string output)
  return `${JSON.stringify(summary, null, 2)}`;
};