import { Task } from "./types";

export type Stats = {
  total: number;
  completedCount: number;
  completionPercent: number;
  anyHighIncomplete: boolean;
  allCompleted: boolean;
};

export function getStats(tasks: Task[]): Stats {
  const total = tasks.length;

  const completedCount = tasks.reduce((acc, t) => acc + (t.completed ? 1 : 0), 0);

  const completionPercent = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  const anyHighIncomplete = tasks.some((t) => t.priority === "HIGH" && !t.completed);

  const allCompleted = total === 0 ? false : tasks.every((t) => t.completed);

  return { total, completedCount, completionPercent, anyHighIncomplete, allCompleted };
}