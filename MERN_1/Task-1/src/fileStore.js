const fs = require("fs");
const path = require("path");

// tasks.json file path
const DATA_FILE = path.join(__dirname, "..", "tasks.json");

function readTasks() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }

    const raw = fs.readFileSync(DATA_FILE, "utf8").trim();
    if (!raw) return [];

    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
      throw new Error("tasks.json must contain an array");
    }
    return data;
  } catch (err) {
    // re-throw with clear message (will be caught in CLI)
    throw new Error("Failed to read tasks.json: " + err.message);
  }
}

function writeTasks(tasks) {
  try {
    if (!Array.isArray(tasks)) {
      throw new Error("writeTasks expects an array");
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
  } catch (err) {
    throw new Error("Failed to write tasks.json: " + err.message);
  }
}

module.exports = { readTasks, writeTasks };