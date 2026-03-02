import { createCart, addItem, updateQty, removeItem, cloneCart, getCartSummaryJSON } from "./cart.js";
import { Product } from "./product.js";

console.log("=== Modular Shopping Cart (ESM) ===");

// Step 1: create cart
let cart = createCart({ id: "CART-ENTSPOS", currency: "PKR" });

// Step 2: create products using class + static from
const p1 = new Product({ id: "P-1", name: "Keyboard", price: 2500, category: "Electronics" });
const p2 = Product.from({ id: "P-2", name: "Mouse", price: 1200, category: "Electronics" });
const p3 = Product.from({ id: "P-3", name: "Notebook", price: 200, category: "Stationery" });

// Step 3: add items (default qty + destructuring logic inside)
cart = addItem(cart, p1, 1);
cart = addItem(cart, p2, 2);
cart = addItem(cart, p3); // default qty=1

console.log("\nCart after add:");
console.log(getCartSummaryJSON(cart));

// Step 4: update qty
cart = updateQty(cart, "P-2", 1);

// Step 5: remove item
cart = removeItem(cart, "P-3");

console.log("\nCart after update/remove:");
console.log(getCartSummaryJSON(cart));

// Step 6: deep clone cart
const cloned = cloneCart(cart);
console.log("\nCloned cart equals original?", JSON.stringify(cloned) === JSON.stringify(cart));
console.log("Cloned is different object?", cloned !== cart);

// Step 7: dynamic import utils module
console.log("\n=== Dynamic import demo ===");
const utils = await import("./utils.js"); // dynamic import

const grouped = utils.groupByCategory(cart.items);
for (const [category, items] of grouped.entries()) {
  console.log(`Category: ${category} (${items.length} items)`);
}

const uniqueCategories = utils.getUniqueCategories(cart.items);
console.log("Unique categories:", uniqueCategories);

const sortedByName = utils.sortBy(cart.items, "qty"); // sort by qty or other key
console.log("Sorted items by qty:");
console.log(sortedByName.map((i) => ({ name: i.product.name, qty: i.qty })));