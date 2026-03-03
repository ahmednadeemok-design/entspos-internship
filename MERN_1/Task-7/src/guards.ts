import { Product } from "./types";

// typeof guard
export function isNumber(x: unknown): x is number {
  return typeof x === "number";
}

// Custom guard for Product
export function isProduct(x: unknown): x is Product {
  if (typeof x !== "object" || x === null) return false;
  const p = x as Product;
  return (
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    typeof p.price === "number" &&
    typeof p.category === "string"
  );
}

// instanceof guard example
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}