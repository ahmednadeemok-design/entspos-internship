// Sort items by a field
export const sortBy = (items, key = "name") => {
  // spread creates a new array
  return [...items].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av).localeCompare(String(bv));
  });
};

// Group items by category using Map
export const groupByCategory = (items) => {
  const map = new Map();

  for (const item of items) {
    const category = item.product.category;
    if (!map.has(category)) map.set(category, []);
    map.get(category).push(item);
  }

  return map;
};

// Unique categories using Set
export const getUniqueCategories = (items) => {
  const categories = new Set(items.map((i) => i.product.category));
  return [...categories]; // convert Set to array
};