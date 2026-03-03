// --------------------- Debounce (reusable) ---------------------
function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// --------------------- Throttle (reusable) ---------------------
function throttle(fn, interval) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn(...args);
    }
  };
}

// --------------------- Validators ---------------------
function isValidTitle(title) {
  return String(title).trim().length >= 3;
}
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).trim());
}
function isValidPattern(text) {
  const re = /^[A-Za-z\s]+$/;
  return re.test(String(text).trim());
}

// --------------------- localStorage (JSON) ---------------------
const STORAGE_KEY = "task5_state_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { tasks: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.tasks)) return { tasks: [] };
    return parsed;
  } catch {
    return { tasks: [] };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// --------------------- DOM Selectors (querySelector MOST IMPORTANT) ---------------------
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

const searchInput = document.querySelector("#searchInput");
const taskList = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");

// --------------------- State ---------------------
let state = loadState();
let searchQuery = "";

// --------------------- Helpers ---------------------
function setError(el, msg) {
  // textContent vs innerText: textContent is faster and safer for plain text
  el.textContent = msg;
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
  submitBtn.textContent = "Add";
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

// --------------------- Render (createElement/append/remove + DOM manipulation) ---------------------
function render() {
  // remove all list items
  taskList.innerHTML = "";

  const filtered = state.tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  emptyState.style.display = filtered.length === 0 ? "block" : "none";

  for (const task of filtered) {
    const li = document.createElement("li");
    li.classList.add("taskItem");
    li.setAttribute("data-id", task.id);

    // innerHTML used for simple template (allowed, but be careful in real apps)
    li.innerHTML = `
      <div><b>${task.title}</b></div>
      <div>${task.email}</div>
      <div>${task.pattern}</div>
      <div class="taskActions">
        <button data-action="edit">Edit</button>
        <button data-action="delete">Delete</button>
      </div>
    `;

    taskList.append(li);
  }
}

// --------------------- CRUD ---------------------
function addTask(payload) {
  const newTask = { id: "t" + Date.now(), ...payload };
  state.tasks = [...state.tasks, newTask]; // spread
  saveState(state);
  render();
}

function updateTask(id, payload) {
  state.tasks = state.tasks.map((t) => (t.id === id ? { ...t, ...payload } : t));
  saveState(state);
  render();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter((t) => t.id !== id);
  saveState(state);
  render();
}

// --------------------- Event Delegation (VERY IMPORTANT) ---------------------
// One click listener on parent UL, handle edit/delete by checking event.target
taskList.addEventListener("click", (e) => {
  const target = e.target;

  if (!(target instanceof HTMLElement)) return;

  const action = target.getAttribute("data-action");
  if (!action) return;

  // DOM traversal: find closest li parent
  const li = target.closest("li");
  if (!li) return;

  const id = li.getAttribute("data-id");
  if (!id) return;

  if (action === "delete") {
    deleteTask(id);
    if (taskIdEl.value === id) resetForm();
    return;
  }

  if (action === "edit") {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;

    // Fill form for editing
    taskIdEl.value = task.id;
    titleInput.value = task.title;
    emailInput.value = task.email;
    patternInput.value = task.pattern;

    submitBtn.textContent = "Update";
    clearErrors();

    // DOM traversal example: scroll to top / form
    form.scrollIntoView({ behavior: "smooth" });
  }
});

// --------------------- preventDefault on submit ---------------------
form.addEventListener("submit", (e) => {
  e.preventDefault(); // REQUIRED

  clearErrors();
  if (!validateAll()) return;

  const payload = {
    title: titleInput.value.trim(),
    email: emailInput.value.trim(),
    pattern: patternInput.value.trim(),
  };

  const editId = taskIdEl.value.trim();
  if (!editId) addTask(payload);
  else updateTask(editId, payload);

  resetForm();
});

cancelBtn.addEventListener("click", resetForm);

// --------------------- Live debounced validation ---------------------
const debouncedValidate = debounce(() => {
  validateAll();
}, 400);

titleInput.addEventListener("input", debouncedValidate);
emailInput.addEventListener("input", debouncedValidate);
patternInput.addEventListener("input", debouncedValidate);

// --------------------- Debounced search ---------------------
const debouncedSearch = debounce(() => {
  searchQuery = searchInput.value.trim();
  render();
}, 300);

searchInput.addEventListener("input", debouncedSearch);

// --------------------- Throttled resize (layout update) ---------------------
const onResize = throttle(() => {
  // Toggle a class on body to demonstrate resize changes
  if (window.innerWidth < 600) {
    document.body.classList.add("compact");
  } else {
    document.body.classList.remove("compact");
  }
}, 250);

window.addEventListener("resize", onResize);

// --------------------- Initial ---------------------
onResize();
render();