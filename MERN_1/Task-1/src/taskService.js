const { validateTitle, validatePriority, validateDueDate } = require("./validators");

function createId() {
  return "t" + Date.now().toString();
}

function addTask(tasks, input, counter) {
  const title = input.title;
  const priority = input.priority;
  const dueDate = input.dueDate;

  validateTitle(title);
  validatePriority(priority);
  validateDueDate(dueDate);

  const today = new Date().toISOString().slice(0, 10);

  const newTask = {
    id: createId(),
    title: title.trim(),
    priority,
    dueDate,
    completed: false,
    createdAt: today,
  };

  const updated = [...tasks, newTask];

  if (counter && typeof counter.increment === "function") {
    counter.increment();
  }

  return updated;
}

function removeTask(tasks, id) {
  const exists = tasks.some((t) => t.id === id);
  if (!exists) {
    throw new Error("No task found with id: " + id);
  }
  return tasks.filter((t) => t.id !== id);
}

function toggleTask(tasks, id) {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) {
    throw new Error("No task found with id: " + id);
  }

  const copy = tasks.map((t) => ({ ...t }));
  copy[idx].completed = !copy[idx].completed;
  return copy;
}

function searchTasks(tasks, keyword) {
  const k = keyword.trim().toLowerCase();
  if (!k) return tasks;
  return tasks.filter((t) => t.title.toLowerCase().includes(k));
}

function sortTasks(tasks, sortBy) {
  const copy = tasks.map((t) => ({ ...t }));

  if (sortBy === "priority") {
    const rank = { HIGH: 1, MEDIUM: 2, LOW: 3 };
    copy.sort((a, b) => rank[a.priority] - rank[b.priority]);
    return copy;
  }

  if (sortBy === "dueDate") {
    copy.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    return copy;
  }

  throw new Error("Invalid sort option. Use 'priority' or 'dueDate'");
}

module.exports = {
  addTask,
  removeTask,
  toggleTask,
  searchTasks,
  sortTasks,
};