import { Priority } from "./types";

export function isValidDateString(dateStr: string): boolean {
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return false;

  const mo = Number(m[2]);
  const d = Number(m[3]);

  if (mo < 1 || mo > 12) return false;
  if (d < 1 || d > 31) return false;

  const dt = new Date(dateStr + "T00:00:00");
  return !Number.isNaN(dt.getTime());
}

export function validateTitle(title: string): void {
  if (title.trim().length === 0) throw new Error("Title is required");
}

export function validatePriority(priority: Priority): void {
  if (!Object.values(Priority).includes(priority)) {
    throw new Error("Priority must be LOW, MEDIUM, or HIGH");
  }
}

export function validateDueDate(dueDate: string): void {
  if (!isValidDateString(dueDate)) throw new Error("Due date must be YYYY-MM-DD");
}