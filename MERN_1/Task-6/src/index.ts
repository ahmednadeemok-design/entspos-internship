import { readTasks, writeTasks } from "./fileStore";
import { addTask, removeTask, toggleTask, searchTasks, sortTasks } from "./taskService";
import { getStats } from "./stats";
import { createTaskCounter } from "./taskCounter";
import { Priority, SortBy } from "./types";

const counter = createTaskCounter();

function printHelp(): void {
  console.log("\nCommands:");
  console.log("  help");
  console.log("  list");
  console.log("  add <title> | <priority> | <dueDate(YYYY-MM-DD)>");
  console.log("  remove <id>");
  console.log("  toggle <id>");
  console.log("  search <keyword>");
  console.log("  sort priority");
  console.log("  sort dueDate");
  console.log("  stats");
  console.log("  exit\n");
}

function printTasks(tasks: any[]): void {
  if (tasks.length === 0) {
    console.log("No tasks found.");
    return;
  }
  for (const t of tasks) {
    console.log(
      `${t.id} | ${t.completed ? "✅" : "⬜"} | ${t.title} | ${t.priority} | due:${t.dueDate}`
    );
  }
}

function prompt(): void {
  process.stdout.write("> ");
}

function parsePriority(p: string): Priority {
  const up = p.trim().toUpperCase();
  if (up === "LOW") return Priority.LOW;
  if (up === "MEDIUM") return Priority.MEDIUM;
  if (up === "HIGH") return Priority.HIGH;
  throw new Error("Priority must be LOW, MEDIUM, or HIGH");
}

function main(): void {
  console.log("Task Tracker CLI (TypeScript)");
  printHelp();

  process.stdin.setEncoding("utf8");
  prompt();

  process.stdin.on("data", (input: string) => {
    const line = input.trim();

    try {
      let tasks = readTasks();

      if (!line) {
        prompt();
        return;
      }

      if (line === "help") {
        printHelp();
        prompt();
        return;
      }

      if (line === "list") {
        printTasks(tasks);
        prompt();
        return;
      }

      if (line.startsWith("add ")) {
        const rest = line.slice(4);
        const parts = rest.split("|").map((x) => x.trim());
        if (parts.length !== 3) throw new Error("Use: add <title> | <priority> | <dueDate>");

        const title = parts[0];
        const priority = parsePriority(parts[1]);
        const dueDate = parts[2];

        tasks = addTask(tasks, { title, priority, dueDate }, counter);
        writeTasks(tasks);

        console.log("Task added. Created this session:", counter.getCount());
        prompt();
        return;
      }

      if (line.startsWith("remove ")) {
        const id = line.split(" ")[1];
        tasks = removeTask(tasks, id);
        writeTasks(tasks);
        console.log("Task removed:", id);
        prompt();
        return;
      }

      if (line.startsWith("toggle ")) {
        const id = line.split(" ")[1];
        tasks = toggleTask(tasks, id);
        writeTasks(tasks);
        console.log("Task toggled:", id);
        prompt();
        return;
      }

      if (line.startsWith("search ")) {
        const keyword = line.slice(7);
        printTasks(searchTasks(tasks, keyword));
        prompt();
        return;
      }

      if (line.startsWith("sort ")) {
        const by = line.split(" ")[1] as SortBy;
        const sorted = sortTasks(tasks, by);
        printTasks(sorted);
        prompt();
        return;
      }

      if (line === "stats") {
        console.log("Stats:", getStats(tasks));
        prompt();
        return;
      }

      if (line === "exit") {
        console.log("Goodbye!");
        process.exit(0);
      }

      console.log("Unknown command. Type 'help'.");
      prompt();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log("Error:", msg);
      prompt();
    }
  });
}

main();