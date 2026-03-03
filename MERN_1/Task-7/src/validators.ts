import { AppError } from "./guards";

// Generic validator with constraints
export type Validator<T> = (value: T) => boolean;

export function validate<T extends object>(
  obj: T,
  rules: Partial<Record<keyof T, Validator<T[keyof T]>>>
): void {
  for (const key in rules) {
    const rule = rules[key];
    if (!rule) continue;

    const value = obj[key];
    const ok = rule(value as any);
    if (!ok) {
      throw new AppError(`Validation failed for field: ${String(key)}`);
    }
  }
}