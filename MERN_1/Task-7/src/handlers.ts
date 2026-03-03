import { Cart } from "./types";
import { totals } from "./cart";

// Handler function
export function printSummary(cart: Cart) {
  const t = totals(cart);
  return {
    cartId: cart.id,
    itemCount: t.itemCount,
    subtotal: t.subtotal,
  };
}

// REQUIRED: infer ReturnType for handlers
export type PrintSummaryResult = ReturnType<typeof printSummary>;

// Also show Parameters
export type PrintSummaryParams = Parameters<typeof printSummary>;