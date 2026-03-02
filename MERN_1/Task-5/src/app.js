import { debounce } from "./debounce.js";
import { throttle } from "./throttle.js";
import { isValidEmail, isValidPattern, isValidTitle } from "./validators.js";
import { loadState, saveState } from "./storage.js";

/* ---------------- DOM SELECTORS (querySelector is MOST IMPORTANT) ---------------- */
const form = document.querySelector("#taskForm");
const taskIdEl = document.querySelector("#taskId");

const titleInput = document.querySelector("#titleInput");
const emailInput = document.querySelector("#emailInput");
const patternInput = document.querySelector("#patternInput");

const titleError = document.querySelector("#titleError");
const emailError = document.querySelector("#emailError");
const patternError = document.querySelector("#patternError");

const submitBtn = document.querySelector("#submitBtn");
const cancelBtn = document.querySelector("#cancelBtn");

const list = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");

const container = document.querySelector(".container");

/* ---------------- STATE ---------------- */
let state = loadState(); // { tasks: [...] }
let searchQuery = "";

/* ---------------- HELPERS ---------------- */
function setError(el, msg) {
  el.textContent = msg; // innerText vs textContent (textContent is faster, no layout calc)
}

function clearErrors() {
  setError(titleError, "");
  setError(emailError, "");
  setError(patternError, "");
}

function resetForm() {
  taskIdEl.value = "";
  titleInput.value = "";
  emailInput.value = "";
  patternInput.value = "";
  submitBtn.textContent = "Add Task";
  clearErrors();
}

function validateAll() {
  let ok = true;

  if (!isValidTitle(titleInput.value)) {
    setError(titleError, "Title must be at least 3 characters.");
    ok = false;
  } else setError(titleError, "");

  if (!isValidEmail(emailInput.value)) {
    setError(emailError, "Email is invalid.");
    ok = false;
  } else setError(emailError, "");

  if (!isValidPattern(patternInput.value)) {
    setError(patternError, "Only letters and spaces allowed.");
    ok = false;
  } else setError(patternError, "");

  return ok;
}

/* ---------------- RENDER ---------------- */
function render() {
  // remove old children (DOM manipulation)
  list.innerHTML = "";

  const filtered = state.tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  emptyState.style.display = filtered.length === 0 ? "block" : "none";

  for (const task of filtered) {
    const li = document.createElement("li"); // createElement
    li.className = "taskItem";
    li.setAttribute("data-id", task.id); // attributes

    li.innerHTML = `
      <div class="taskMeta">
        <strong>${task.title}</strong>
        <span class="badge">${task.email}</span>
        <span class="badge">${task.pattern}</span>
      </div>
      <div class="actions">
        <button class="editBtn" data-action="edit">Edit</button>
        <button class="deleteBtn secondary" data-action="delete">Delete</button>
      </div>
    `;

    list.append(li); // append
  }
}

/* ---------------- CRUD ---------------- */
function addTask({ title, email, pattern }) {
  const newTask = {
    id: "t" + Date.now(),
    title,
    email,
    pattern,
  };
  state.tasks = [...state.tasks, newTask]; // spread
  saveState(state);
  render();
}

function updateTask(id, updates) {
  state.tasks = state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
  saveState(state);
  render();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter((t) => t.id !== id);
  saveState(state);
  render();
}

/* ---------------- EVENT DELEGATION (VERY IMPORTANT) ----------------
   We do NOT add click listeners to every button.
   We add ONE listener to the parent UL, and check event.target.
*/
list.addEventListener("click", (e) => {
  const target = e.target;

  // If user clicked something that is NOT a button, ignore
  if (!(target instanceof HTMLElement)) return;

  // DOM traversal: find closest parent list item
  const li = target.closest("li");
  if (!li) return;

  const id = li.getAttribute("data-id");
  const action = target.getAttribute("data-action");

  if (action === "delete") {
    deleteTask(id);
    // if deleting task being edited
    if (taskIdEl.value === id) resetForm();
    return;
  }

  if (action === "edit") {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;

    // Fill form (DOM manipulation)
    taskIdEl.value = task.id;
    titleInput.value = task.title;
    emailInput.value = task.email;
    patternInput.value = task.pattern;

    submitBtn.textContent = "Update Task";
    clearErrors();

    // Traversal example (siblings/parent): scroll into view
    form.scrollIntoView({ behavior: "smooth" });
  }
});

/* ---------------- PREVENT DEFAULT ON SUBMIT ---------------- */
form.addEventListener("submit", (e) => {
  e.preventDefault(); // IMPORTANT requirement

  clearErrors();
  if (!validateAll()) return;

  const id = taskIdEl.value.trim();

  const payload = {
    title: titleInput.value.trim(),
    email: emailInput.value.trim(),
    pattern: patternInput.value.trim(),
  };

  if (!id) {
    addTask(payload);
  } else {
    updateTask(id, payload);
  }

  resetForm();
});

/* ---------------- CANCEL BUTTON ---------------- */
cancelBtn.addEventListener("click", () => resetForm());

/* ---------------- LIVE DEBOUNCED VALIDATION ---------------- */
const debouncedValidate = debounce(() => {
  // validate and show errors live
  validateAll();
}, 400);

titleInput.addEventListener("input", debouncedValidate);
emailInput.addEventListener("input", debouncedValidate);
patternInput.addEventListener("input", debouncedValidate);

/* ---------------- SEARCH (also debounced) ---------------- */
const debouncedSearch = debounce(() => {
  searchQuery = searchInput.value.trim();
  render();
}, 300);

searchInput.addEventListener("input", debouncedSearch);

/* ---------------- THROTTLED RESIZE LAYOUT ---------------- */
const onResize = throttle(() => {
  // Example: if window is small, make list compact
  if (window.innerWidth < 700) {
    container.classList.add("compact"); // classList
  } else {
    container.classList.remove("compact");
  }
}, 250);

window.addEventListener("resize", onResize);

/* ---------------- INITIAL ---------------- */
onResize();
render();