const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const emptyMsg = document.getElementById("empty-msg");

// Load todos from localStorage, or start empty
let todos = JSON.parse(localStorage.getItem("todos") || "[]");

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateEmptyMessage() {
  emptyMsg.style.display = todos.length === 0 ? "block" : "none";
}

function renderTodo(todo) {
  const li = document.createElement("li");
  li.classList.add("todo-item");
  if (todo.completed) li.classList.add("completed");
  li.dataset.id = todo.id;

  // Checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("todo-check");
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => toggleTodo(todo.id, li));

  // Text
  const span = document.createElement("span");
  span.classList.add("todo-text");
  span.textContent = todo.text;

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.title = "Delete";
  deleteBtn.innerHTML = "&#10005;"; // ✕
  deleteBtn.addEventListener("click", () => deleteTodo(todo.id, li));

  li.append(checkbox, span, deleteBtn);
  todoList.appendChild(li);
}

function addTodo() {
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }

  const todo = { id: Date.now(), text, completed: false };
  todos.push(todo);
  saveTodos();
  renderTodo(todo);
  updateEmptyMessage();

  input.value = "";
  input.focus();
}

function toggleTodo(id, li) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  todo.completed = !todo.completed;
  li.classList.toggle("completed", todo.completed);
  saveTodos();
}

function deleteTodo(id, li) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();

  // Fade-out animation before removal
  li.style.transition = "opacity 0.2s, transform 0.2s";
  li.style.opacity = "0";
  li.style.transform = "translateX(12px)";
  setTimeout(() => {
    li.remove();
    updateEmptyMessage();
  }, 200);
}

// ── Event listeners ──
addBtn.addEventListener("click", addTodo);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});

// ── Initial render ──
todos.forEach(renderTodo);
updateEmptyMessage();
