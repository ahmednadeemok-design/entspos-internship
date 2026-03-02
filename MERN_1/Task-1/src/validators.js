const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

function isValidDateString(dateStr) {
  // Basic YYYY-MM-DD check
  if (typeof dateStr !== "string") return false;
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return false;

  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);

  if (mo < 1 || mo > 12) return false;
  if (d < 1 || d > 31) return false;

  // Convert to Date and validate
  const dt = new Date(dateStr + "T00:00:00");
  return !Number.isNaN(dt.getTime());
}

function validateTitle(title) {
  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error("Title is required");
  }
}

function validatePriority(priority) {
  if (!PRIORITIES.includes(priority)) {
    throw new Error("Priority must be LOW, MEDIUM, or HIGH");
  }
}

function validateDueDate(dueDate) {
  if (!isValidDateString(dueDate)) {
    throw new Error("Due date must be YYYY-MM-DD");
  }
}

module.exports = {
  PRIORITIES,
  validateTitle,
  validatePriority,
  validateDueDate,
  isValidDateString,
};