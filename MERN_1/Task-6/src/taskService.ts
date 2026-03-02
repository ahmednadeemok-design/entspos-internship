import { Priority, SortBy, Task, User } from "./types";
import { validateDueDate, validatePriority, validateTitle } from "./validators";
import { TaskCounter } from "./taskCounter";

// GENERIC: find by property
export function findByProp<T, K extends keyof T>(items: T[], key: K, value: T[K]): T | undefined {
  return items.find((it) => it[key] === value);
}

// GENERIC: sort by key (string or number)
export function sortByKey<T, K extends keyof T>(items: T[], key: K): T[] {
  return [...items].sort((a, b) => {
    const av = a[key];
    const bv = b[key];

    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av).localeCompare(String(bv));
  });
}

function createId(): string {
  return "t" + Date.now().toString();
}

// Optional params + defaults example
export function addTask(
  tasks: Task[],
  input: { title: string; priority: Priority; dueDate: string; createdBy?: User },
  counter?: TaskCounter
): Task[] {
  validateTitle(input.title);
  validatePriority(input.priority);
  validateDueDate(input.dueDate);

  const today = new Date().toISOString().slice(0, 10);

  const newTask: Task = {
    id: createId(),
    title: input.title.trim(),
    priority: input.priority,
    dueDate: input.dueDate,
    completed: false,
    createdAt: today,
    createdBy: input.createdBy, // optional
  };

  counter?.increment();

  return [...tasks, newTask];
}

export function removeTask(tasks: Task[], id: string): Task[] {
  const exists = tasks.some((t) => t.id === id);
  if (!exists) throw new Error("No task found with id: " + id);
  return tasks.filter((t) => t.id !== id);
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("No task found with id: " + id);

  const copy = tasks.map((t) => ({ ...t }));
  copy[idx].completed = !copy[idx].completed;
  return copy;
}

export function searchTasks(tasks: Task[], keyword: string = ""): Task[] {
  const k = keyword.trim().toLowerCase();
  if (!k) return tasks;
  return tasks.filter((t) => t.title.toLowerCase().includes(k));
}

export function sortTasks(tasks: Task[], sortBy: SortBy): Task[] {
  if (sortBy === "dueDate") {
    return sortByKey(tasks, "dueDate");
  }

  // priority custom ordering
  const rank: Record<Priority, number> = {
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
  };

  return [...tasks].sort((a, b) => rank[a.priority] - rank[b.priority]);
}