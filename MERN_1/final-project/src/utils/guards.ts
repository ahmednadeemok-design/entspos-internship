export type ProductDTO = {
  id: number;
  title: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
};

export function isProductDTO(x: unknown): x is ProductDTO {
  if (typeof x !== 'object' || x === null) return false;
  const p = x as ProductDTO;
  return (
    typeof p.id === 'number' &&
    typeof p.title === 'string' &&
    typeof p.price === 'number' &&
    typeof p.stock === 'number' &&
    typeof p.category === 'string'
  );
}