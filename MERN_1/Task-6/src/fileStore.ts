import fs from "fs";
import path from "path";
import { Task } from "./types";

const DATA_FILE = path.join(__dirname, "..", "tasks.json");

export function readTasks(): Task[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf8").trim();
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("tasks.json must be an array");

    return parsed as Task[];
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error("Failed to read tasks.json: " + msg);
  }
}

export function writeTasks(tasks: Task[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error("Failed to write tasks.json: " + msg);
  }
}