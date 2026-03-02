// Enums (useful & required)
export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

// Interface for user (requested)
export interface User {
  id: string;
  name: string;
  email: string;
}

// Interface for task
export interface Task {
  id: string;
  title: string;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: string; // YYYY-MM-DD
  createdBy?: User; // optional param example
}

// Union example: sort can be by priority or dueDate
export type SortBy = "priority" | "dueDate";

// Intersection example: Task with required user
export type TaskWithUser = Task & { createdBy: User };

// Generic reusable helper types
export type KeyOf<T> = keyof T;