import { Product, Category } from "./types";
import { isProduct, isAppError } from "./guards";
import { validate } from "./validators";
import { createInventory, addToInventory } from "./inventory";
import { createCart, addItem, updateProductInCart, freezeCart } from "./cart";
import { printSummary } from "./handlers";

console.log("=== TS Shopping Cart (Utility Types) ===");

// Products
const p1: Product = { id: "P1", name: "Keyboard", price: 2500, category: "Electronics" };
const p2: Product = { id: "P2", name: "Notebook", price: 200, category: "Stationery" };

// Type inference example
const chosenCategory: Category = "Electronics";

// Inventory (Record<Category, Product[]>)
let inv = createInventory();
inv = addToInventory(inv, p1);
inv = addToInventory(inv, p2);

console.log("Inventory:", inv[chosenCategory].map((p) => p.name));

// Cart
let cart = createCart("CART-TS");
cart = addItem(cart, p1, 1);
cart = addItem(cart, p2, 2);

// Product update using Partial<Pick<...>>
cart = updateProductInCart(cart, "P1", { price: 2300 });

// Freeze (readonly mapped type)
const roCart = freezeCart(cart);
console.log("Readonly cart id:", roCart.id);

// Handler ReturnType demo
const summary = printSummary(cart);
console.log("Summary:", summary);

// Generic validator with constraints + Partial<Record<...>>
try {
  const unknownInput: unknown = { id: "PX", name: "Mouse", price: 1200, category: "Electronics" };

  // Narrow unknown using custom guard
  if (!isProduct(unknownInput)) throw new Error("Not a Product");

  // Validate object using generic rules
  validate(unknownInput, {
    name: (v) => String(v).trim().length > 0,
    price: (v) => typeof v === "number" && v >= 0,
  });

  console.log("Validated product:", unknownInput.name);
} catch (err: unknown) {
  if (isAppError(err)) {
    console.log("AppError:", err.message);
  } else if (err instanceof Error) {
    console.log("Error:", err.message);
  } else {
    console.log("Unknown error:", String(err));
  }
}