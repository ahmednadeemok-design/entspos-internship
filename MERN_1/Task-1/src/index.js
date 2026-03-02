const { readTasks, writeTasks } = require("./fileStore");
const { addTask, removeTask, toggleTask, searchTasks, sortTasks } = require("./taskService");
const { getStats } = require("./stats");
const { createTaskCounter } = require("./taskCounter");

const counter = createTaskCounter();

function printHelp() {
  console.log("\nCommands:");
  console.log("  help");
  console.log("  list");
  console.log('  add <title> | <priority> | <dueDate(YYYY-MM-DD)>');
  console.log("  remove <id>");
  console.log("  toggle <id>");
  console.log("  search <keyword>");
  console.log("  sort priority");
  console.log("  sort dueDate");
  console.log("  stats");
  console.log("  exit\n");
}

function printTasks(tasks) {
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

function prompt() {
  process.stdout.write("> ");
}

function main() {
  console.log("Task Tracker CLI (JS)");
  printHelp();

  process.stdin.setEncoding("utf8");
  prompt();

  process.stdin.on("data", (input) => {
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
        // format: add title | PRIORITY | YYYY-MM-DD
        const rest = line.slice(4);
        const parts = rest.split("|").map((p) => p.trim());

        if (parts.length !== 3) {
          throw new Error("Use: add <title> | <priority> | <dueDate>");
        }

        const title = parts[0];
        const priority = parts[1].toUpperCase();
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
        const results = searchTasks(tasks, keyword);
        printTasks(results);
        prompt();
        return;
      }

      if (line.startsWith("sort ")) {
        const by = line.split(" ")[1];
        const sorted = sortTasks(tasks, by);
        printTasks(sorted);
        prompt();
        return;
      }

      if (line === "stats") {
        const s = getStats(tasks);
        console.log("Stats:", s);
        prompt();
        return;
      }

      if (line === "exit") {
        console.log("Goodbye!");
        process.exit(0);
      }

      console.log("Unknown command. Type 'help'.");
      prompt();
    } catch (err) {
      console.log("Error:", err.message);
      prompt();
    }
  });
}

main();